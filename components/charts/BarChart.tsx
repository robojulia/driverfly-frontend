import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "../../hooks/useTranslation";
import { useEffectAsync } from "../../utils/react";
import { useAuth } from "../../hooks/useAuth";

export interface BarChartProps {
    title: string;
    yearToShow?: number;
    labels: string[];
    fetchData: () => Promise<number[]>;
}

export function BarChart(props: BarChartProps): JSX.Element {
    const { title, yearToShow, labels, fetchData } = props;

    const { t } = useTranslation();
    const { user } = useAuth();

    const [data, setData] = useState<number[]>([]);
    const resetData = () => { setData([]) }

    const refreshData = async () => {
        resetData()
        const data = await fetchData();

        setData(data);
    };

    useEffectAsync(refreshData, []);

    return (
        <Bar
            options={{
                maintainAspectRatio: false,
                responsive: true
            }}
            data={{
                labels: labels.map(v => t(v)),
                datasets: [{
                    label: `${t(title)} - ${yearToShow}`,
                    data: data,
                    backgroundColor: [
                        'rgba(29, 67, 84)',
                        'rgba(92, 200, 196)',
                        'rgba(245, 192, 24)',
                    ],
                    borderColor: [
                        'rgba(29, 67, 84)',
                        'rgba(92, 200, 196)',
                        'rgba(245, 192, 24)',
                    ],
                    borderWidth: 1
                }]
            }}
        />

    );
}
