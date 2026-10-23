interface Flower {
  kind: 'peony' | 'carnation';
  x: number;
  y: number;
  r: number;
  color: string;
  delay: number;
}

const FLOWERS: Flower[] = [
  { kind: 'carnation', x: 140, y: 100, r: 28, color: '#f43f5e', delay: 0.15 },
  { kind: 'carnation', x: 262, y: 98, r: 28, color: '#fda4af', delay: 0.25 },
  { kind: 'peony', x: 200, y: 118, r: 50, color: '#f9a8d4', delay: 0.35 },
  { kind: 'peony', x: 128, y: 168, r: 42, color: '#fda4af', delay: 0.5 },
  { kind: 'peony', x: 274, y: 166, r: 42, color: '#fbcfe8', delay: 0.6 },
  { kind: 'carnation', x: 78, y: 218, r: 30, color: '#e11d48', delay: 0.75 },
  { kind: 'carnation', x: 326, y: 214, r: 30, color: '#fb7185', delay: 0.85 },
  { kind: 'carnation', x: 200, y: 214, r: 32, color: '#fff1f2', delay: 0.95 },
];

const LEAVES: [number, number, number][] = [
  [125, 258, -50],
  [275, 258, 50],
  [160, 288, -25],
  [240, 288, 25],
];

const shade = (c: string, pct: number) => `color-mix(in srgb, ${c}, #9d174d ${pct}%)`;

function Peony({ r, color }: { r: number; color: string }) {
  // [petal count, ring scale, darkening %]
  const rings: [number, number, number][] = [[9, 1, 0], [7, 0.72, 18], [5, 0.46, 32]];
  return (
    <>
      {rings.map(([n, s, p], ri) =>
        Array.from({ length: n }, (_, i) => (
          <ellipse
            key={`${ri}-${i}`}
            cx={0}
            cy={-r * s * 0.55}
            rx={r * s * 0.45}
            ry={r * s * 0.5}
            style={{ fill: shade(color, p) }}
            stroke="rgba(157,23,77,.18)"
            transform={`rotate(${(360 / n) * i + ri * 20})`}
          />
        )),
      )}
      <circle r={r * 0.1} fill="#fde68a" />
    </>
  );
}

function Carnation({ r, color }: { r: number; color: string }) {
  // [ruffle count, distance from centre, ruffle size, darkening %]
  const rings: [number, number, number, number][] = [[12, 0.72, 0.3, 0], [9, 0.46, 0.28, 18], [6, 0.2, 0.22, 32]];
  return (
    <>
      {rings.map(([n, d, s, p], ri) =>
        Array.from({ length: n }, (_, i) => {
          const a = (2 * Math.PI * i) / n + ri * 0.4;
          return (
            <circle
              key={`${ri}-${i}`}
              cx={Math.cos(a) * r * d}
              cy={Math.sin(a) * r * d}
              r={r * s}
              style={{ fill: shade(color, p) }}
              stroke="rgba(255,255,255,.6)"
              strokeWidth={1.2}
            />
          );
        }),
      )}
    </>
  );
}

export default function Bouquet() {
  return (
    <svg className="bouquet" viewBox="0 0 400 440" role="img" aria-label="Bouquet of carnations and peonies">
      <g stroke="#4d7c0f" strokeWidth={5} strokeLinecap="round" fill="none">
        {FLOWERS.map((f, i) => (
          <path key={i} d={`M200 340 Q${(200 + f.x) / 2} ${(340 + f.y) / 2 + 20} ${f.x} ${f.y + f.r * 0.4}`} />
        ))}
      </g>

      {LEAVES.map(([x, y, a], i) => (
        <g key={i} className="pop" style={{ animationDelay: `${0.05 + i * 0.07}s` }}>
          <ellipse cx={x} cy={y} rx={34} ry={11} fill="#65a30d" transform={`rotate(${a} ${x} ${y})`} />
        </g>
      ))}

      {FLOWERS.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y})`}>
          <g className="pop" style={{ animationDelay: `${f.delay}s` }}>
            {f.kind === 'peony' ? <Peony r={f.r} color={f.color} /> : <Carnation r={f.r} color={f.color} />}
          </g>
        </g>
      ))}

      <path d="M110 300 L290 300 L224 430 L176 430 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth={3} strokeLinejoin="round" />
      <path d="M200 300 L200 430" stroke="#f9a8d4" strokeWidth={2} />
      <g className="pop" style={{ animationDelay: '1.1s' }}>
        <ellipse cx={172} cy={320} rx={26} ry={14} fill="#e11d48" transform="rotate(-18 172 320)" />
        <ellipse cx={228} cy={320} rx={26} ry={14} fill="#e11d48" transform="rotate(18 228 320)" />
        <circle cx={200} cy={320} r={9} fill="#be185d" />
      </g>
    </svg>
  );
}
