"use client";

import { useSyncExternalStore } from "react";

/* Review toggles (the "lab"): each proposed upgrade to the homepage
   sits behind a switch so a reviewer can flip between the shipped
   version and the alternatives on the live page. The panel
   (components/shared/LabPanel) shows in dev, or anywhere with ?lab=1;
   ?lab=0 hides it again. Choices persist per browser (localStorage),
   and ?<key>=<value> in the URL overrides them for a shared link.

   When a choice is final: hard-code it, delete its entry here, and
   remove the losing branch from the component. */

import { LAB, LAB_GROUPS } from "@/lib/lab-config";

export { LAB, LAB_GROUPS };

export type LabKey = keyof typeof LAB;
export type LabValue<K extends LabKey> = keyof (typeof LAB)[K]["options"] & string;

const STORE = "bigsquare-lab";
const listeners = new Set<() => void>();
let state: Record<string, string> | null = null;

function load(): Record<string, string> {
  if (state) return state;
  const s: Record<string, string> = {};
  for (const k of Object.keys(LAB) as LabKey[]) s[k] = LAB[k].default;
  try {
    Object.assign(s, JSON.parse(localStorage.getItem(STORE) || "{}"));
  } catch {}
  const q = new URLSearchParams(location.search);
  for (const k of Object.keys(LAB) as LabKey[]) {
    const v = q.get(k);
    if (v && v in LAB[k].options) s[k] = v;
  }
  // drop stale values from an older option list
  for (const k of Object.keys(LAB) as LabKey[]) if (!(s[k] in LAB[k].options)) s[k] = LAB[k].default;
  state = s;
  return s;
}


/** Every toggle at once: "ours" = each toggle's default, "brad" = the shipped original. */
export function setAllLab(which: "ours" | "brad") {
  for (const k of Object.keys(LAB) as LabKey[]) {
    const opts = LAB[k].options as Record<string, string>;
    const v = which === "ours" ? LAB[k].default : "brad" in opts ? "brad" : k === "squares" ? "on" : k === "workPencil" ? "off" : LAB[k].default;
    setLab(k, v as LabValue<typeof k>);
  }
}

export function setLab<K extends LabKey>(key: K, value: LabValue<K>) {
  state = { ...load(), [key]: value };
  try {
    localStorage.setItem(STORE, JSON.stringify(state));
  } catch {}
  document.documentElement.dataset[`lab${key[0].toUpperCase()}${key.slice(1)}`] = value;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** The current choice for one toggle. Server render and the first client frame read the default. */
export function useLab<K extends LabKey>(key: K): LabValue<K> {
  return useSyncExternalStore(
    subscribe,
    () => load()[key] as LabValue<K>,
    () => LAB[key].default as LabValue<K>,
  );
}

/** Mirrors every choice onto <html data-lab-*> so plain CSS can react too. */
export function syncLabAttrs() {
  const s = load();
  for (const k of Object.keys(LAB) as LabKey[]) {
    document.documentElement.dataset[`lab${k[0].toUpperCase()}${k.slice(1)}`] = s[k];
  }
}
