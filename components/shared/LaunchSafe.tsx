"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* Launch-safe mode. copy-rules.md
   wraps every unknown in [PLACEHOLDER: ...] so nothing unfinished looks
   finished; this keeps those markers off the public page until the real
   value lands, without inventing anything:

   - a text element that is only a marker disappears
   - a sentence with a marker inside it disappears whole
   - its container goes too when nothing but a label is left (a stat
     with no figure is collapsed rather than shown half-empty); it never
     climbs past a link, heading or media)
   - anything can opt in or out by hand: data-launch-hide hides that
     element whenever it holds a marker, data-launch-keep stops the climb

   Elements are hidden with an attribute, not removed. A
   MutationObserver catches client-rendered content and route changes.

   Always on since the review toggles were retired (2026-10-09). For a
   QA pass, add ?markers to any URL: the markers show again (and
   <html data-show-markers> lets the launch gates through), which is
   what scripts/launch-audit.mjs does. */

const MARK = "[PLACEHOLDER";
const ATTR = "data-launch-hidden";

function visibleText(el: Element) {
  return (el as HTMLElement).innerText?.replace(/\s+/g, " ").trim() ?? "";
}

function hideFor(textNode: Text) {
  let el = textNode.parentElement;
  if (!el || el.closest("script, style, title")) return;
  // explicit opt-in wins
  const forced = el.closest("[data-launch-hide]");
  if (forced) {
    forced.setAttribute(ATTR, "");
    return;
  }
  // a marker standing as its own sentence inside real copy: hide just the marker
  const v = textNode.nodeValue ?? "";
  const m = v.match(/\[PLACEHOLDER[^\]]*\]/);
  if (m && m.index !== undefined) {
    const before = v.slice(0, m.index).trim();
    const after = v.slice(m.index + m[0].length).trim();
    const ownSentence = (!before || /[.!?:]$/.test(before)) && (!after || /^[.!?]?(\s|$)/.test(after) || /^[A-Z]/.test(after));
    const otherWords = visibleText(el).replace(/\[PLACEHOLDER[^\]]*\]/g, "").trim().length;
    if (ownSentence && otherWords > 30) {
      const mid = textNode.splitText(m.index);
      mid.splitText(m[0].length);
      const span = document.createElement("span");
      span.setAttribute(ATTR, "");
      mid.replaceWith(span);
      span.appendChild(mid);
      return;
    }
  }
  // climb from the marker's element while the container would be left as just a label
  let target: Element = el;
  for (let i = 0; i < 4; i++) {
    const parent: Element | null = target.parentElement;
    if (!parent || parent.matches("main, section, footer, header, body, [data-launch-keep]")) break;
    // what would be left: the parent's words minus this one and minus any other markers
    const rest = visibleText(parent).replace(visibleText(target), "").replace(/\[PLACEHOLDER[^\]]*\]/g, "").trim();
    const meaningful = parent.querySelector("img, video, canvas, a, h1, h2, h3, h4, h5, h6, time, button, input");
    if (rest.length > 12 || meaningful) break;
    target = parent;
  }
  target.setAttribute(ATTR, "");
}

function sweep(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.nodeValue?.includes(MARK) && !n.parentElement?.closest(`[${ATTR}], script, style`)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP,
  });
  const hits: Text[] = [];
  while (walker.nextNode()) hits.push(walker.currentNode as Text);
  hits.forEach(hideFor);
}

export function LaunchSafe() {
  const pathname = usePathname();

  useEffect(() => {
    if (new URLSearchParams(location.search).has("markers")) {
      document.documentElement.setAttribute("data-show-markers", "");
      document.querySelectorAll(`[${ATTR}]`).forEach((e) => e.removeAttribute(ATTR));
      return;
    }
    sweep(document.body);
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        sweep(document.body);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => mo.disconnect();
  }, [pathname]);

  return null;
}
