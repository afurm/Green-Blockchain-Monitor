'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';

const SustainabilityChart = dynamic(() => import('../components/charts/SustainabilityChart'), { ssr: false });
const EmissionsChart = dynamic(() => import('../components/charts/EmissionsChart'), { ssr: false });

interface AnalyticsData {
  metrics: Array<{
    timestamp: string;
    energyUsageKwh: number;
    emissionsKgCo2: number;
    transactionCount: number;
  }>;
  predictions: Array<{
    timestamp: string;
    energyUsageKwh: number;
    emissionsKgCo2: number;
    confidence: number;
  }>;
  insights: Array<{
    type: 'info' | 'warning' | 'alert';
    message: string;
    confidence: number;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    estimatedSavings: string;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  async function fetchData() {
    try {
      setLoading(true);
      const [metricsRes, insightsRes] = await Promise.all([
        fetch(`/api/metrics?timeRange=${timeRange}`),
        fetch('/api/insights')
      ]);

      if (!metricsRes.ok || !insightsRes.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const metrics = await metricsRes.json();
      const insights = await insightsRes.json();

      setData({
        metrics: metrics.data,
        predictions: insights.predictions,
        insights: insights.insights,
        recommendations: insights.recommendations
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <div className="flex space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '24h' | '7d' | '30d')}
              className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {data && (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">AI-Generated Insights</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    insight.type === 'alert'
                      ? 'bg-red-50'
                      : insight.type === 'warning'
                      ? 'bg-yellow-50'
                      : 'bg-blue-50'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900">{insight.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Confidence: {(insight.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Optimization Recommendations</h2>
            <div className="space-y-4">
              {data.recommendations.map((rec, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                  <h3 className="font-medium text-gray-900">{rec.title}</h3>
                  <p className="text-gray-600 mt-1">{rec.description}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${rec.impact === 'high' ? 'bg-red-100 text-red-800' :
                        rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}
                    `}>
                      {rec.impact.toUpperCase()} Impact
                    </span>
                    <span className="ml-4 text-gray-500">
                      Est. Savings: {rec.estimatedSavings}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 