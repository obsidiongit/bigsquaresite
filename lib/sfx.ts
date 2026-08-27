/* Site sound engine (STYLE_GUIDE.md 7.11). Synthesized Web Audio, zero
   asset files: every sound is generated at play time from the profiles
   measured off lusion.co's reference set (see
   project-sections/reference-images/lusion-audio/ANALYSIS.md).

   Behavior contract (Brad, 2026-08-27): sound is ON by default, muted
   through the nav toggle, preference persisted. The AudioContext can
   only exist after a user gesture (autoplay policy), so SoundProvider
   calls unlock() on the first pointerdown/keydown; play() before that
   is a silent no-op, exactly like the reference site.

   Variants cycle round-robin, not randomly: sequential pitches are why
   rapid hovers read as musical instead of repetitive. All level changes
   are ramps, never cuts.

   Music: drop a loop at public/audio/loop.mp3 (or .ogg) and set
   MUSIC_SRC; it streams through the same master gain with a low-pass
   duck hook for overlays. Until then the slot is inert. */

const STORAGE_KEY = "bs-sound";

/** Set to e.g. "/audio/loop.mp3" once Brad's track lands. */
const MUSIC_SRC: string | null = null;
const MUSIC_VOLUME = 0.35;
const MUSIC_DUCK_HZ = 300; /* lusion's LOW_PASS_FREQ */
const MUSIC_OPEN_HZ = 22050;

const MASTER_VOLUME = 0.6;

export type SfxName = "hover" | "click" | "focus" | "page";

/* Measured pitch centers: hover_0/1/2 sit near 780/1040/1240 Hz (a
   rising triad) and glide UP ~2 semitones across their 40ms life. */
const HOVER_FREQS = [780, 1040, 1240];
const CLICK_FREQS = [1320, 1180];
const FOCUS_FREQS = [1100, 1160, 1220];
const PAGE_VARIANTS = 2;

const MIN_GAP_MS: Record<SfxName, number> = {
  hover: 50,
  click: 40,
  focus: 120,
  page: 300,
};

type Listener = () => void;

class SfxEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private counts: Record<SfxName, number> = { hover: -1, click: -1, focus: -1, page: -1 };
  private lastPlay: Record<SfxName, number> = { hover: 0, click: 0, focus: 0, page: 0 };
  private listeners = new Set<Listener>();
  private _enabled = true;
  private hydrated = false;

  private musicEl: HTMLAudioElement | null = null;
  private musicGain: GainNode | null = null;
  private musicFilter: BiquadFilterNode | null = null;

  /* ---- state / persistence ---- */

  get enabled() {
    if (!this.hydrated && typeof window !== "undefined") {
      this.hydrated = true;
      this._enabled = localStorage.getItem(STORAGE_KEY) !== "off";
    }
    return this._enabled;
  }

  setEnabled(on: boolean) {
    if (this.enabled === on) return;
    this._enabled = on;
    try {
      localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {}
    if (this.ctx && this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setTargetAtTime(on ? MASTER_VOLUME : 0, t, 0.08);
    }
    if (this.musicEl) {
      if (on) void this.musicEl.play().catch(() => {});
      else window.setTimeout(() => this.musicEl?.pause(), 400);
    }
    this.listeners.forEach((fn) => fn());
  }

  toggle() {
    this.setEnabled(!this.enabled);
  }

  subscribe = (fn: Listener) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = () => this.enabled;
  getServerSnapshot = () => true;

  /* ---- lifecycle ---- */

  /** Create/resume the AudioContext. Call from a user gesture only. */
  unlock() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.enabled ? MASTER_VOLUME : 0;
      this.master.connect(this.ctx.destination);
      /* one second of shared white noise for transients and whooshes */
      const sr = this.ctx.sampleRate;
      this.noiseBuf = this.ctx.createBuffer(1, sr, sr);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      this.startMusic();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  /* ---- playback ---- */

  play(name: SfxName) {
    if (!this.enabled || !this.ctx || !this.master || this.ctx.state !== "running") return;
    const now = performance.now();
    if (now - this.lastPlay[name] < MIN_GAP_MS[name]) return;
    this.lastPlay[name] = now;

    const t = this.ctx.currentTime + 0.005;
    switch (name) {
      case "hover": {
        const f = HOVER_FREQS[this.next("hover", HOVER_FREQS.length)];
        this.pop(t, f, 0.5);
        break;
      }
      case "click": {
        const f = CLICK_FREQS[this.next("click", CLICK_FREQS.length)];
        this.pop(t, f, 0.7, 1.5);
        break;
      }
      case "focus": {
        const f = FOCUS_FREQS[this.next("focus", FOCUS_FREQS.length)];
        this.breath(t, f);
        break;
      }
      case "page": {
        this.whoosh(t, this.next("page", PAGE_VARIANTS));
        break;
      }
    }
  }

  private next(name: SfxName, max: number) {
    this.counts[name] = (this.counts[name] + 1) % max;
    return this.counts[name];
  }

  /* Bubble pop: a short sine that glides up ~2 semitones with a fast
     exponential decay, plus a 12ms band-passed noise tick on the onset
     (the "p" of the pop). Matches the measured reference envelope:
     ~6ms attack, dead by 50ms. */
  private pop(t: number, freq: number, vol: number, glide = 1.12) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * 0.92, t);
    osc.frequency.exponentialRampToValueAtTime(freq * glide, t + 0.045);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol * 0.16, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
    osc.connect(g).connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.08);

    const tick = ctx.createBufferSource();
    tick.buffer = this.noiseBuf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = freq * 2.2;
    bp.Q.value = 2;
    const tg = ctx.createGain();
    tg.gain.setValueAtTime(vol * 0.08, t);
    tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);
    tick.connect(bp).connect(tg).connect(this.master!);
    tick.start(t, Math.random());
    tick.stop(t + 0.03);
  }

  /* Focus: a soft airy swell (~380ms of narrow band-passed noise),
     quiet, per the reference set's 0.4 volume. Keyboard-only feedback. */
  private breath(t: number, center: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = center;
    bp.Q.value = 9;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.15);
    g.gain.setValueAtTime(0.05, t + 0.24);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
    src.connect(bp).connect(g).connect(this.master!);
    src.start(t, Math.random());
    src.stop(t + 0.45);
  }

  /* Page whoosh: ~0.9s of band-passed noise. Variant 0 swells early and
     tails off (the reference page_0 shape); variant 1 builds later. The
     filter center sweeps up then settles, which reads as "air moving". */
  private whoosh(t: number, variant: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(380, t);
    bp.frequency.exponentialRampToValueAtTime(1500, t + 0.35);
    bp.frequency.exponentialRampToValueAtTime(700, t + 0.9);
    const g = ctx.createGain();
    const peakAt = variant === 0 ? 0.22 : 0.45;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.11, t + peakAt);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    src.connect(bp).connect(g).connect(this.master!);
    src.start(t, Math.random());
    src.stop(t + 1);
  }

  /* ---- music slot (inert until MUSIC_SRC is set) ---- */

  private startMusic() {
    if (!MUSIC_SRC || !this.ctx || this.musicEl) return;
    const el = document.createElement("audio");
    el.src = MUSIC_SRC;
    el.loop = true;
    el.preload = "auto";
    this.musicEl = el;
    const src = this.ctx.createMediaElementSource(el);
    this.musicFilter = this.ctx.createBiquadFilter();
    this.musicFilter.type = "lowpass";
    this.musicFilter.frequency.value = MUSIC_OPEN_HZ;
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0;
    src.connect(this.musicFilter).connect(this.musicGain).connect(this.master!);
    if (this.enabled) {
      void el.play().catch(() => {});
      this.musicGain.gain.setTargetAtTime(MUSIC_VOLUME, this.ctx.currentTime, 1.2);
    }
  }

  /** Muffle the music under overlays (nav menu open, dialogs). */
  duckMusic(on: boolean) {
    if (!this.ctx || !this.musicFilter) return;
    this.musicFilter.frequency.setTargetAtTime(
      on ? MUSIC_DUCK_HZ : MUSIC_OPEN_HZ,
      this.ctx.currentTime,
      0.15,
    );
  }
}

export const sfx = new SfxEngine();

/* dev-only handle for the visual/audio check pipeline */
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  (window as unknown as { __sfx: SfxEngine }).__sfx = sfx;
}
