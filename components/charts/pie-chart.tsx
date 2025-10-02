import { ArcElement, Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useTranslation } from '../../hooks/use-translation';
import { EmptyState } from './empty-state';

import styles from './pie-chart.module.css';
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

  // Solid brand colors for the chart
  const chartColors = [
    '#5fcbc4', // Primary teal
    '#B4FD55', // Success green
    '#FED100', // Warning yellow
    '#006078', // Primary button color
    '#1d4354', // Dark teal
    '#cdd7fc', // Light teal
  ];

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
    <div className={styles.chart_container}>
      {/* Chart */}
      <div className={styles.chart_wrapper}>
        <Doughnut
          key={chartKey}
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
                backgroundColor: chartColors, // Use solid brand colors
                borderWidth: 0,
                hoverBorderWidth: 2,
                hoverBorderColor: '#ffffff',
              },
            ],
          }}
        />
        {/* Center label showing custom value */}
        <div className={styles.center_label}>
          <div className={styles.center_value}>
            {centerValue !== undefined ? centerValue : data.reduce((a, b) => a + b, 0)}
          </div>
          <div className={styles.center_text}>
            {centerLabel
              ? typeof centerLabel === 'string'
                ? t(centerLabel)
                : centerLabel
              : 'Total'}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend_container}>
        {labels.map((label, index) => (
          <div key={index} className={styles.legend_item}>
            <div
              className={styles.legend_dot}
              style={{
                backgroundColor: chartColors[index % chartColors.length],
              }}
            />
            <span className={styles.legend_text}>{t(label)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
