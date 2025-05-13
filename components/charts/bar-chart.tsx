import { Bar } from "react-chartjs-2";
import { useTranslation } from "../../hooks/use-translation";
import { useEffect, useState } from "react";
import { EmptyState } from "./empty-state";

export interface BarChartProps {
  title: string;
  yearToShow?: number;
  labels: string[];
  data: BarChartDataSets[];
  disableRerender?: boolean | (() => boolean);
  emptyStateTitle?: string;
  emptyStateMessage?: string;
}
interface BarChartDataSets {
  label: string;
  backgroundColor: string;
  borderColor: string;
  data: number[];
  borderWidth: number;
}
export function BarChart(props: BarChartProps): JSX.Element {
  const {
    title,
    yearToShow,
    labels,
    data,
    emptyStateTitle,
    emptyStateMessage,
  } = props;

  const { t } = useTranslation();

  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    if (!props.disableRerender) setChartKey((prevKey) => prevKey + 1);
  }, [data]);

  const hasData =
    data.length > 0 &&
    data.some((dataset) => dataset.data.some((value) => value > 0));

  if (!hasData) {
    return (
      <EmptyState
        title={emptyStateTitle || "NO_DATA_AVAILABLE"}
        message={emptyStateMessage || "NO_DATA_MESSAGE"}
      />
    );
  }

  return (
    <Bar
      key={chartKey}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          datalabels: {
            color: "transparent",
          },
          legend: {
            position: "bottom" as const,
          },
        },
      }}
      data={{
        labels: labels.map((v) => t(v)),
        datasets: data,
      }}
    />
  );
}
