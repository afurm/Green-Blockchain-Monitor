'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Insights from './Insights';
import UserPreferences from './UserPreferences';

// Dynamically import chart components to avoid SSR issues
const SustainabilityChart = dynamic(() => import('./charts/SustainabilityChart'), { ssr: false });
const EmissionsChart = dynamic(() => import('./charts/EmissionsChart'), { ssr: false });
const InsightCards = dynamic(() => import('./InsightCards'), { ssr: false });

interface DashboardData {
    metrics: {
        timestamp: string;
        energyUsageKwh: number;
        transactionCount: number;
        emissionsKgCo2: number;
    }[];
    insights: {
        message: string;
        type: string;
        timestamp: string;
    }[];
    predictions: {
        timestamp: string;
        energyUsage: number;
        emissions: number;
    }[];
}

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const fetchDashboardData = async () => {
        try {
            const [metricsRes, insightsRes] = await Promise.all([
                fetch('/api/metrics'),
                fetch('/api/insights')
            ]);

            if (!metricsRes.ok || !insightsRes.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const metrics = await metricsRes.json();
            const insights = await insightsRes.json();

            setData({
                metrics: metrics.data,
                insights: insights.insights,
                predictions: metrics.predictions || []
            });
            setLastUpdate(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Auto-refresh setup
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [autoRefresh]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with refresh controls */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Blockchain Sustainability Dashboard</h1>
                    {lastUpdate && (
                        <p className="text-sm text-gray-500">
                            Last updated: {lastUpdate.toLocaleString()}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <span>Auto-refresh</span>
                    </label>
                    <button
                        onClick={fetchDashboardData}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                        Refresh Now
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {data && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sustainability Score Chart */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Sustainability Metrics</h2>
                        <SustainabilityChart data={data.metrics} />
                    </div>

                    {/* Emissions Trend Chart */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Emissions Trend</h2>
                        <EmissionsChart 
                            historical={data.metrics} 
                            predictions={data.predictions}
                        />
                    </div>

                    {/* AI Insight Cards */}
                    <div className="lg:col-span-2">
                        <InsightCards insights={data.insights} />
                    </div>
                </div>
            )}

            {/* User Preferences Section */}
            <div className="bg-white rounded-lg shadow-md">
                <UserPreferences />
            </div>
        </div>
    );
} 