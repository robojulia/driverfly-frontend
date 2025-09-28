import { ArcElement, Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useTranslation } from '../../hooks/use-translation';
import { EmptyState } from './empty-state';
Chart.register(ArcElement);
Chart.register(ChartDataLabels);

export interface PieChartProps {
  title: string;
  labels: string[];
  data?: number[];
  disableRerender?: boolean | (() => boolean);
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  centerValue?: number;
  centerLabel?: string | JSX.Element;
}

export const randomRgbColor = (): string => {
  let r = Math.floor(Math.random() * 256); // Random between 0-255
  let g = Math.floor(Math.random() * 256); // Random between 0-255
  let b = Math.floor(Math.random() * 256); // Random between 0-255
  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

export function PieChart(props: PieChartProps): JSX.Element {
  const {
    title,
    labels,
    data = [],
    emptyStateTitle,
    emptyStateMessage,
    centerValue,
    centerLabel,
  } = props;

  const { t } = useTranslation();
  const [chartKey, setChartKey] = useState(0);

  // Gradient colors for the chart
  const gradientColors = [
    { start: '#4ade80', end: '#16a34a' }, // Green gradient
    { start: '#60a5fa', end: '#2563eb' }, // Blue gradient  
    { start: '#fbbf24', end: '#d97706' }, // Yellow/Orange gradient
    { start: '#f87171', end: '#dc2626' }, // Red gradient
    { start: '#a78bfa', end: '#7c3aed' }, // Purple gradient
    { start: '#22d3ee', end: '#0891b2' }, // Cyan gradient
  ];

  // Solid colors for legend (using gradient start colors)
  const legendColors = [
    '#4ade80', // Green
    '#60a5fa', // Blue
    '#fbbf24', // Yellow/Orange
    '#f87171', // Red
    '#a78bfa', // Purple
    '#22d3ee', // Cyan
  ];

  // Create a function to generate gradients
  const createGradients = (ctx: CanvasRenderingContext2D, chartArea: any) => {
    return gradientColors.map(({ start, end }) => {
      const gradient = ctx.createRadialGradient(
        chartArea.left + (chartArea.right - chartArea.left) / 2,
        chartArea.top + (chartArea.bottom - chartArea.top) / 2,
        0,
        chartArea.left + (chartArea.right - chartArea.left) / 2,
        chartArea.top + (chartArea.bottom - chartArea.top) / 2,
        Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top) / 2
      );
      gradient.addColorStop(0, start);
      gradient.addColorStop(1, end);
      return gradient;
    });
  };

  useEffect(() => {
    if (!props?.disableRerender) {
      setChartKey((prevKey) => prevKey + 1);
    }
  }, [data]);

  const hasData = data.length > 0 && data.some((value) => value > 0);

  if (!hasData) {
    return (
      <EmptyState
        title={emptyStateTitle || 'NO_DATA_AVAILABLE'}
        message={emptyStateMessage || 'NO_DATA_MESSAGE'}
      />
    );
  }

  return (
    <div
      className="chart-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '250px',
        maxHeight: '250px',
        gap: '20px',
      }}
    >
      {/* Left column - Donut chart */}
      <div
        style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          flexShrink: 0,
        }}
      >
        <Doughnut
          key={chartKey}
          plugins={[{
            id: 'gradientPlugin',
            beforeRender: (chart: any) => {
              const { ctx, chartArea } = chart;
              if (chartArea) {
                const gradientBackgrounds = createGradients(ctx, chartArea);
                chart.data.datasets[0].backgroundColor = gradientBackgrounds;
              }
            }
          }]}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            cutout: '60%', // Creates the white center circle
            plugins: {
              legend: {
                display: false, // Hide the default legend
              },
              datalabels: {
                display: false, // Hide data labels for cleaner look
              },
            },
            onHover: (event, activeElements) => {
              // Optional: Add hover effects if needed
            },
          }}
          data={{
            labels: labels.map((v) => t(v)),
            datasets: [
              {
                label: t(title),
                data,
                backgroundColor: legendColors, // Use solid colors initially, will be replaced with gradients
                borderWidth: 0,
                hoverBorderWidth: 2,
                hoverBorderColor: '#ffffff',
              },
            ],
          }}
        />
        {/* Center label showing custom value */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#2c3e50',
              lineHeight: 1,
              marginBottom: '2px',
            }}
          >
            {centerValue !== undefined ? centerValue : data.reduce((a, b) => a + b, 0)}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6c757d',
              lineHeight: 1.2,
              whiteSpace: 'pre-line',
            }}
          >
            {centerLabel
              ? typeof centerLabel === 'string'
                ? t(centerLabel)
                : centerLabel
              : 'Total'}
          </div>
        </div>
      </div>

      {/* Right column - Legend */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        {labels.map((label, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: legendColors[index % legendColors.length],
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '0.875rem',
                color: '#374151',
                fontWeight: '500',
              }}
            >
              {t(label)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
