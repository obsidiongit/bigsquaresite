"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/shared/Section";
import { Eyebrow } from "@/components/shared/mono";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { cn } from "@/lib/utils";

/* Trust marquee (3.trust.md v2): quiet cataloged proof under the hero.
   Grayscale logos inside bordered tiles (metacci), one seamless row.
   This is the page's ONE velocity-reactive element (STYLE_GUIDE 7.5):
   scroll velocity × 0.5 joins the track speed, clamped to ±3× base,
   decaying 0.9 per frame. Pauses on hover. Reduced motion renders a
   static centered wrapped grid of the same tiles.

   [PLACEHOLDER: real partner logo SVGs in public/logos/. Until they
   are delivered the tiles set the partner NAME as a grayscale
   wordmark; drop an `src` on a logo entry to switch that tile to its
   SVG (32px tall, grayscale-to-color on hover).] List per 3.trust.md:
   confirmed launch set only; a `badges` row can be added later without
   redesign (never imply partner status we do not have). */

type LogoEntry = { name: string; src?: string };

const LOGOS: LogoEntry[] = [
  { name: "Meta" },
  { name: "Google Ads" },
  { name: "Microsoft Advertising" },
  { name: "TikTok" },
  { name: "Amazon Ads" },
  { name: "Ahrefs" },
  { name: "Yext" },
  { name: "WordPress" },
];

function LogoTile({ logo }: { logo: LogoEntry }) {
  return (
    <div className="flex h-[72px] shrink-0 items-center justify-center rounded-[16px] border border-sec-line bg-surf px-7 md:h-[80px] md:px-9">
      {logo.src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={logo.src}
          alt={logo.name}
          className="h-7 w-auto grayscale transition-[filter] duration-[250ms] ease-house hover:grayscale-0 md:h-8"
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
  const paused = useRef(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      /* the one velocity coupling (7.5): scroll px/s × 0.5, clamped to
         ±3× base, decaying 0.9 per frame */
      const scrollY = window.scrollY;
      const vel = dt > 0 ? (scrollY - lastScroll) / dt : 0;
      lastScroll = scrollY;
      boost = boost * 0.9 + vel * 0.5 * 0.1;
      boost = Math.max(-3 * base, Math.min(3 * base, boost));

      if (!paused.current) {
        x -= (base + boost) * dt;
        const half = track.scrollWidth / 2;
        if (half > 0) {
          x = ((x % half) + half) % half;
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
        <Eyebrow className="text-center">
          Some of the partners we work with
        </Eyebrow>

        {reduced ? (
          /* Reduced motion: static centered wrapped grid of the tiles */
          <div className="mx-auto mt-8 grid max-w-[1200px] grid-cols-2 gap-3 px-gutter-x sm:flex sm:flex-wrap sm:justify-center">
            {LOGOS.map((logo) => (
              <LogoTile key={logo.name} logo={logo} />
            ))}
          </div>
        ) : (
          <div
            ref={wrapRef}
            className={cn(
              "mt-8 overflow-hidden",
              "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
            )}
            onPointerEnter={() => (paused.current = true)}
            onPointerLeave={() => (paused.current = false)}
          >
            <div ref={trackRef} className="flex w-max gap-3 pr-3 will-change-transform">
              <div className="flex shrink-0 gap-3">
                {LOGOS.map((logo) => (
                  <LogoTile key={logo.name} logo={logo} />
                ))}
              </div>
              <div aria-hidden className="flex shrink-0 gap-3">
                {LOGOS.map((logo) => (
                  <LogoTile key={`dup-${logo.name}`} logo={logo} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
