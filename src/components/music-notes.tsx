/**
 * Ink music notes rising from the headphones in the hero art. Lives inside the
 * subject layer's 2400×1350 canvas box, so it scales and parallaxes with the art.
 * Pure CSS animation (see .music-note in globals.css); off under reduced motion.
 */

/** Ear cup position in layer-1-subject.png, in canvas px. */
const CUP = { x: 1384, y: 505 };

const INK = "#141210";

function Eighth() {
  return (
    <>
      <ellipse cx="0" cy="0" rx="17" ry="11" transform="rotate(-22)" fill={INK} />
      <path d="M14 -4 L14 -74" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M14 -74 C30 -64 38 -46 28 -24" stroke={INK} strokeWidth="6" strokeLinecap="round" fill="none" />
    </>
  );
}

function Beamed() {
  return (
    <>
      <ellipse cx="0" cy="0" rx="16" ry="10.5" transform="rotate(-22)" fill={INK} />
      <ellipse cx="48" cy="-9" rx="16" ry="10.5" transform="rotate(-22 48 -9)" fill={INK} />
      <path d="M13 -4 L13 -74 M61 -13 L61 -83" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M11 -72 L63 -84 L63 -70 L11 -58 Z" fill={INK} />
    </>
  );
}

/** Each note: glyph, end offset from the cup, scale, delay (s). Paths go up and back, away from his face. */
const NOTES = [
  { Glyph: Eighth, dx: 70, dy: -250, s: 0.9, delay: 0 },
  { Glyph: Beamed, dx: 150, dy: -300, s: 0.75, delay: 1.6 },
  { Glyph: Eighth, dx: 30, dy: -320, s: 0.65, delay: 3.1 },
  { Glyph: Beamed, dx: 200, dy: -230, s: 0.6, delay: 4.6 },
];

export function MusicNotes() {
  return (
    <svg
      viewBox="0 0 2400 1350"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
      focusable={false}
    >
      <g transform={`translate(${CUP.x} ${CUP.y})`}>
        {NOTES.map(({ Glyph, dx, dy, s, delay }, i) => (
          <g
            key={i}
            className="music-note"
            style={
              {
                "--dx": `${dx}px`,
                "--dy": `${dy}px`,
                "--s": s,
                animationDelay: `${delay}s`,
              } as React.CSSProperties
            }
          >
            <Glyph />
          </g>
        ))}
      </g>
    </svg>
  );
}
