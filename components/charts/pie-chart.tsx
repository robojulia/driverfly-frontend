import { ArcElement, Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "../../hooks/use-translation";
import { EmptyState } from "./empty-state";
Chart.register(ArcElement);
Chart.register(ChartDataLabels);

export interface PieChartProps {
  title: string;
  labels: string[];
  data?: number[];
  disableRerender?: boolean | (() => boolean);
  emptyStateTitle?: string;
  emptyStateMessage?: string;
}

export const randomRgbColor = (): string => {
  let r = Math.floor(Math.random() * 256); // Random between 0-255
  let g = Math.floor(Math.random() * 256); // Random between 0-255
  let b = Math.floor(Math.random() * 256); // Random between 0-255
  return "rgb(" + r + "," + g + "," + b + ")";
};

export function PieChart(props: PieChartProps): JSX.Element {
  const {
    title,
    labels,
    data = [],
    emptyStateTitle,
    emptyStateMessage,
  } = props;

  const { t } = useTranslation();

  const [chartKey, setChartKey] = useState(0);

  const [backgroundColor, setBackgroundColor] = useState<string[]>([
    "#37AEAF",
    "#87F934",
    "#F5BF19",
    "#CDF4FF",
  ]);

  useEffect(() => {
    if (labels?.length > 3)
      labels.forEach((v) =>
        setBackgroundColor([...backgroundColor, randomRgbColor()])
      );
  }, [labels]);

  useEffect(() => {
    if (!props?.disableRerender) setChartKey((prevKey) => prevKey + 1);
  }, [data]);

  const hasData = data.length > 0 && data.some((value) => value > 0);

  if (!hasData) {
    return (
      <EmptyState
        title={emptyStateTitle || "NO_DATA_AVAILABLE"}
        message={emptyStateMessage || "NO_DATA_MESSAGE"}
      />
    );
  }

  return (
    <div className="chart-container">
      <Doughnut
        key={chartKey}
        options={{
          maintainAspectRatio: true,
          responsive: true,
          plugins: {
            legend: {
              maxWidth: 100,
              position: "right",
              labels: {
                boxWidth: 5,

                // padding:  1,
                // boxWidth: 20, // Set the width of the legend color box
                // boxHeight: 20, // Set the height of the legend color box
              },
            },
            datalabels: {
              color: function (context) {
                var index = context.dataIndex;
                var value = context.dataset.data[index];
                return value == 0 ? "transparent" : "white";
              },
              font: {
                size: 18,
              },
            },

            // legend: {
            // 	labels: {
            // 	  font: {
            // 		family:'Poppins'
            // 		// size: , // Adjust the legend font size as needed
            // 	  },
            // 	},
            //   },
          },
        }}
        data={{
          labels: labels.map((v) => t(v)),
          datasets: [
            {
              label: t(title),
              data,
              backgroundColor,
              borderWidth: 0,
            },
          ],
        }}
      />
    </div>
  );
}
