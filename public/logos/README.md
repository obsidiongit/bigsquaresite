# Partner logo drop folder

Drop the real partner logo SVGs in THIS folder (`public/logos/`).

- One file per partner, lowercase kebab-case names, e.g. `meta.svg`,
  `google-ads.svg`, `microsoft-advertising.svg`, `tiktok.svg`,
  `amazon-ads.svg`, `ahrefs.svg`, `yext.svg`, `wordpress.svg`.
- Prefer the official horizontal wordmark/lockup SVG from each
  brand's press or resources page. Any color is fine: the marquee
  renders them grayscale (color returns on hover).
- They render at 32px tall (28px mobile), so wide-format marks read
  best.

Wiring them in: each entry in `LOGOS` in
`components/sections/home/TrustMarquee.tsx` takes a
`src: "/logos/<file>.svg"` field; a tile falls back to its text
wordmark until its `src` is set. Once the files are here, ask the
agent to wire them up (or add the `src` fields yourself).
