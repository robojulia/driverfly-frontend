import React, { useState } from "react";
import ViewCard from "../viewDetails/viewCard";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "../../hooks/useTranslation";
import { useEffectAsync } from "../../utils/react";
import { Button } from "react-bootstrap";
import { ArrowClockwise } from "react-bootstrap-icons";
import { useAuth } from "../../hooks/useAuth";

export interface BarChartProps {
    title: string;
    labels: string[];
    fetchData: () => Promise<number[]>;
}


export function BarChart(props: BarChartProps): JSX.Element {
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
        <Bar
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
                        'rgba(245, 192, 24)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                    ],
                    borderColor: [
                        'rgba(245, 192, 24)',
                        'rgba(245, 192, 24)',
                        'rgba(255, 206, 86, 1)',
                    ],
                    borderWidth: 1
                }]
            }}
        />

    );
}
