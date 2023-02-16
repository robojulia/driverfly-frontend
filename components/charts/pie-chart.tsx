import React, { useState,DependencyList } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ArcElement);
Chart.register(ChartDataLabels);
import { useTranslation } from "../../hooks/use-translation";
import { useEffectAsync } from "../../utils/react";
import { useAuth } from "../../hooks/use-auth";

export interface PieChartProps {
  title: string;
  labels: string[];
  fetchData: () => Promise<number[]>;
  deps?:DependencyList
}

export function PieChart(props: PieChartProps): JSX.Element {
  const { title, labels, fetchData,deps } = props;

  const { t } = useTranslation();

  const { user } = useAuth();

  const [data, setData] = useState<number[]>([]);

  const refreshData = async () => {
    setData([]);
    const data = await fetchData();

    setData(data);
  };

  useEffectAsync(refreshData, deps ?? []);

  return (
    <Doughnut
      options={{
        maintainAspectRatio: false,
        responsive: true,
        
        plugins: {
          datalabels: {
            color: function(context) {
              var index = context.dataIndex;
              var value = context.dataset.data[index];
              return value === 0 ? 'transparent' :  "white";
            },
            font:{
              size:18
            }
          }
        }
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
