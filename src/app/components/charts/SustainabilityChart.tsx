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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  timestamp: string;
  energyUsageKwh: number;
  transactionCount: number;
}

interface Props {
  data: ChartData[];
}

export default function SustainabilityChart({ data }: Props) {
  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleString()),
    datasets: [
      {
        label: 'Energy Usage (kWh)',
        data: data.map(d => d.energyUsageKwh),
        borderColor: 'rgb(52, 211, 153)',
        backgroundColor: 'rgba(52, 211, 153, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Transactions',
        data: data.map(d => d.transactionCount),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y1',
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Energy Usage (kWh)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Transaction Count'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <Line options={options} data={chartData} />;
} 