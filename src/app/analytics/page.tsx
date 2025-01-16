'use client';

import { useEffect, useState } from 'react';
import SustainabilityChart from '../components/charts/SustainabilityChart';
import EmissionsChart from '../components/charts/EmissionsChart';

interface AnalyticsData {
  metrics: Array<{
    timestamp: string;
    energyUsageKwh: number;
    emissionsKgCo2: number;
    transactionCount: number;
  }>;
  predictions: Array<{
    timestamp: string;
    emissionsKgCo2: number;
  }>;
  statistics: {
    totalEnergyUsage: number;
    totalEmissions: number;
    totalTransactions: number;
    efficiencyScore: number;
    sustainabilityRank: number;
  };
}

export default function AnalyticsPage() {
  const [blockchain, setBlockchain] = useState('Ethereum');
  const [timeRange, setTimeRange] = useState('24h');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/analytics?blockchain=${blockchain}&timeRange=${timeRange}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [blockchain, timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Detailed Analytics
        </h1>
        <p className="text-gray-600 mb-6">
          Explore detailed charts and analytics about blockchain energy consumption,
          emissions, and sustainability metrics. Use the filters and date ranges to
          customize your view.
        </p>
      </div>

      {/* Analytics Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blockchain Network
            </label>
            <select 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={blockchain}
              onChange={(e) => setBlockchain(e.target.value)}
            >
              <option value="Ethereum">Ethereum</option>
              <option value="Bitcoin">Bitcoin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <select 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      {data && (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Sustainability Metrics</h2>
            <div className="h-[400px]">
              <SustainabilityChart data={data.metrics} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Emissions Trend</h2>
            <div className="h-[400px]">
              <EmissionsChart historicalData={data.metrics} predictions={data.predictions} />
            </div>
          </div>

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Key Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Energy Usage</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {data.statistics.totalEnergyUsage.toLocaleString()} kWh
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Emissions</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {(data.statistics.totalEmissions / 1000).toFixed(1)} tons CO2
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Efficiency Score</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {data.statistics.efficiencyScore.toFixed(1)}/10
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Sustainability Rank</p>
                  <p className="text-2xl font-semibold text-blue-600">
                    #{data.statistics.sustainabilityRank}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <span className="text-green-500">✓</span>
                  <p className="text-gray-600">
                    {data.statistics.efficiencyScore < 7 
                      ? 'Implement energy-efficient consensus mechanisms'
                      : 'Current consensus mechanism is energy-efficient'}
                  </p>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500">✓</span>
                  <p className="text-gray-600">
                    {data.statistics.totalTransactions > 1000000
                      ? 'Consider optimizing transaction batching for better efficiency'
                      : 'Transaction batching is currently optimal'}
                  </p>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500">✓</span>
                  <p className="text-gray-600">
                    {data.statistics.totalEmissions > 10000
                      ? 'Consider renewable energy sources for mining operations'
                      : 'Current energy mix is environmentally friendly'}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 