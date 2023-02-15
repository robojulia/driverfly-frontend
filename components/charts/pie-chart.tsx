import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);
import { useTranslation } from "../../hooks/use-translation";
import { useEffectAsync } from "../../utils/react";
import { useAuth } from "../../hooks/use-auth";

export interface PieChartProps {
  title: string;
  labels: string[];
  fetchData: () => Promise<number[]>;
}

export function PieChart(props: PieChartProps): JSX.Element {
  const { title, labels, fetchData } = props;

  const { t } = useTranslation();

  const { user } = useAuth();

  const [data, setData] = useState<number[]>([]);

  const refreshData = async () => {
    setData([]);
    const data = await fetchData();

    setData(data);
  };

  useEffectAsync(refreshData, []);

  return (
    <Doughnut
      options={{
        maintainAspectRatio: false,
        responsive: true,
        animation: {
          duration: 500,
          easing: "easeOutQuart",
          onComplete: function (chartInstance: any) {
            const ctx = chartInstance.chart.ctx;
            ctx.font = "18px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            chartInstance.chart.data.datasets.forEach(function (dataset) {
              const meta = chartInstance.chart.getDatasetMeta(0);
              console.log("chart meta", meta, dataset);
              meta.data.forEach(function (arc, index) {
                const data = dataset.data[index];
                if(data === 0){
                    return;
                }
                const centerX = arc.x;
                const centerY = arc.y;
                const startAngle = arc.startAngle;
                const endAngle = arc.endAngle;
                const angle = endAngle + (endAngle - startAngle) / 2;
                const x = centerX + Math.cos(angle) * (arc.innerRadius * 1.5);
                const y = centerY + Math.sin(angle) * (arc.innerRadius * 1.5);
                ctx.fillStyle = "white";
                ctx.font = "20px Arial";
                ctx.fillText(data, x, y);
              });
            });
          },
        },
      }}
      data={{
        labels: labels.map((v) => t(v)),
        datasets: [
          {
            label: t(title),
            data: data,
            backgroundColor: [
              "rgba(29, 67, 84)",
              "rgba(92, 200, 196)",
              "rgba(245, 192, 24)",
            ],
            borderWidth: 1,
          },
        ],
      }}
    />
  );
}
