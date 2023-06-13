import { Bar } from "react-chartjs-2";
import { useTranslation } from "../../hooks/use-translation";

export interface BarChartProps {
  title: string;
  yearToShow?: number;
  labels: string[];
  data: BarChartDataSets[];
}
interface BarChartDataSets {
  label: string;
  backgroundColor: string;
  borderColor: string;
  data: number[];
  borderWidth: number;
}
export function BarChart(props: BarChartProps): JSX.Element {
  const { title, yearToShow, labels, data } = props;

  const { t } = useTranslation();

  return (
    <Bar
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
