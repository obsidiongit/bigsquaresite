// Capture a WebGL-heavy site at multiple scroll depths + extract design-token data.
// Usage: node capture.js <url> <outDir> <prefix> <mode: desktop|mobile> [maxShots]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const [, , url, outDir, prefix, mode = 'desktop', maxShotsArg] = process.argv;
const maxShots = parseInt(maxShotsArg || '14', 10);

const viewport = mode === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 900 };

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || undefined,
    args: [
      '--enable-unsafe-swiftshader',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
    ],
  });
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: mode === 'mobile' ? 2 : 1.5,
    userAgent:
      mode === 'mobile'
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : undefined,
    hasTouch: mode === 'mobile',
  });
  const page = await ctx.newPage();

  page.on('pageerror', (e) => console.log('pageerror:', String(e).slice(0, 200)));

  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(async () => {
    await page.waitForTimeout(5000);
  });

  // let loader/intro animation finish
  await page.waitForTimeout(9000);

  // dismiss cookie/consent banners so they do not occlude frames
  const consentSelectors = [
    'button:has-text("Decline")',
    'button:has-text("Reject")',
    '#onetrust-reject-all-handler',
    'button[aria-label*="close" i]',
    'button:has-text("Accept All")',
    '#onetrust-accept-btn-handler',
  ];
  let dismissed = false;
  for (const frame of page.frames()) {
    for (const sel of consentSelectors) {
      try {
        const btn = await frame.$(sel);
        if (btn && (await btn.isVisible())) {
          await btn.click({ timeout: 3000 });
          console.log('dismissed consent banner via', sel);
          dismissed = true;
          await page.waitForTimeout(1000);
          break;
        }
      } catch {}
    }
    if (dismissed) break;
  }
  if (!dismissed) {
    // fallback: hide consent banner host elements (works even with closed shadow roots)
    const hidden = await page.evaluate(() => {
      let n = 0;
      document.querySelectorAll('body *').forEach((el) => {
        const sig = `${el.id} ${typeof el.className === 'string' ? el.className : ''} ${el.tagName}`.toLowerCase();
        if (/(cookie|consent|onetrust|osano|truste|cmp-banner|gdpr)/.test(sig)) {
          el.style.setProperty('display', 'none', 'important');
          n++;
        }
      });
      return n;
    });
    if (hidden) console.log(`hid ${hidden} consent-related element(s) via CSS fallback`);
  }

  const shot = async (name) =>
    page.screenshot({ path: path.join(outDir, name), type: 'png', timeout: 60000 });

  let i = 0;
  const pad = (n) => String(n).padStart(2, '0');
  await shot(`${prefix}-${mode}-${pad(++i)}-top.png`);

  // scroll via wheel events so virtual-scroll sites respond
  const step = Math.round(viewport.height * 0.85);
  let lastSig = '';
  let sameCount = 0;
  while (i < maxShots) {
    // several small wheel ticks feel more like a user and keep smooth-scroll engaged
    for (let t = 0; t < 5; t++) {
      await page.mouse.wheel(0, step / 5);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(2500); // let smooth scroll settle + animations play
    const name = `${prefix}-${mode}-${pad(++i)}.png`;
    const buf = await shot(name);
    // stop when the page stops changing (bottom reached)
    const sig = buf.length + ':' + buf.slice(2000, 2100).toString('base64');
    if (sig === lastSig) {
      sameCount++;
      if (sameCount >= 2) {
        fs.unlinkSync(path.join(outDir, name));
        i--;
        break;
      }
    } else sameCount = 0;
    lastSig = sig;
  }

  // token extraction (desktop only, once)
  if (mode === 'desktop') {
    const data = await page.evaluate(() => {
      const out = { url: location.href, title: document.title };
      out.meta = {};
      document.querySelectorAll('meta[name], meta[property]').forEach((m) => {
        const k = m.getAttribute('name') || m.getAttribute('property');
        if (/desc|og:|theme/i.test(k)) out.meta[k] = m.getAttribute('content');
      });
      out.fonts = [...new Set([...document.fonts].map((f) => `${f.family} ${f.weight} ${f.style}`))];
      const colors = new Set();
      const easings = new Set();
      const varDecls = {};
      for (const sheet of document.styleSheets) {
        let rules;
        try { rules = sheet.cssRules; } catch { continue; }
        for (const r of rules || []) {
          const css = r.cssText || '';
          (css.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)/g) || []).forEach((c) => colors.add(c));
          (css.match(/cubic-bezier\([^)]+\)/g) || []).forEach((e) => easings.add(e));
          if (r.style) {
            for (const prop of r.style) {
              if (prop.startsWith('--')) varDecls[prop] = r.style.getPropertyValue(prop).trim();
            }
          }
        }
      }
      out.colors = [...colors].slice(0, 120);
      out.easings = [...easings];
      out.cssVariables = varDecls;
      const bodyCS = getComputedStyle(document.body);
      out.bodyStyle = {
        fontFamily: bodyCS.fontFamily,
        fontSize: bodyCS.fontSize,
        background: bodyCS.backgroundColor,
        color: bodyCS.color,
      };
      out.headings = [...document.querySelectorAll('h1,h2,h3')].slice(0, 12).map((h) => {
        const cs = getComputedStyle(h);
        return {
          tag: h.tagName,
          text: (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90),
          fontFamily: cs.fontFamily.split(',')[0],
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          textTransform: cs.textTransform,
        };
      });
      out.links = [...document.querySelectorAll('a[href]')]
        .map((a) => a.getAttribute('href'))
        .filter((h) => h && h.startsWith('/') && h.length > 1);
      out.links = [...new Set(out.links)].slice(0, 40);
      out.scripts = [...document.querySelectorAll('script[src]')].map((s) => s.src).slice(0, 30);
      out.canvasCount = document.querySelectorAll('canvas').length;
      out.textDump = document.body.innerText.replace(/\n{3,}/g, '\n\n').slice(0, 6000);
      return out;
    });
    fs.writeFileSync(path.join(outDir, `${prefix}-extracted-data.json`), JSON.stringify(data, null, 2));
    console.log('extracted: fonts=%d colors=%d easings=%d links=%d canvases=%d',
      data.fonts.length, data.colors.length, data.easings.length, data.links.length, data.canvasCount);
  }

  console.log(`done: ${i} screenshots -> ${outDir}`);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
