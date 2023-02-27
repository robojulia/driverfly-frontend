import { ArcElement, Chart } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "../../hooks/use-translation";
Chart.register(ArcElement);
Chart.register(ChartDataLabels);

export interface PieChartProps {
  title: string;
  labels: string[];
  data?:any
}

export function PieChart(props: PieChartProps): JSX.Element {
  const { title, labels,data=[] } = props;

  const { t } = useTranslation();

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
