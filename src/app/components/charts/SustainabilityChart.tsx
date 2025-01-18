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

interface ChartData {
  timestamp: string;
  energyUsageKwh: number;
  transactionCount: number;
}

interface Props {
  data: ChartData[];
}

export default function SustainabilityChart({ data }: Props) {
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
    labels: data.map(d => formatDate(d.timestamp)),
    datasets: [
      {
        label: t('charts.sustainability.energyUsage'),
        data: data.map(d => d.energyUsageKwh),
        borderColor: 'rgb(52, 211, 153)',
        backgroundColor: 'rgba(52, 211, 153, 0.5)',
        yAxisID: 'y',
      },
      {
        label: t('charts.sustainability.transactions'),
        data: data.map(d => d.transactionCount),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y1',
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
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
            const label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 0) {
                return t('charts.sustainability.tooltips.energyUsage', {
                  value: context.parsed.y.toLocaleString(locale, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
                });
              } else {
                return t('charts.sustainability.tooltips.transactions', {
                  value: context.parsed.y.toLocaleString(locale)
                });
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: t('charts.sustainability.energyUsage'),
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
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: t('charts.sustainability.transactions'),
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
          drawOnChartArea: false,
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