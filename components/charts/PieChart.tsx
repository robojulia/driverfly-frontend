import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js'
Chart.register(ArcElement);
import { useTranslation } from "../../hooks/useTranslation";
import { useEffectAsync } from "../../utils/react";
import { useAuth } from "../../hooks/useAuth";


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
                responsive: true
            }}
            data={{
                labels: labels.map(v => t(v)),
                datasets: [{
                    label: t(title),
                    data: data,
                    backgroundColor: [
                        'rgba(29, 67, 84)',
                        'rgba(92, 200, 196)',
                        'rgba(245, 192, 24)',

                    ],
                    borderWidth: 1
                }]
            }}
        />

    );

};