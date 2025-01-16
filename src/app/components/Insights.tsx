'use client';

import { useState } from 'react';
import InsightFeedback from './InsightFeedback';

interface Insight {
    message: string;
    type: string;
    timestamp: string;
}

interface Alert {
    message: string;
    severity: string;
    timestamp: string;
}

interface Anomaly {
    metric: string;
    value: number;
    expected_range: [number, number];
    timestamp: string;
}

interface InsightsResponse {
    insights: Insight[];
    alerts: Alert[];
    anomalies: Anomaly[];
    timestamp: string;
}

export default function Insights() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<InsightsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchInsights = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/insights');
            if (!response.ok) {
                throw new Error('Failed to fetch insights');
            }
            const data = await response.json();
            setData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">AI Insights</h2>
                <button
                    onClick={fetchInsights}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? 'Loading...' : 'Generate Insights'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {data && (
                <div className="space-y-6">
                    {/* Insights */}
                    {data.insights.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-medium">Insights</h3>
                            <div className="space-y-2">
                                {data.insights.map((insight, index) => (
                                    <div key={index} className="bg-white rounded-md shadow">
                                        <div className="p-3">
                                            <p>{insight.message}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(insight.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="border-t">
                                            <InsightFeedback
                                                type="insight"
                                                id={`insight-${index}`}
                                                onFeedbackSubmit={fetchInsights}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Alerts */}
                    {data.alerts.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-medium">Alerts</h3>
                            <div className="space-y-2">
                                {data.alerts.map((alert, index) => (
                                    <div key={index} className={`rounded-md shadow`}>
                                        <div 
                                            className={`p-3 ${
                                                alert.severity === 'high' 
                                                    ? 'bg-red-100' 
                                                    : alert.severity === 'medium'
                                                    ? 'bg-yellow-100'
                                                    : 'bg-blue-100'
                                            }`}
                                        >
                                            <p>{alert.message}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(alert.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="border-t bg-white">
                                            <InsightFeedback
                                                type="alert"
                                                id={`alert-${index}`}
                                                onFeedbackSubmit={fetchInsights}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Anomalies */}
                    {data.anomalies.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-medium">Anomalies</h3>
                            <div className="space-y-2">
                                {data.anomalies.map((anomaly, index) => (
                                    <div key={index} className="rounded-md shadow">
                                        <div className="p-3 bg-orange-100">
                                            <p>
                                                Anomaly detected in {anomaly.metric}: {anomaly.value} 
                                                (Expected range: {anomaly.expected_range[0]} - {anomaly.expected_range[1]})
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(anomaly.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="border-t bg-white">
                                            <InsightFeedback
                                                type="anomaly"
                                                id={`anomaly-${index}`}
                                                onFeedbackSubmit={fetchInsights}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.insights.length === 0 && 
                     data.alerts.length === 0 && 
                     data.anomalies.length === 0 && (
                        <div className="p-4 bg-gray-100 text-gray-700 rounded-md">
                            No insights, alerts, or anomalies detected at this time.
                        </div>
                    )}

                    <div className="text-sm text-gray-500">
                        Last updated: {new Date(data.timestamp).toLocaleString()}
                    </div>
                </div>
            )}
        </div>
    );
} 