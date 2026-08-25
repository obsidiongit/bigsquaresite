"use client";

import { useEffect, useRef, useState } from "react";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { Section } from "@/components/shared/Section";
import { Eyebrow } from "@/components/shared/mono";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { cn } from "@/lib/utils";

/* Trust marquee (3.trust.md v2.3): quiet cataloged proof, one
   seamless row. Open strip: FULL-COLOR logos floating on the ground,
   no tiles (Brad dropped the bordered-tile treatment and the
   grayscale filter 2026-08-24, proof-band session; Youtech's open
   partner strip). This is the page's ONE velocity-reactive element
   (STYLE_GUIDE 7.5): scroll velocity MAGNITUDE × 0.5 joins the track
   speed, clamped to +3× base, decaying 0.9 per frame; either scroll
   direction only speeds the strip up, it never stops or reverses
   (Brad's call, 2026-08-24: no hover pause, no reverse on scroll-up).
   Reduced motion renders a static centered wrapped row.

   Logo SVGs live in public/logos/ (Brad supplies them; README in the
   folder). An entry with `src` renders its SVG at 32px tall (28px
   mobile); `imgClassName` overrides per logo when its SVG carries
   heavy internal padding (prefer cropping the file's viewBox to its
   getBBox instead; files WITHOUT a viewBox must be given one or the
   img clips instead of scaling). An entry without `src` falls back to
   the NAME as a text wordmark (unused since Brad's 2026-08-24 SVG
   drop covered the whole list; text placeholders were removed on his
   call, so a new partner needs its SVG to enter the strip). List per
   3.trust.md v2.5: Brad's full supplied set, ad platforms plus the
   tools we build with; a `badges` row can be added later without
   redesign (never imply partner status we do not have).

   SEAMLESS LOOP: the track renders `copies` identical logo sets and
   wraps the offset on ONE set's measured width. Copies scale with the
   viewport (1 + ceil(viewport / set width), min 2) because two copies
   leave the right edge empty on wide viewports for part of every
   cycle (Brad's catch, 2026-08-24: logos after WordPress vanished
   until the wrap caught up). */

type LogoEntry = { name: string; src?: string; imgClassName?: string };

/* Ordered to alternate wordmarks and compact square icons so neither
   clusters. amazon/anthropic/google-cloud viewBoxes are cropped
   in-file to their content bounds (padded source canvases). */
const LOGOS: LogoEntry[] = [
  { name: "Meta", src: "/logos/meta.svg" },
  { name: "Google Ads", src: "/logos/google-ads.svg" },
  { name: "TikTok", src: "/logos/tiktok-wordmark-light.svg" },
  { name: "Microsoft", src: "/logos/microsoft.svg" },
  { name: "Amazon Ads", src: "/logos/amazon-ads-seeklogo.svg" },
  { name: "Google Analytics", src: "/logos/google-analytics.svg" },
  { name: "Ahrefs", src: "/logos/ahrefs-wordmark-light.svg" },
  { name: "Yext", src: "/logos/yext.svg" },
  { name: "Klaviyo", src: "/logos/klaviyo.svg" },
  { name: "Zoom", src: "/logos/zoom.svg" },
  { name: "Stripe", src: "/logos/stripe.svg" },
  { name: "Google Cloud", src: "/logos/google-cloud.svg" },
  { name: "Vercel", src: "/logos/vercel.svg" },
  { name: "Atlassian", src: "/logos/atlassian.svg" },
  { name: "Webflow", src: "/logos/webflow.svg" },
  { name: "WordPress", src: "/logos/wordpress.svg" },
  { name: "Ghostty", src: "/logos/ghostty.svg" },
  { name: "Unity", src: "/logos/unity.svg" },
  { name: "WebGL", src: "/logos/webgl.svg" },
  { name: "Three.js", src: "/logos/threejs.svg" },
  { name: "Anthropic", src: "/logos/anthropic.svg" },
  { name: "Claude", src: "/logos/claude.svg" },
  { name: "Codex", src: "/logos/codex.svg" },
  { name: "Cursor", src: "/logos/cursor.svg" },
];

function LogoItem({ logo }: { logo: LogoEntry }) {
  return (
    <div className="flex h-16 shrink-0 items-center justify-center md:h-20">
      {logo.src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={logo.src}
          alt={logo.name}
          className={cn("h-7 w-auto md:h-8", logo.imgClassName)}
        />
      ) : (
        <span className="whitespace-nowrap font-sans text-[15px] font-bold text-mid transition-colors duration-[250ms] ease-house hover:text-ink md:text-[17px]">
          {logo.name}
        </span>
      )}
    </div>
  );
}

export function TrustMarquee() {
  const reduced = useReducedMotionSafe();
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* enough copies that the track still covers the viewport at the
     deepest wrap offset; re-measured when the viewport or the set
     resizes (SVGs finishing loading changes the set width) */
  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    const track = trackRef.current;
    const firstSet = track?.children[0] as HTMLElement | undefined;
    if (!wrap || !track || !firstSet) return;
    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const unit = firstSet.getBoundingClientRect().width + gap;
      if (unit > 0) {
        setCopies(Math.max(2, 1 + Math.ceil(wrap.clientWidth / unit)));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    ro.observe(firstSet);
    return () => ro.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced || !inView) return;
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let boost = 0;
    let lastScroll = window.scrollY;
    let lastT = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      const base = window.innerWidth < 768 ? 35 : 50;
      /* the one velocity coupling (7.5): |scroll px/s| × 0.5, clamped
         to +3× base, decaying 0.9 per frame; forward only, so the
         strip speeds up with scroll in EITHER direction and never
         stops or reverses */
      const scrollY = window.scrollY;
      const vel = dt > 0 ? (scrollY - lastScroll) / dt : 0;
      lastScroll = scrollY;
      boost = boost * 0.9 + Math.abs(vel) * 0.5 * 0.1;
      boost = Math.min(3 * base, boost);

      x -= (base + boost) * dt;
      /* wrap on ONE set's width (translate does not affect rect
         width), so the loop stays seamless at any copy count */
      const firstSet = track.children[0] as HTMLElement | undefined;
      if (firstSet) {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const unit = firstSet.getBoundingClientRect().width + gap;
        if (unit > 0) {
          x = ((x % unit) + unit) % unit;
          track.style.transform = `translate3d(${-x}px, 0, 0)`;
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduced, inView]);

  return (
    <Section theme="light" size="none" anchor="trust" className="py-12">
      <div className="relative z-10">
        {/* the hero-circle treatment on the eyebrow (Brad, card sweep
            session: "draw one of the blue circles around... 'Some of
            the partners we work with'"): RoughAnnotation's circle,
            drawing on entry and boiling in place. The px/py padding
            grows the measured box so the ellipse CLEARS the words
            (Brad round 2: the bare text box read "too tight...
            clipping the words" — the flat ellipse crossed the line's
            ends), and the boil runs calmer at 320ms for small type;
            the mt-8 gap keeps the stroke off the marquee row below.
            Budget exception, Brad's ask. */}
        <Eyebrow className="text-center">
          <RoughAnnotation variant="circle" className="px-4 py-2.5" boilMs={320}>
            Some of the partners we work with
          </RoughAnnotation>
        </Eyebrow>

        {reduced ? (
          /* Reduced motion: static centered wrapped row */
          <div className="mx-auto mt-8 flex max-w-[1200px] flex-wrap items-center justify-center gap-x-12 gap-y-4 px-gutter-x md:gap-x-16">
            {LOGOS.map((logo) => (
              <LogoItem key={logo.name} logo={logo} />
            ))}
          </div>
        ) : (
          <div
            ref={wrapRef}
            className={cn(
              "mt-8 overflow-hidden",
              "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
            )}
          >
            <div
              ref={trackRef}
              className="flex w-max gap-12 pr-12 will-change-transform md:gap-16 md:pr-16"
            >
              {Array.from({ length: copies }, (_, i) => (
                <div
                  key={i}
                  aria-hidden={i > 0 || undefined}
                  className="flex shrink-0 gap-12 md:gap-16"
                >
                  {LOGOS.map((logo) => (
                    <LogoItem key={`${i}-${logo.name}`} logo={logo} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
