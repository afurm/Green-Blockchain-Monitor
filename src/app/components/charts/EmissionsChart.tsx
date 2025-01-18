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

interface HistoricalData {
  timestamp: string;
  emissionsKgCo2: number;
}

interface PredictionData {
  timestamp: string;
  emissionsKgCo2: number;
  confidence: number;
}

interface Props {
  historicalData: HistoricalData[];
  predictions: PredictionData[];
}

export default function EmissionsChart({ historicalData, predictions }: Props) {
  const chartData = {
    labels: [
      ...historicalData.map(d => new Date(d.timestamp).toLocaleString()),
      ...predictions.map(d => new Date(d.timestamp).toLocaleString())
    ],
    datasets: [
      {
        label: 'Historical Emissions',
        data: [...historicalData.map(d => d.emissionsKgCo2), ...Array(predictions.length).fill(null)],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderWidth: 2,
      },
      {
        label: 'Predicted Emissions',
        data: [...Array(historicalData.length).fill(null), ...predictions.map(d => d.emissionsKgCo2)],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderWidth: 2,
        borderDash: [5, 5],
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `${context.parsed.y.toFixed(2)} kg CO2`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'CO2 Emissions (kg)'
        }
      }
    }
  };

  return <Line options={options} data={chartData} />;
} 