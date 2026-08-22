// Closed-loop stepped capture for scroll-hijacked "film road" sites (built for
// pear.no, generic for any custom-scroller page). The standard capture-reference.js
// wheel walk under-covers very tall roads (pear.no is 5350vh); this one jumps to
// evenly spaced fractions of the road, re-measuring scrollY and re-wheeling until
// the site's lerped scroller actually arrives, then settles long enough for
// lazy-loaded frame sequences to land before shooting.
// Usage: node capture-stepped.js <url> <outDir> <prefix> <mode> <fromPct> <toPct> <stops> <startIndex> <settleMs>
// Example: node capture-stepped.js https://pear.no/ out pear-journey desktop 0 100 16 1 10000
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const [, , url, outDir, prefix, mode = 'desktop', fromArg, toArg, stopsArg, startIdxArg, settleArg] = process.argv;
const fromPct = parseFloat(fromArg || '0');
const toPct = parseFloat(toArg || '100');
const stops = parseInt(stopsArg || '16', 10);
const startIdx = parseInt(startIdxArg || '1', 10);
const settle = parseInt(settleArg || '10000', 10);
const viewport = mode === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 900 };

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || undefined,
    args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: mode === 'mobile' ? 2 : 1.5,
    userAgent: mode === 'mobile'
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : undefined,
    hasTouch: mode === 'mobile',
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(9000);

  const pad = (n) => String(n).padStart(2, '0');
  const road = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  console.log('road px:', road);
  const y = () => page.evaluate(() => scrollY);
  for (let i = 0; i < stops; i++) {
    const frac = (fromPct + ((i + 1) / stops) * (toPct - fromPct)) / 100;
    const target = Math.round(frac * road);
    // closed loop: wheel toward target until the page's own scroller converges
    for (let round = 0; round < 40; round++) {
      const cur = await y();
      const need = target - cur;
      if (Math.abs(need) < road * 0.002) break;
      let left = need;
      while (Math.abs(left) > 0) {
        const chunk = Math.sign(left) * Math.min(Math.abs(left), 4000);
        await page.mouse.wheel(0, chunk);
        left -= chunk;
        await page.waitForTimeout(50);
      }
      await page.waitForTimeout(1500); // let the site's lerp chase the target
    }
    await page.waitForTimeout(settle);
    const idx = startIdx + i;
    await page.screenshot({ path: path.join(outDir, `${prefix}-${mode}-${pad(idx)}.png`), type: 'png', timeout: 60000 });
    const prog = ((await y()) / road * 100).toFixed(1);
    console.log(`stop ${idx}: ${prog}% of road`);
  }
  await browser.close();
  console.log('stepped capture done ->', outDir);
})().catch((e) => { console.error(e); process.exit(1); });
