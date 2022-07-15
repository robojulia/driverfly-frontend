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

    const [ data, setData ] = useState<number[]>([]);


    const refreshData = async () => {
        setData([]);
        const data = await fetchData();

        setData(data);
    };

    useEffectAsync(refreshData, [ user ]);

    return (
    <ViewCard
        title={title}
        actions={<>
        <Button onClick={refreshData} size="sm" variant="primary">
            <ArrowClockwise />
        </Button>
        </>}
        >
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
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }}
        />
    </ViewCard>
    );
}
