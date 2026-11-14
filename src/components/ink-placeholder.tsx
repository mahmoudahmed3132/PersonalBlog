/**
 * Procedural sumi-e stand-ins for the three hero art layers.
 *
 * They exist so the parallax reads correctly before the real illustration
 * (public/hero/layer-*.png) is dropped in. Deliberately abstract: paper, wash,
 * ridges, an ensō where the subject will stand, and grass. No figure, no car.
 *
 * Every SVG shares the 2400×1350 canvas and horizon (y≈1010) of the real art,
 * and is cropped by the same .ink-canvas box as the PNGs (cover, anchored 70% / bottom).
 */

const W = 2400;
const H = 1350;
const HORIZON = 1010;
const INK = "#141210";
const PAPER = "#f2ede2";

/** Deterministic PRNG so server and client render identical markup. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

const svgProps = {
  viewBox: `0 0 ${W} ${H}`,
  preserveAspectRatio: "none",
  className: "absolute inset-0 h-full w-full",
  "aria-hidden": true,
  focusable: false,
} as const;

/** Ragged, bleeding edge: displace the shape by low-frequency noise. */
function BleedFilter({ id, scale, freq = "0.012 0.05", blur = 0 }: { id: string; scale: number; freq?: string; blur?: number }) {
  return (
    <filter id={id} x="-10%" y="-20%" width="120%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={3} seed={7} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" result="d" />
      {blur ? <feGaussianBlur in="d" stdDeviation={blur} /> : null}
    </filter>
  );
}

/**
 * Dry brush: streaky noise, stretched along the stroke direction, punches thin
 * gaps into otherwise solid ink. `solid` raises the threshold (more ink, fewer gaps).
 */
function DryBrushFilter({ id, freq = "0.002 0.06", solid = 1, edge = 10 }: { id: string; freq?: string; solid?: number; edge?: number }) {
  // alpha = k·noise − b: zero below ~0.33, solid above ~0.47 (fractal noise centres on 0.5).
  const k = 7;
  const b = (2.4 - (solid - 1) * 0.6).toFixed(2);
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={11} result="edge" />
      <feDisplacementMap in="SourceGraphic" in2="edge" scale={edge} xChannelSelector="R" yChannelSelector="G" result="shape" />
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={3} seed={4} result="streak" />
      <feColorMatrix in="streak" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${k} 0 0 0 -${b}`} result="mask" />
      <feComposite in="shape" in2="mask" operator="in" />
    </filter>
  );
}

/** Layer 0 — opaque: washi paper, cloud wash, far ridges in mist, horizon. */
export function InkSkyPlaceholder() {
  return (
    <svg {...svgProps}>
      <defs>
        <filter id="ink-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={2} result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0.16 0" />
        </filter>
        <filter id="ink-fibre" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.09" numOctaves={2} seed={9} result="f" />
          <feColorMatrix in="f" type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.34  0 0 0 0 0.25  0 0 0 0.12 -0.02" />
        </filter>
        <BleedFilter id="ink-wash" scale={90} freq="0.004 0.03" blur={14} />
        <BleedFilter id="ink-ridge" scale={26} freq="0.01 0.06" blur={1.2} />
        <DryBrushFilter id="ink-horizon" freq="0.003 0.2" solid={0.8} edge={6} />
        <linearGradient id="ink-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="ink-mist-mask" maskUnits="userSpaceOnUse" x="0" y="560" width={W} height={HORIZON - 560 + 40}>
          <rect x="0" y="560" width={W} height={HORIZON - 560 + 40} fill="url(#ink-mist)" />
        </mask>
      </defs>

      <rect width={W} height={H} fill={PAPER} />
      <rect width={W} height={H} filter="url(#ink-fibre)" />

      {/* Cloud wash: a few very diluted horizontal sweeps. */}
      <g filter="url(#ink-wash)" fill={INK}>
        <path d="M-80 250 C 400 170, 900 300, 1500 210 S 2300 260, 2500 190 L 2500 330 C 2000 360, 1500 300, 1000 360 S 200 320, -80 380 Z" opacity="0.06" />
        <path d="M600 470 C 1000 420, 1500 500, 1900 440 S 2400 470, 2520 450 L 2520 520 C 2100 540, 1600 520, 1200 545 S 700 530, 600 520 Z" opacity="0.05" />
      </g>

      {/* Far ridges fading into mist at their base. */}
      <g mask="url(#ink-mist-mask)" filter="url(#ink-ridge)" fill={INK}>
        <path
          d="M-40 820 C 160 760, 300 700, 470 720 C 600 735, 690 650, 820 640 C 980 628, 1080 720, 1230 700 C 1400 676, 1500 600, 1660 610 C 1820 620, 1930 700, 2080 690 C 2240 680, 2330 640, 2460 660 L 2460 1060 L -40 1060 Z"
          opacity="0.1"
        />
        <path
          d="M-40 900 C 200 860, 360 800, 560 830 C 720 852, 820 790, 980 800 C 1160 812, 1250 880, 1440 860 C 1620 842, 1700 790, 1880 805 C 2060 820, 2200 870, 2460 840 L 2460 1060 L -40 1060 Z"
          opacity="0.17"
        />
      </g>

      {/* Horizon: one dry, fast stroke. */}
      <path
        d={`M-20 ${HORIZON} C 500 ${HORIZON - 8}, 1100 ${HORIZON + 6}, 1600 ${HORIZON - 3} S 2300 ${HORIZON + 4}, 2420 ${HORIZON}`}
        stroke={INK}
        strokeWidth="7"
        fill="none"
        opacity="0.55"
        filter="url(#ink-horizon)"
      />
      <rect x="0" y={HORIZON} width={W} height={H - HORIZON} fill={INK} opacity="0.035" />

      <rect width={W} height={H} filter="url(#ink-grain)" />
    </svg>
  );
}

/**
 * Layer 1 — transparent: near hill on the right and an ensō marking where the
 * figure and car will stand, plus the single permitted red seal.
 */
export function InkSubjectPlaceholder() {
  return (
    <svg {...svgProps}>
      <defs>
        <DryBrushFilter id="ink-hill" freq="0.0015 0.11" solid={1.6} edge={22} />
        <BleedFilter id="ink-enso" scale={14} freq="0.02 0.02" />
        <BleedFilter id="ink-seal" scale={5} freq="0.08" />
      </defs>

      <path
        d={`M980 ${H + 20} C 1180 ${HORIZON + 120}, 1420 ${HORIZON - 70}, 1760 ${HORIZON - 110} C 2000 ${HORIZON - 135}, 2220 ${HORIZON - 80}, 2440 ${HORIZON - 140} L 2440 ${H + 20} Z`}
        fill={INK}
        opacity="0.78"
        filter="url(#ink-hill)"
      />

      {/* Ensō: a near-closed circle in one breath, heavy start, dry tail. */}
      <g filter="url(#ink-enso)" fill="none" stroke={INK} strokeLinecap="round">
        <path d="M1776 347 A 280 280 0 1 0 1922 470" strokeWidth="44" opacity="0.88" />
      </g>

      <g transform="translate(2010 720)" filter="url(#ink-seal)">
        <rect width="64" height="64" rx="5" fill="#a8322a" opacity="0.9" />
        <text
          x="32"
          y="42"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="26"
          fontWeight="700"
          fill={PAPER}
          letterSpacing="1"
        >
          MH
        </text>
      </g>
    </svg>
  );
}

/** Layer 2 — transparent: tall ink grass and ground strokes along the bottom. */
export function InkForegroundPlaceholder() {
  const rand = rng(1729);
  const blades: string[] = [];
  const opacities: number[] = [];

  for (let i = 0; i < 190; i++) {
    // Denser at the edges, thinner in the middle third so the scene breathes.
    const u = rand();
    const x = u < 0.5 ? Math.pow(u * 2, 1.6) * 0.42 * W : W - Math.pow((1 - u) * 2, 1.6) * 0.5 * W;
    const base = H + 10;
    const height = 90 + Math.pow(rand(), 1.8) * (x > W * 0.55 ? 380 : 260);
    const lean = (rand() - 0.35) * height * 0.55;
    const width = 5 + rand() * 9;
    const tipX = x + lean;
    const tipY = base - height;
    const c1x = x + lean * 0.15;
    const c1y = base - height * 0.55;
    blades.push(
      `M${r1(x - width)} ${base} Q ${r1(c1x - width * 0.4)} ${r1(c1y)} ${r1(tipX)} ${r1(tipY)} Q ${r1(c1x + width * 0.5)} ${r1(c1y + 6)} ${r1(x + width)} ${base} Z`,
    );
    opacities.push(Math.round((0.45 + rand() * 0.55) * 100) / 100);
  }

  return (
    <svg {...svgProps}>
      <defs>
        <DryBrushFilter id="ink-grass" freq="0.03 0.003" solid={1.2} edge={4} />
        <DryBrushFilter id="ink-ground" freq="0.002 0.12" solid={0.9} edge={12} />
      </defs>

      <g filter="url(#ink-ground)" stroke={INK} strokeLinecap="round" fill="none">
        <path d="M-40 1300 C 400 1270, 800 1290, 1250 1268" strokeWidth="34" opacity="0.75" />
        <path d="M1500 1312 C 1800 1290, 2100 1300, 2460 1276" strokeWidth="26" opacity="0.6" />
      </g>

      <g filter="url(#ink-grass)" fill={INK}>
        {blades.map((d, i) => (
          <path key={i} d={d} opacity={opacities[i]} />
        ))}
      </g>
    </svg>
  );
}
