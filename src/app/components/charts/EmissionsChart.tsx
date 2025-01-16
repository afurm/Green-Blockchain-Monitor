'use client';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface MetricData {
    timestamp: string;
    emissionsKgCo2: number;
}

interface Props {
    historicalData?: MetricData[];
    predictions?: MetricData[];
}

export default function EmissionsChart({ historicalData, predictions }: Props) {
    if (!historicalData || historicalData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    const chartData = {
        labels: [
            ...historicalData.map(d => new Date(d.timestamp).toLocaleTimeString()),
            ...(predictions?.map(d => new Date(d.timestamp).toLocaleTimeString()) || []),
        ],
        datasets: [
            {
                label: 'Historical Emissions',
                data: historicalData.map(d => d.emissionsKgCo2),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
            },
            ...(predictions ? [{
                label: 'Predicted Emissions',
                data: [...Array(historicalData.length).fill(null), ...predictions.map(d => d.emissionsKgCo2)],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderDash: [5, 5],
            }] : []),
        ],
    };

    const options = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += `${context.parsed.y.toFixed(2)} kg CO₂`;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: 'Emissions (kg CO₂)',
                },
            },
        },
    };

    return <Line options={options} data={chartData} />;
} 