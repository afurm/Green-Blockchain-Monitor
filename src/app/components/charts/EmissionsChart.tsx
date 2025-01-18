'use client';

import { Line } from 'react-chartjs-2';
import { useTranslations, useLocale } from 'next-intl';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
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
  const t = useTranslations();
  const locale = useLocale();

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const chartData = {
    labels: [
      ...historicalData.map(d => formatDate(d.timestamp)),
      ...predictions.map(d => formatDate(d.timestamp))
    ],
    datasets: [
      {
        label: t('charts.emissions.historical'),
        data: [...historicalData.map(d => d.emissionsKgCo2), ...Array(predictions.length).fill(null)],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderWidth: 2,
      },
      {
        label: t('charts.emissions.predicted'),
        data: [...Array(historicalData.length).fill(null), ...predictions.map(d => d.emissionsKgCo2)],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderWidth: 2,
        borderDash: [5, 5],
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94A3B8',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              return t('charts.emissions.tooltips.emissions', {
                value: context.parsed.y.toLocaleString(locale, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              });
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        beginAtZero: true,
        title: {
          display: true,
          text: t('charts.emissions.label'),
          color: '#94A3B8',
          font: {
            size: 12
          }
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 11
          },
          callback: function(value) {
            if (typeof value === 'number') {
              return value.toLocaleString(locale);
            }
            return value;
          }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#94A3B8',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      }
    }
  };

  return <Line options={options} data={chartData} />;
} 