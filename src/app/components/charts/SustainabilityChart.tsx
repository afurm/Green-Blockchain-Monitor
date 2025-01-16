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
    Legend,
} from 'chart.js';

// Register Chart.js components
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
    energyUsageKwh: number;
    transactionCount: number;
}

interface Props {
    data?: MetricData[];
}

export default function SustainabilityChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    const chartData = {
        labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
        datasets: [
            {
                label: 'Energy Usage (kWh)',
                data: data.map(d => d.energyUsageKwh),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                yAxisID: 'y',
            },
            {
                label: 'Transactions',
                data: data.map(d => d.transactionCount),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                yAxisID: 'y1',
            },
        ],
    };

    const options = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        stacked: false,
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
                            label += context.dataset.label.includes('Energy') 
                                ? `${context.parsed.y.toFixed(2)} kWh`
                                : context.parsed.y.toLocaleString();
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
                    text: 'Energy Usage (kWh)',
                },
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                title: {
                    display: true,
                    text: 'Transaction Count',
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return <Line options={options} data={chartData} />;
} 