'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

// Dynamically import chart components to avoid SSR issues
const SustainabilityChart = dynamic(() => import('./components/charts/SustainabilityChart'), { ssr: false });
const EmissionsChart = dynamic(() => import('./components/charts/EmissionsChart'), { ssr: false });
const InsightCards = dynamic(() => import('./components/InsightCards'), { ssr: false });

interface DashboardData {
  metrics: {
    timestamp: string;
    energyUsageKwh: number;
    emissionsKgCo2: number;
    transactionCount: number;
  }[];
  insights: {
    id: string;
    type: 'info' | 'warning' | 'alert';
    message: string;
    timestamp: string;
  }[];
  predictions: {
    timestamp: string;
    energyUsageKwh: number;
    emissionsKgCo2: number;
  }[];
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/metrics');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const newData = await response.json();
      setData(newData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      toast.error('Failed to update dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    if (autoRefresh) {
      const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Blockchain Sustainability Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-600">Auto-refresh</span>
            </label>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Sustainability Metrics</h2>
              <SustainabilityChart data={data.metrics} />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Emissions Trend</h2>
              <EmissionsChart
                historicalData={data.metrics}
                predictions={data.predictions}
              />
            </div>
          </>
        )}
      </div>

      {/* AI Insights */}
      {data && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
          <InsightCards insights={data.insights} />
        </div>
      )}
    </div>
  );
} 