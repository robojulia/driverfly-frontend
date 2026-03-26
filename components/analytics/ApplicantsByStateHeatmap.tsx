import React, { useMemo } from 'react';
import { ApplicantsByState } from '../../pages/api/job-analytics';

interface ApplicantsByStateHeatmapProps {
  data: ApplicantsByState[];
}

// Standard US state tile grid cartogram (8 rows × 12 cols, 0-indexed)
const STATE_POSITIONS: { state: string; row: number; col: number }[] = [
  { state: 'AK', row: 0, col: 0 },
  { state: 'ME', row: 0, col: 11 },
  { state: 'WA', row: 1, col: 1 },
  { state: 'MT', row: 1, col: 3 },
  { state: 'ND', row: 1, col: 4 },
  { state: 'MN', row: 1, col: 5 },
  { state: 'WI', row: 1, col: 7 },
  { state: 'MI', row: 1, col: 8 },
  { state: 'VT', row: 1, col: 10 },
  { state: 'NH', row: 1, col: 11 },
  { state: 'ID', row: 2, col: 2 },
  { state: 'WY', row: 2, col: 3 },
  { state: 'SD', row: 2, col: 4 },
  { state: 'IA', row: 2, col: 5 },
  { state: 'IL', row: 2, col: 6 },
  { state: 'IN', row: 2, col: 7 },
  { state: 'OH', row: 2, col: 8 },
  { state: 'PA', row: 2, col: 9 },
  { state: 'NY', row: 2, col: 10 },
  { state: 'MA', row: 2, col: 11 },
  { state: 'OR', row: 3, col: 1 },
  { state: 'NV', row: 3, col: 2 },
  { state: 'CO', row: 3, col: 3 },
  { state: 'NE', row: 3, col: 4 },
  { state: 'MO', row: 3, col: 5 },
  { state: 'KY', row: 3, col: 6 },
  { state: 'WV', row: 3, col: 7 },
  { state: 'VA', row: 3, col: 8 },
  { state: 'MD', row: 3, col: 9 },
  { state: 'NJ', row: 3, col: 10 },
  { state: 'CT', row: 3, col: 11 },
  { state: 'CA', row: 4, col: 1 },
  { state: 'UT', row: 4, col: 2 },
  { state: 'KS', row: 4, col: 4 },
  { state: 'AR', row: 4, col: 5 },
  { state: 'TN', row: 4, col: 6 },
  { state: 'NC', row: 4, col: 7 },
  { state: 'SC', row: 4, col: 8 },
  { state: 'DE', row: 4, col: 9 },
  { state: 'RI', row: 4, col: 11 },
  { state: 'AZ', row: 5, col: 2 },
  { state: 'NM', row: 5, col: 3 },
  { state: 'OK', row: 5, col: 4 },
  { state: 'MS', row: 5, col: 5 },
  { state: 'AL', row: 5, col: 6 },
  { state: 'GA', row: 5, col: 7 },
  { state: 'TX', row: 6, col: 3 },
  { state: 'LA', row: 6, col: 5 },
  { state: 'FL', row: 6, col: 7 },
  { state: 'HI', row: 7, col: 1 },
];

const NUM_ROWS = 8;
const NUM_COLS = 12;

function getHeatColor(count: number, maxCount: number): { bg: string; text: string } {
  if (maxCount === 0 || count === 0) return { bg: '#f0f4f8', text: '#adb5bd' };
  const intensity = count / maxCount;
  if (intensity >= 0.8) return { bg: '#1d4355', text: 'white' };
  if (intensity >= 0.6) return { bg: '#2a5f78', text: 'white' };
  if (intensity >= 0.4) return { bg: '#2ec8c4', text: 'white' };
  if (intensity >= 0.2) return { bg: '#7dd9d7', text: '#1d4355' };
  return { bg: '#c3f0ef', text: '#1d4355' };
}

export const ApplicantsByStateHeatmap: React.FC<ApplicantsByStateHeatmapProps> = ({ data }) => {
  const countByState = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach((d) => {
      map[d.state.toUpperCase()] = d.count;
    });
    return map;
  }, [data]);

  const maxCount = useMemo(() => Math.max(...Object.values(countByState), 0), [countByState]);

  const totalApplicants = useMemo(
    () => Object.values(countByState).reduce((s, c) => s + c, 0),
    [countByState]
  );

  // Build the grid: array of NUM_ROWS arrays, each with NUM_COLS cells
  const grid = useMemo(() => {
    const g: (string | null)[][] = Array.from({ length: NUM_ROWS }, () =>
      Array(NUM_COLS).fill(null)
    );
    STATE_POSITIONS.forEach(({ state, row, col }) => {
      g[row][col] = state;
    });
    return g;
  }, []);

  // Top states for the legend sidebar
  const topStates = useMemo(
    () =>
      [...data]
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
    [data]
  );

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        No state data available for the selected period
      </div>
    );
  }

  const TILE_SIZE = 44;

  return (
    <div>
      {/* Heatmap grid */}
      <div className="d-flex gap-4 flex-wrap">
        <div style={{ overflowX: 'auto', flex: '1 1 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${NUM_COLS}, ${TILE_SIZE}px)`,
              gridTemplateRows: `repeat(${NUM_ROWS}, ${TILE_SIZE}px)`,
              gap: 3,
              minWidth: NUM_COLS * (TILE_SIZE + 3),
            }}
          >
            {grid.flatMap((row, ri) =>
              row.map((state, ci) => {
                if (!state) {
                  return (
                    <div
                      key={`${ri}-${ci}`}
                      style={{ width: TILE_SIZE, height: TILE_SIZE }}
                    />
                  );
                }
                const count = countByState[state] || 0;
                const { bg, text } = getHeatColor(count, maxCount);
                const pct =
                  totalApplicants > 0
                    ? ((count / totalApplicants) * 100).toFixed(1)
                    : '0.0';

                return (
                  <div
                    key={state}
                    title={`${state}: ${count.toLocaleString()} applicants (${pct}%)`}
                    style={{
                      width: TILE_SIZE,
                      height: TILE_SIZE,
                      backgroundColor: bg,
                      borderRadius: 6,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: count > 0 ? 'default' : 'default',
                      transition: 'transform 0.1s',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1)';
                      (e.currentTarget as HTMLDivElement).style.zIndex = '10';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                      (e.currentTarget as HTMLDivElement).style.zIndex = '1';
                    }}
                  >
                    <span
                      style={{
                        color: text,
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {state}
                    </span>
                    {count > 0 && (
                      <span
                        style={{
                          color: text,
                          fontSize: '0.6rem',
                          opacity: 0.85,
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top states sidebar */}
        <div style={{ minWidth: 160, flexShrink: 0 }}>
          <div className="mb-2">
            <small className="fw-bold text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
              Top States
            </small>
          </div>
          {topStates.map((item, i) => {
            const pct =
              totalApplicants > 0
                ? ((item.count / totalApplicants) * 100).toFixed(1)
                : '0.0';
            const { bg } = getHeatColor(item.count, maxCount);
            return (
              <div key={item.state} className="d-flex align-items-center gap-2 mb-2">
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    backgroundColor: bg,
                    flexShrink: 0,
                  }}
                />
                <span className="fw-semibold" style={{ fontSize: '0.8rem', minWidth: 26 }}>
                  {item.state}
                </span>
                <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                  {item.count.toLocaleString()}
                </span>
                <span className="ms-auto text-muted" style={{ fontSize: '0.75rem' }}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color scale legend */}
      <div className="d-flex align-items-center gap-2 mt-3">
        <small className="text-muted">Low</small>
        {['#c3f0ef', '#7dd9d7', '#2ec8c4', '#2a5f78', '#1d4355'].map((color) => (
          <div
            key={color}
            style={{ width: 28, height: 14, backgroundColor: color, borderRadius: 3 }}
          />
        ))}
        <small className="text-muted">High</small>
        <small className="text-muted ms-3">
          {totalApplicants.toLocaleString()} total applicants across {data.length} states
        </small>
      </div>
    </div>
  );
};
