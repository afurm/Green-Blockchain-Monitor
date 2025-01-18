'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslations, useLocale } from 'next-intl';

interface AIResponse {
    insights?: Array<{
        type: 'info' | 'warning' | 'alert';
        message: string;
        confidence: number;
    }>;
    predictions?: Array<{
        timestamp: string;
        energyUsageKwh: number;
        emissionsKgCo2: number;
        confidence: number;
    }>;
    recommendations?: Array<{
        title: string;
        description: string;
        impact: 'high' | 'medium' | 'low';
        estimatedSavings: string;
    }>;
    report?: string;
}

export default function AIControls() {
    const t = useTranslations();
    const locale = useLocale();
    const [loading, setLoading] = useState<string | null>(null);
    const [response, setResponse] = useState<AIResponse | null>(null);

    const handleAnalyze = async () => {
        try {
            setLoading('analyze');
            const res = await fetch(`/api/insights?locale=${locale}`);
            if (!res.ok) throw new Error('Failed to analyze data');
            const data = await res.json();
            setResponse(data);
            toast.success('Analysis completed successfully');
        } catch (error) {
            toast.error('Failed to analyze data');
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    const handleGenerateReport = async () => {
        try {
            setLoading('report');
            const res = await fetch(`/api/report?timeframe=24h&locale=${locale}`);
            if (!res.ok) throw new Error('Failed to generate report');
            const data = await res.json();
            setResponse({ report: data.report });
            toast.success('Report generated successfully');
        } catch (error) {
            toast.error('Failed to generate report');
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    const handleOptimize = async () => {
        try {
            setLoading('optimize');
            const res = await fetch(`/api/optimize?locale=${locale}`);
            if (!res.ok) throw new Error('Failed to get optimization suggestions');
            const data = await res.json();
            setResponse({ recommendations: data.suggestions });
            toast.success('Optimization suggestions generated');
        } catch (error) {
            toast.error('Failed to get optimization suggestions');
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Control Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">{t('aiControls.title')}</h2>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={handleAnalyze}
                        disabled={loading === 'analyze'}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading === 'analyze' ? t('aiControls.analyzing') : t('aiControls.analyze')}
                    </button>
                    <button
                        onClick={handleGenerateReport}
                        disabled={loading === 'report'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading === 'report' ? t('aiControls.generating') : t('aiControls.generateReport')}
                    </button>
                    <button
                        onClick={handleOptimize}
                        disabled={loading === 'optimize'}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                        {loading === 'optimize' ? t('aiControls.analyzing') : t('aiControls.optimize')}
                    </button>
                </div>
            </div>

            {/* Results Display */}
            {response && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">{t('aiControls.results')}</h2>
                    
                    {/* Insights */}
                    {response.insights && (
                        <div className="mb-6">
                            <h3 className="text-md font-medium mb-2">{t('aiControls.insights')}</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {response.insights.map((insight, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-lg ${
                                            insight.type === 'alert' ? 'bg-red-50' :
                                            insight.type === 'warning' ? 'bg-yellow-50' :
                                            'bg-blue-50'
                                        }`}
                                    >
                                        <p className="text-sm">{insight.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {t('aiControls.confidence')}: {(insight.confidence * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Predictions */}
                    {response.predictions && (
                        <div className="mb-6">
                            <h3 className="text-md font-medium mb-2">{t('aiControls.predictions')}</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2">{t('aiControls.time')}</th>
                                            <th className="px-4 py-2">{t('aiControls.energy')}</th>
                                            <th className="px-4 py-2">{t('aiControls.emissions')}</th>
                                            <th className="px-4 py-2">{t('aiControls.confidence')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {response.predictions.map((pred, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                                <td className="px-4 py-2">{new Date(pred.timestamp).toLocaleString(locale)}</td>
                                                <td className="px-4 py-2">{pred.energyUsageKwh.toLocaleString(locale, { maximumFractionDigits: 2 })}</td>
                                                <td className="px-4 py-2">{pred.emissionsKgCo2.toLocaleString(locale, { maximumFractionDigits: 2 })}</td>
                                                <td className="px-4 py-2">{(pred.confidence * 100).toFixed(1)}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    {response.recommendations && (
                        <div className="mb-6">
                            <h3 className="text-md font-medium mb-2">{t('aiControls.recommendations')}</h3>
                            <div className="space-y-4">
                                {response.recommendations.map((rec, index) => (
                                    <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                                        <h4 className="font-medium">{rec.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                                        <div className="flex items-center mt-2 text-sm">
                                            <span className={`
                                                px-2 py-1 rounded-full text-xs font-medium
                                                ${rec.impact === 'high' ? 'bg-red-100 text-red-800' :
                                                  rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                  'bg-green-100 text-green-800'}
                                            `}>
                                                {t(`optimization.impact.${rec.impact}`)}
                                            </span>
                                            <span className="ml-4 text-gray-500">
                                                {t('optimization.savings')} {rec.estimatedSavings}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Report */}
                    {response.report && (
                        <div className="mb-6">
                            <h3 className="text-md font-medium mb-2">{t('report.title')}</h3>
                            <div className="prose max-w-none">
                                {response.report.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-4">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 