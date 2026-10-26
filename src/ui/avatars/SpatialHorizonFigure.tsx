/** The next generation, drawn as a spatial plan rather than a picture: a floor grid running to a vanishing point, depth
 *  planes, projection lines from three capture points and a head-and-shoulders outline. Deliberately abstract: it shows
 *  what "spatial" means without imitating a MetaHuman render or a 3D demo that does not exist yet. Static, no motion. */
export default function SpatialHorizonFigure({ label }: { label: string }) {
  const floor = Array.from({ length: 11 }, (_, i) => -250 + i * 50);
  const depths = [0, 1, 2, 3, 4, 5].map((i) => 470 + i * i * 9 + i * 28);
  const captures: [number, number][] = [[70, 160], [730, 150], [400, 52]];
  const contour: [number, number][] = [[352, 248], [400, 236], [448, 248], [462, 300], [448, 352], [400, 374], [352, 352], [338, 300]];

  return (
    <svg viewBox="0 0 800 640" role="img" aria-label={label} focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        {/* Floor: lines to the vanishing point, depth bands */}
        <g opacity=".42">
          {floor.map((x) => <line key={x} x1={400 + x * 2.4} y1={640} x2={400 + x * 0.34} y2={470} />)}
          {depths.map((y, i) => <line key={y} x1={400 - 120 - i * 52} y1={y} x2={400 + 120 + i * 52} y2={y} opacity={0.5 + i * 0.08} />)}
        </g>
        {/* Depth planes around the figure */}
        <g opacity=".5">
          <ellipse cx="400" cy="470" rx="190" ry="34" />
          <ellipse cx="400" cy="470" rx="268" ry="50" strokeDasharray="2 7" />
          <ellipse cx="400" cy="470" rx="350" ry="66" opacity=".55" />
        </g>
        {/* Axes */}
        <g opacity=".7">
          <line x1="400" y1="60" x2="400" y2="610" strokeDasharray="1 6" />
          <line x1="120" y1="470" x2="680" y2="470" strokeDasharray="1 6" />
          <line x1="400" y1="470" x2="560" y2="560" strokeDasharray="1 6" />
        </g>
        {/* Projection lines from three capture points to the outline */}
        <g opacity=".34">
          {captures.flatMap(([cx, cy]) => contour.filter((_, i) => i % 2 === 0).map(([x, y]) => (
            <line key={`${cx}-${x}-${y}`} x1={cx} y1={cy} x2={x} y2={y} />
          )))}
        </g>
        {captures.map(([cx, cy]) => (
          <g key={`${cx}-${cy}`} opacity=".9">
            <rect x={cx - 7} y={cy - 7} width="14" height="14" transform={`rotate(45 ${cx} ${cy})`} />
            <circle cx={cx} cy={cy} r="2" fill="currentColor" stroke="none" />
          </g>
        ))}
        {/* Head and shoulders outline */}
        <g strokeWidth="1.4" opacity=".95">
          <path d="M400 232 C 352 232 334 268 336 304 C 338 346 364 380 400 382 C 436 380 462 346 464 304 C 466 268 448 232 400 232 Z" />
          <path d="M378 380 L 372 420 C 316 428 262 446 236 470 M422 380 L 428 420 C 484 428 538 446 564 470" />
          <path d="M336 304 L 464 304" strokeDasharray="2 5" opacity=".7" />
          <path d="M400 232 L 400 382" strokeDasharray="2 5" opacity=".7" />
        </g>
      </g>
      <g fill="currentColor" fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" fontSize="11" letterSpacing="2" opacity=".75">
        <text x="408" y="72">Y</text>
        <text x="664" y="462">X</text>
        <text x="548" y="578">Z</text>
      </g>
    </svg>
  );
}
