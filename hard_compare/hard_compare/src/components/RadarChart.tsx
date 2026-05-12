import type { ComputerModel } from '../types';

const COLORS = ['#0071e3', '#5856d6', '#a855f7', '#14b8a6'];
const FILL_OPACITY = 0.12;
const AXES = [
  { label: 'Performance', key: 'performanceScore' as keyof ComputerModel },
  { label: 'Efficiency',  key: 'efficiencyScore'  as keyof ComputerModel },
  { label: 'Value',       key: 'valueScore'        as keyof ComputerModel },
  { label: 'Battery',     key: 'batteryScore'      as keyof ComputerModel },
];

const CX = 160, CY = 155, R = 100, N = AXES.length;
const LABEL_PAD = 24;
const GRID_STEPS = [25, 50, 75, 100];

function toRad(deg: number) { return deg * (Math.PI / 180); }

function axisAngle(i: number) { return toRad((360 / N) * i - 90); }

function axisPoint(i: number, r: number) {
  const a = axisAngle(i);
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function modelPolygon(model: ComputerModel): string {
  return AXES.map((ax, i) => {
    const raw = model[ax.key];
    const score = typeof raw === 'number' ? raw : 60;
    const r = (score / 100) * R;
    const pt = axisPoint(i, r);
    return `${pt.x.toFixed(2)},${pt.y.toFixed(2)}`;
  }).join(' ');
}

function gridPolygon(pct: number): string {
  return Array.from({ length: N }, (_, i) => {
    const pt = axisPoint(i, R * (pct / 100));
    return `${pt.x.toFixed(2)},${pt.y.toFixed(2)}`;
  }).join(' ');
}

interface RadarChartProps {
  models: ComputerModel[];
}

export default function RadarChart({ models }: RadarChartProps) {
  if (models.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox="0 0 320 310"
        aria-label="Radar chart comparing model scores"
        role="img"
        className="w-full max-w-sm"
      >
        {/* Grid rings */}
        {GRID_STEPS.map(pct => (
          <polygon
            key={pct}
            points={gridPolygon(pct)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth={1}
            className="text-apple-gray"
          />
        ))}

        {/* Axis lines */}
        {AXES.map((_, i) => {
          const end = axisPoint(i, R);
          return (
            <line
              key={i}
              x1={CX} y1={CY}
              x2={end.x.toFixed(2)} y2={end.y.toFixed(2)}
              stroke="currentColor"
              strokeOpacity={0.12}
              strokeWidth={1}
              className="text-apple-gray"
            />
          );
        })}

        {/* Axis labels */}
        {AXES.map((ax, i) => {
          const pt = axisPoint(i, R + LABEL_PAD);
          const anchor =
            Math.abs(pt.x - CX) < 5 ? 'middle' :
            pt.x < CX ? 'end' : 'start';
          return (
            <text
              key={ax.label}
              x={pt.x.toFixed(2)}
              y={pt.y.toFixed(2)}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={10}
              fill="currentColor"
              fillOpacity={0.5}
              className="text-apple-gray font-medium"
            >
              {ax.label}
            </text>
          );
        })}

        {/* Score labels on top axis */}
        {GRID_STEPS.map(pct => {
          const pt = axisPoint(0, R * (pct / 100));
          return (
            <text
              key={pct}
              x={(pt.x + 5).toFixed(2)}
              y={pt.y.toFixed(2)}
              fontSize={7.5}
              fill="currentColor"
              fillOpacity={0.35}
              dominantBaseline="middle"
              className="text-apple-gray"
            >
              {pct}
            </text>
          );
        })}

        {/* Model polygons */}
        {models.map((m, idx) => (
          <polygon
            key={m.id}
            points={modelPolygon(m)}
            fill={COLORS[idx % COLORS.length]}
            fillOpacity={FILL_OPACITY}
            stroke={COLORS[idx % COLORS.length]}
            strokeWidth={2}
            strokeOpacity={0.85}
          />
        ))}

        {/* Model dots on each axis */}
        {models.map((m, idx) =>
          AXES.map((ax, i) => {
            const raw = m[ax.key];
            const score = typeof raw === 'number' ? raw : 60;
            const r = (score / 100) * R;
            const pt = axisPoint(i, r);
            return (
              <circle
                key={`${m.id}-${i}`}
                cx={pt.x.toFixed(2)}
                cy={pt.y.toFixed(2)}
                r={3}
                fill={COLORS[idx % COLORS.length]}
                fillOpacity={0.9}
              />
            );
          })
        )}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 justify-center">
        {models.map((m, idx) => (
          <div key={m.id} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              aria-hidden="true"
            />
            <span className="text-xs text-apple-gray dark:text-apple-mid-gray truncate max-w-[120px]">
              {m.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
