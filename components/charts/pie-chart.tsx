import { useEffect, useState } from "react";
import { ArcElement, Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "../../hooks/use-translation";
Chart.register(ArcElement);
Chart.register(ChartDataLabels);

export interface PieChartProps {
	title: string;
	labels: string[];
	data?: number[];
	disableRerender?: boolean | (() => boolean);
}

export const randomRgbColor = (): string => {
	let r = Math.floor(Math.random() * 256); // Random between 0-255
	let g = Math.floor(Math.random() * 256); // Random between 0-255
	let b = Math.floor(Math.random() * 256); // Random between 0-255
	return "rgb(" + r + "," + g + "," + b + ")";
};

export function PieChart(props: PieChartProps): JSX.Element {
	const { title, labels, data = [] } = props;

	const { t } = useTranslation();

	const [chartKey, setChartKey] = useState(0);

	const [backgroundColor, setBackgroundColor] = useState<string[]>([
		"rgba(29, 67, 84)",
		"rgba(92, 200, 196)",
		"rgba(245, 192, 24)",
		"rgba(90, 11, 11)",
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


	return (
		<Doughnut
			key={chartKey}
			options={{
				maintainAspectRatio: false,
				responsive: true,
				plugins: {
					datalabels: {
						color: function (context) {
							var index = context.dataIndex;
							var value = context.dataset.data[index];
							return value === 0 ? "transparent" : "white";
						},
						font: {
							size: 16,
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
	);
}
