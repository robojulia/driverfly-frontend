import React, { DependencyList, useState } from "react";
import { Bar,ChartProps } from "react-chartjs-2";
import { useTranslation } from "../../hooks/use-translation";
import { useEffectAsync } from "../../utils/react";
import { useAuth } from "../../hooks/use-auth";

export interface BarChartProps {
    title: string;
    yearToShow?: number;
    labels: string[];
    fetchData: () => Promise<BarChartDataSets[]>;
    deps?:DependencyList
}
interface BarChartDataSets {
    label:string,
    backgroundColor: string,
    borderColor: string,
    data:number[],
    borderWidth: number,
   
}
export function BarChart(props: BarChartProps): JSX.Element {
    const { title, yearToShow, labels, fetchData ,deps} = props;

    const { t } = useTranslation();
    const { user } = useAuth();

    const [data, setData] = useState<BarChartDataSets[]>([]);
    const resetData = () => { setData([]) }

    const refreshData = async () => {
        resetData()
        const data = await fetchData();

        setData(data);
    };

    useEffectAsync(refreshData, deps?? []);

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
                 plugins:{
                    datalabels: {
                       color:"transparent"
                      },
                      legend: {
                        position: 'bottom' as const,
                      },
                 }
            }}
            data={{
                labels: labels.map(v => t(v)),
                datasets:data
            }}
        />

    );
}
