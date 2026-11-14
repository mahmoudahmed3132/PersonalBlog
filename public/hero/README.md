# Hero art layers

The home page hero is three stacked layers with pointer parallax. Drop the PNGs
in this folder with these exact names and rebuild. Each file is picked up on
its own at build time, so you can add them one at a time. A missing file falls
back to the procedural ink placeholder for that layer, so the site never
requests a file that isn't there.

| File | Layer | Background | Parallax travel |
| --- | --- | --- | --- |
| `layer-0-sky.png` | Ink-wash sky and distant landscape | Opaque | ±6px |
| `layer-1-subject.png` | Mahmoud with headphones, leaning on the Giulia Quadrifoglio | Transparent | ±14px |
| `layer-2-foreground.png` | Ink grass and brush strokes along the bottom | Transparent | ±28px |

## Specs (all three layers)

- 2400×1350 px (16:9), PNG. Layers 1 and 2 need real alpha. Keep each under about 1.5 MB (`pngquant --quality 70-90` works well on ink art).
- All three layers share one perspective and one horizon, at roughly y = 1010 px, so they composite cleanly.
- Style: Japanese sumi-e brush ink in the manner of seinen samurai manga. High-contrast black ink on warm off-white washi paper (about `#f2ede2`), dry-brush strokes, cross-hatching, lots of empty space. No colour, except optionally one small red seal stamp.
- Subject (layer 1): Mahmoud in a dark jacket with over-ear headphones, eyes closed, listening to music. He leans on the front quarter of an Alfa Romeo Giulia Quadrifoglio (3/4 front view, with the quad exhausts and cloverleaf badge recognisable), standing in tall grass at dusk.

## Composition, because of the crop

- The art fills the viewport like `object-fit: cover`, anchored at **70% horizontally and at the bottom**.
- Centre the figure and car around **x ≈ 1680 px** and keep them inside **x 1250–2150 px**. On a 390 px phone only about x 1180–1890 is visible.
- Keep the **left 45%** (x < 1080) and the **top third** mostly empty paper. That's where the headline sits. A light paper-coloured scrim is drawn over that area, but empty space reads better than any scrim.
- Keep everything important at least 40 px from every edge, because the layers move by up to 28 px plus bleed.

## Dark mode

The art isn't inverted, because inverting an ink portrait turns it into a photo negative. In dark mode it's dimmed (`brightness(0.76)`), like a print hanging in a dark room, and the hero text stays ink-coloured on paper.

## Don't

Don't put scans, panels or traced frames from Vagabond, or any other copyrighted work, in this folder. The manga is a style reference only.
