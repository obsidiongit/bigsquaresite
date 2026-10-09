"use client";

import { useEffect, useState } from "react";
import { LAB, LAB_GROUPS, setAllLab, setLab, syncLabAttrs, useLab, type LabKey, type LabValue } from "@/lib/lab";

/* The review toggles panel (lib/lab). Bottom right, collapsible.
   Dev builds show it by default; production only with ?lab=1, and
   ?lab=0 hides it (both remembered). */

function Row<K extends LabKey>({ k }: { k: K }) {
  const value = useLab(k);
  const def = LAB[k];
  return (
    <div className="py-2">
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-white/55">{def.label}</p>
      <div className="flex flex-wrap gap-1">
        {(Object.entries(def.options) as [LabValue<K>, string][]).map(([v, label]) => (
          <button
            key={v}
            type="button"
            onClick={() => setLab(k, v)}
            className={
              "rounded-[6px] px-2 py-1 text-[12px] leading-tight transition-colors " +
              (v === value ? "bg-[#0657F9] text-white" : "bg-white/8 text-white/75 hover:bg-white/15")
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LabPanel() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    syncLabAttrs();
    const q = new URLSearchParams(location.search).get("lab");
    try {
      if (q === "1" || q === "0") localStorage.setItem("bigsquare-lab-panel", q);
      const saved = localStorage.getItem("bigsquare-lab-panel");
      // always on when running locally (dev or a local production build); elsewhere only with ?lab=1
      const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
      setShow(saved ? saved === "1" : local || process.env.NODE_ENV === "development");
      setOpen(localStorage.getItem("bigsquare-lab-open") !== "0");
    } catch {
      setShow(process.env.NODE_ENV === "development");
    }
  }, []);

  if (!show) return null;

  const toggle = () => {
    setOpen((o) => {
      try {
        localStorage.setItem("bigsquare-lab-open", o ? "0" : "1");
      } catch {}
      return !o;
    });
  };

  return (
    <div
      data-lab-panel
      data-lenis-prevent
      className="fixed bottom-4 right-4 z-[90] w-[280px] max-w-[calc(100vw-32px)] rounded-[14px] bg-[#0b0f17]/92 p-3 text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
    >
      <button type="button" onClick={toggle} className="flex w-full items-center justify-between text-left">
        <span className="flex items-center gap-2 text-[13px] font-semibold">
          <span className="size-2.5 bg-[#0657F9]" />
          Review toggles
        </span>
        <span className="font-mono text-[11px] text-white/55">{open ? "hide" : "show"}</span>
      </button>
      {open && (
        <div className="mt-2 max-h-[min(70vh,640px)] overflow-y-auto pr-1">
          <div className="flex gap-1.5 pb-2">
            <button type="button" onClick={() => setAllLab("ours")} className="flex-1 rounded-[6px] bg-[#0657F9] px-2 py-1.5 text-[12px] font-semibold">
              All ours
            </button>
            <button type="button" onClick={() => setAllLab("brad")} className="flex-1 rounded-[6px] bg-white/10 px-2 py-1.5 text-[12px] font-semibold hover:bg-white/15">
              All Brad&apos;s original
            </button>
          </div>
          {LAB_GROUPS.map((g) => (
            <div key={g} className="border-t border-white/15 pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7ea6ff]">{g}</p>
              <div className="divide-y divide-white/10">
                {(Object.keys(LAB) as LabKey[])
                  .filter((k) => LAB[k].group === g)
                  .map((k) => (
                    <Row key={k} k={k} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
