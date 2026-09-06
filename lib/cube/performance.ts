import type { FrameStats } from "./types";

type TimerExtension = { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number };

/** Asynchronous GPU queries, never gl.finish(), so observation does not stall rendering. */
export function createFrameMeter(gl: WebGL2RenderingContext) {
  const ext = gl.getExtension("EXT_disjoint_timer_query_webgl2") as TimerExtension | null;
  const pending: WebGLQuery[] = [];
  const frames: number[] = [];
  const cpu: number[] = [];
  const gpu: number[] = [];
  let query: WebGLQuery | null = null;
  let start = 0;
  let warmup = 60;
  let count = 0;
  const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);

  return {
    begin() {
      if (ext && pending.length < 4) {
        query = gl.createQuery();
        if (query) gl.beginQuery(ext.TIME_ELAPSED_EXT, query);
      }
      start = performance.now();
    },
    end(delta: number) {
      const ms = performance.now() - start;
      if (query && ext) {
        gl.endQuery(ext.TIME_ELAPSED_EXT);
        pending.push(query);
        query = null;
      }
      if (warmup > 0) warmup--;
      else {
        frames.push(delta * 1000);
        cpu.push(ms);
        count++;
        if (frames.length > 240) frames.shift();
        if (cpu.length > 240) cpu.shift();
      }
      while (ext && pending.length && gl.getQueryParameter(pending[0], gl.QUERY_RESULT_AVAILABLE)) {
        const next = pending.shift()!;
        if (!gl.getParameter(ext.GPU_DISJOINT_EXT) && warmup === 0) {
          gpu.push(Number(gl.getQueryParameter(next, gl.QUERY_RESULT)) / 1e6);
          if (gpu.length > 240) gpu.shift();
        }
        gl.deleteQuery(next);
      }
    },
    snapshot(dpr: number, steps: FrameStats["steps"]): FrameStats {
      const sorted = [...frames].sort((a, b) => a - b);
      return {
        cpuMs: mean(cpu), gpuMs: gpu.length ? mean(gpu) : null,
        frameMs: mean(frames), p95Ms: sorted[Math.floor(sorted.length * 0.95)] ?? 0,
        dpr, frames: count, steps: [...steps],
      };
    },
    dispose() {
      for (const item of pending) gl.deleteQuery(item);
      if (query) gl.deleteQuery(query);
    },
  };
}
