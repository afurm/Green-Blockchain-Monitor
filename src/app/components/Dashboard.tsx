'use client';

import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslations, useLocale } from 'next-intl';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface OptimizationSuggestion {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    estimatedSavings: string;
    implementation?: {
        difficulty: 'easy' | 'moderate' | 'complex';
        timeframe: 'immediate' | 'short-term' | 'long-term';
        steps: string[];
        prerequisites: string[];
    };
    benefits?: {
        environmental: string[];
        operational: string[];
        financial: string[];
    };
}

interface ReportSection {
    title: string;
    content: string;
    key_metrics?: string[];
    recommendations?: string[];
}

interface SustainabilityReport {
    summary: string;
    sections: ReportSection[];
    conclusion: string;
}

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
    recommendations?: OptimizationSuggestion[];
    report?: SustainabilityReport;
    networkAnalysis?: {
        ethereum: {
            title: string;
            content: string;
        };
        bitcoin: {
            title: string;
            content: string;
        };
        solana: {
            title: string;
            content: string;
        };
    };
}

export default function Dashboard() {
    const t = useTranslations();
    const locale = useLocale();
    const [loading, setLoading] = useState<string | null>(null);
    const [response, setResponse] = useState<AIResponse | null>(null);
    
    // Add refs for scrolling
    const analysisRef = useRef<HTMLDivElement>(null);
    const reportRef = useRef<HTMLDivElement>(null);
    const optimizationRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleGenerateAll = async () => {
        try {
            setLoading('all');
            
            // Run all analyses in parallel with locale
            const [insightsRes, reportRes, optimizeRes] = await Promise.all([
                fetch(`/api/insights?locale=${locale}`),
                fetch(`/api/report?timeframe=24h&locale=${locale}`),
                fetch(`/api/optimize?locale=${locale}`)
            ]);

            if (!insightsRes.ok || !reportRes.ok || !optimizeRes.ok) {
                throw new Error('One or more requests failed');
            }

            const [insightsData, reportData, optimizeData] = await Promise.all([
                insightsRes.json(),
                reportRes.json(),
                optimizeRes.json()
            ]);

            // Combine all responses with proper type checking
            const combinedResponse: AIResponse = {
                insights: Array.isArray(insightsData.insights) ? insightsData.insights : [],
                predictions: Array.isArray(insightsData.predictions) ? insightsData.predictions : [],
                recommendations: Array.isArray(optimizeData.recommendations) ? optimizeData.recommendations : [],
                report: reportData.report || null
            };

            setResponse(combinedResponse);
            toast.success(t('dashboard.analysisComplete'));
            
            // Scroll to results after a short delay
            setTimeout(() => {
                scrollToSection(analysisRef);
            }, 100);

        } catch (error) {
            console.error('Analysis error:', error);
            toast.error(t('dashboard.analysisError'));
        } finally {
            setLoading(null);
        }
    };

    return (
        <><div className="space-y-8 p-4">
            {/* Main Action Button */}
            <div className="glass-card p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                    {t('title')}
                </h3>
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={handleGenerateAll}
                        disabled={loading === 'all'}
                        className="crypto-button w-full px-6 py-4 text-white rounded-lg disabled:opacity-50 shadow-lg text-lg font-semibold relative overflow-hidden group"
                    >
                        {loading === 'all' ? (
                            <div className="flex items-center justify-center space-x-3">
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{t('mainAction.loading')}</span>
                            </div>
                        ) : (
                            <>
                                <span className="relative z-10">{t('mainAction.button')}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </>
                        )}
                    </button>
                    <p className="text-gray-400 mt-4">
                        {t('mainAction.description')}
                    </p>
                </div>
            </div>

            {/* Environmental Impact Overview */}
            <div className="glass-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    {t('environmentalImpact.title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Energy Usage Card */}
                    <div className="gradient-border p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <h4 className="font-semibold text-yellow-400">{t('environmentalImpact.energyUsage.title')}</h4>
                        </div>
                        <div className="text-2xl font-bold text-white mb-2">{t('environmentalImpact.energyUsage.value')}</div>
                        <p className="text-sm text-gray-300">{t('environmentalImpact.energyUsage.description')}</p>
                        <div className="mt-2 text-xs text-gray-400">
                            <div className="flex justify-between">
                                <span>{t('networks.ethereum')}:</span>
                                <span className="text-emerald-400">{t('environmentalImpact.energyUsage.ethereum')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('networks.bitcoin')}:</span>
                                <span className="text-yellow-400">{t('environmentalImpact.energyUsage.bitcoin')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('networks.solana')}:</span>
                                <span className="text-purple-400">{t('environmentalImpact.energyUsage.solana')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Carbon Footprint Card */}
                    <div className="gradient-border p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                            <h4 className="font-semibold text-emerald-400">{t('environmentalImpact.carbonFootprint.title')}</h4>
                        </div>
                        <div className="text-2xl font-bold text-white mb-2">{t('environmentalImpact.carbonFootprint.value')}</div>
                        <p className="text-sm text-gray-300">{t('environmentalImpact.carbonFootprint.description')}</p>
                        <div className="mt-2 text-xs text-gray-400">
                            <div className="flex justify-between">
                                <span>{t('networks.ethereum')}:</span>
                                <span className="text-emerald-400">{t('environmentalImpact.carbonFootprint.ethereum')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('networks.bitcoin')}:</span>
                                <span className="text-yellow-400">{t('environmentalImpact.carbonFootprint.bitcoin')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('networks.solana')}:</span>
                                <span className="text-purple-400">{t('environmentalImpact.carbonFootprint.solana')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Water Usage Card */}
                    <div className="gradient-border p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <h4 className="font-semibold text-blue-400">{t('environmentalImpact.waterUsage.title')}</h4>
                        </div>
                        <div className="text-2xl font-bold text-white mb-2">{t('environmentalImpact.waterUsage.value')}</div>
                        <p className="text-sm text-gray-300">{t('environmentalImpact.waterUsage.description')}</p>
                        <div className="mt-2 text-xs text-gray-400">
                            <div className="flex justify-between">
                                <span>{t('networks.ethereum')}:</span>
                                <span className="text-emerald-400">{t('environmentalImpact.waterUsage.ethereum')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('networks.bitcoin')}:</span>
                                <span className="text-yellow-400">{t('environmentalImpact.waterUsage.bitcoin')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('networks.solana')}:</span>
                                <span className="text-purple-400">{t('environmentalImpact.waterUsage.solana')}</span>
                            </div>
                        </div>
                    </div>

                    {/* E-waste Card */}
                    <div className="gradient-border p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <h4 className="font-semibold text-red-400">{t('environmentalImpact.eWaste.title')}</h4>
                        </div>
                        <div className="text-2xl font-bold text-white mb-2">{t('environmentalImpact.eWaste.value')}</div>
                        <p className="text-sm text-gray-300">{t('environmentalImpact.eWaste.description')}</p>
                        <div className="mt-2 text-xs text-gray-400">
                            <div className="flex justify-between">
                                <span>{t('networks.ethereum')}:</span>
                                <span className="text-emerald-400">{t('environmentalImpact.eWaste.ethereum')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('networks.bitcoin')}:</span>
                                <span className="text-yellow-400">{t('environmentalImpact.eWaste.bitcoin')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('networks.solana')}:</span>
                                <span className="text-purple-400">{t('environmentalImpact.eWaste.solana')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simple Explanation */}
                <div className="mt-6 p-4 bg-opacity-50 bg-blue-900 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">{t('simpleExplanation.title')}</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                        <p>{t('simpleExplanation.point1')}</p>
                        <p>{t('simpleExplanation.point2')}</p>
                        <p>{t('simpleExplanation.point3')}</p>
                        <p>{t('simpleExplanation.point4')}</p>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {response && (
                <div className="space-y-6">
                    <div ref={analysisRef} className="glass-card p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2 text-blue-400">
                            {t('charts.title')}
                        </h3>
                        <p className="text-gray-400 mb-4">
                            {t('charts.description')}
                        </p>
                        
                        {/* Network Analysis Sections */}
                        {response.networkAnalysis && (
                            <div className="space-y-6 mb-8">
                                {/* Ethereum Analysis */}
                                <div className="gradient-border p-4">
                                    <h4 className="text-lg font-semibold text-blue-400 mb-2">
                                        {response.networkAnalysis.ethereum.title}
                                    </h4>
                                    <p className="text-gray-300">
                                        {response.networkAnalysis.ethereum.content}
                                    </p>
                                </div>

                                {/* Bitcoin Analysis */}
                                <div className="gradient-border p-4">
                                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                                        {response.networkAnalysis.bitcoin.title}
                                    </h4>
                                    <p className="text-gray-300">
                                        {response.networkAnalysis.bitcoin.content}
                                    </p>
                                </div>

                                {/* Solana Analysis */}
                                <div className="gradient-border p-4">
                                    <h4 className="text-lg font-semibold text-purple-400 mb-2">
                                        {response.networkAnalysis.solana.title}
                                    </h4>
                                    <p className="text-gray-300">
                                        {response.networkAnalysis.solana.content}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Energy Usage Chart */}
                        <div className="glass-card p-4 sm:p-6 rounded-lg">
                            <h3 className="text-base sm:text-lg font-semibold mb-2 text-yellow-400">
                                {t('charts.energyUsage.title')}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-400 mb-4">
                                {t('charts.energyUsage.description')}
                            </p>
                            <div className="h-[250px] sm:h-[400px]">
                                <Bar
                                    data={{
                                        labels: [t('networks.ethereum'), t('networks.bitcoin'), t('networks.solana')],
                                        datasets: [{
                                            label: t('charts.energyUsage.label'),
                                            data: [23, 107, 3.8],
                                            backgroundColor: [
                                                'rgba(56, 189, 248, 0.6)',  // Ethereum - Blue
                                                'rgba(251, 191, 36, 0.6)',  // Bitcoin - Yellow
                                                'rgba(167, 139, 250, 0.6)'  // Solana - Purple
                                            ],
                                            borderColor: [
                                                'rgb(56, 189, 248)',
                                                'rgb(251, 191, 36)',
                                                'rgb(167, 139, 250)'
                                            ],
                                            borderWidth: 1
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: {
                                                    color: 'rgba(255, 255, 255, 0.1)'
                                                },
                                                ticks: {
                                                    color: '#94A3B8',
                                                    font: {
                                                        size: 10
                                                    }
                                                }
                                            },
                                            x: {
                                                grid: {
                                                    color: 'rgba(255, 255, 255, 0.1)'
                                                },
                                                ticks: {
                                                    color: '#94A3B8',
                                                    font: {
                                                        size: 10
                                                    }
                                                }
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                labels: {
                                                    color: '#94A3B8',
                                                    font: {
                                                        size: 10
                                                    }
                                                }
                                            }
                                        }
                                    }} />
                            </div>
                        </div>

                        {/* Carbon Footprint Chart */}
                        <div className="glass-card p-4 sm:p-6 rounded-lg">
                            <h3 className="text-base sm:text-lg font-semibold mb-2 text-emerald-400">
                                {t('charts.carbonFootprint.title')}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-400 mb-4">
                                {t('charts.carbonFootprint.description')}
                            </p>
                            <div className="h-[250px] sm:h-[400px]">
                                <Bar
                                    data={{
                                        labels: [t('networks.ethereum'), t('networks.bitcoin'), t('networks.solana')],
                                        datasets: [{
                                            label: t('charts.carbonFootprint.label'),
                                            data: [11, 54, 1.9],
                                            backgroundColor: [
                                                'rgba(52, 211, 153, 0.6)',
                                                'rgba(248, 113, 113, 0.6)',
                                                'rgba(167, 139, 250, 0.6)'
                                            ],
                                            borderColor: [
                                                'rgb(52, 211, 153)',
                                                'rgb(248, 113, 113)',
                                                'rgb(167, 139, 250)'
                                            ],
                                            borderWidth: 1
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: {
                                                    color: 'rgba(255, 255, 255, 0.1)'
                                                },
                                                ticks: {
                                                    color: '#94A3B8',
                                                    font: {
                                                        size: 10
                                                    }
                                                }
                                            },
                                            x: {
                                                grid: {
                                                    color: 'rgba(255, 255, 255, 0.1)'
                                                },
                                                ticks: {
                                                    color: '#94A3B8',
                                                    font: {
                                                        size: 10
                                                    }
                                                }
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                labels: {
                                                    color: '#94A3B8',
                                                    font: {
                                                        size: 10
                                                    }
                                                }
                                            }
                                        }
                                    }} />
                            </div>
                        </div>

                        {/* Water Usage Chart */}
                        <div className="glass-card p-4 sm:p-6 rounded-lg">
                            <h3 className="text-base sm:text-lg font-semibold mb-2 text-blue-400">
                                {t('charts.waterUsage.title')}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-400 mb-4">
                                {t('charts.waterUsage.description')}
                            </p>
                            <div className="h-[250px] sm:h-[400px]">
                                <Bar
                                    data={{
                                        labels: [t('networks.ethereum'), t('networks.bitcoin'), t('networks.solana')],
                                        datasets: [{
                                            label: t('charts.waterUsage.label'),
                                            data: [45, 75, 12],
                                            backgroundColor: [
                                                'rgba(96, 165, 250, 0.6)',
                                                'rgba(129, 140, 248, 0.6)',
                                                'rgba(167, 139, 250, 0.6)'
                                            ],
                                            borderColor: [
                                                'rgb(96, 165, 250)',
                                                'rgb(129, 140, 248)',
                                                'rgb(167, 139, 250)'
                                            ],
                                            borderWidth: 1
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: {
                                                    color: 'rgba(255, 255, 255, 0.1)'
                                                },
                                                ticks: {
                                                    color: '#94A3B8',
                                                    font: {
                                                        size: 10
                                                    }
                                                }
                                            },
                                            x: {
                                                grid: {
                                                    color: 'rgba(255, 255, 255, 0.1)'
                                                },
                                                ticks: {
                                                    color: '#94A3B8',
                                                    font: {
                                                        size: 10
                                                    }
                                                }
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                labels: {
                                                    color: '#94A3B8',
                                                    font: {
                                                        size: 10
                                                    }
                                                }
                                            }
                                        }
                                    }} />
                            </div>
                        </div>

                        {/* E-waste Chart */}
                        <div className="glass-card p-4 sm:p-6 rounded-lg">
                            <h3 className="text-base sm:text-lg font-semibold mb-2 text-red-400">
                                {t('charts.eWaste.title')}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-400 mb-4">
                                {t('charts.eWaste.description')}
                            </p>
                            <div className="h-[250px] sm:h-[400px]">
                                <Bar
                                    data={{
                                        labels: [t('networks.ethereum'), t('networks.bitcoin'), t('networks.solana')],
                                        datasets: [{
                                            label: t('charts.eWaste.label'),
                                            data: [8000, 22000, 1200],
                                            backgroundColor: [
                                                'rgba(248, 113, 113, 0.6)',
                                                'rgba(239, 68, 68, 0.6)',
                                                'rgba(167, 139, 250, 0.6)'
                                            ],
                                            borderColor: [
                                                'rgb(248, 113, 113)',
                                                'rgb(239, 68, 68)',
                                                'rgb(167, 139, 250)'
                                            ],
                                            borderWidth: 1
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: {
                                                    color: 'rgba(255, 255, 255, 0.1)'
                                                },
                                                ticks: {
                                                    color: '#94A3B8',
                                                    font: {
                                                        size: 10
                                                    }
                                                }
                                            },
                                            x: {
                                                grid: {
                                                    color: 'rgba(255, 255, 255, 0.1)'
                                                },
                                                ticks: {
                                                    color: '#94A3B8',
                                                    font: {
                                                        size: 10
                                                    }
                                                }
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                labels: {
                                                    color: '#94A3B8',
                                                    font: {
                                                        size: 10
                                                    }
                                                }
                                            }
                                        }
                                    }} />
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    {response.recommendations && response.recommendations.length > 0 && (
                        <div ref={optimizationRef} className="glass-card p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 text-emerald-400">
                                {t('optimization.title')}
                            </h3>
                            <p className="text-sm text-gray-400 mb-4">
                                {t('optimization.description')}
                            </p>
                            <div className="space-y-4">
                                {response.recommendations.map((rec, index) => (
                                    <div key={index} className="gradient-border p-4">
                                        <h4 className="font-medium text-blue-400">{rec.title}</h4>
                                        <p className="text-sm text-gray-300 mt-1">{rec.description}</p>
                                        <div className="flex items-center mt-2 text-sm">
                                            <span className={`
                                                px-2 py-1 rounded-full text-xs font-medium
                                                ${rec.impact === 'high' ? 'bg-red-900 text-red-200' :
                                                    rec.impact === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                                                        'bg-green-900 text-green-200'}
                                            `}>
                                                {t(`optimization.impact.${rec.impact}`)}
                                            </span>
                                            <span className="ml-4 text-gray-400">
                                                {t('optimization.savings')} {rec.estimatedSavings}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Report */}
                    {response?.report && (
                        <div ref={reportRef} className="glass-card p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                {t('report.title')}
                            </h3>
                            <div className="space-y-6">
                                {/* Overview */}
                                <div className="gradient-border p-4">
                                    <p className="text-gray-300">{t('report.overview')}</p>
                                </div>
                                
                                {/* Report Sections */}
                                {Array.isArray(response.report.sections) && response.report.sections.map((section, index) => (
                                    <div key={index} className="gradient-border p-4">
                                        <h4 className="font-semibold text-blue-400 mb-2">{section.title}</h4>
                                        <div className="text-gray-300 space-y-4">
                                            <p>{section.content}</p>
                                            
                                            {/* Key Metrics */}
                                            {Array.isArray(section.key_metrics) && section.key_metrics.length > 0 && (
                                                <div className="mt-4">
                                                    <h5 className="text-sm font-medium text-gray-400 mb-2">
                                                        {t('report.sections.keyMetrics')}
                                                    </h5>
                                                    <ul className="list-disc list-inside text-sm space-y-1">
                                                        {section.key_metrics.map((metric, idx) => (
                                                            <li key={idx} className="text-gray-300">{metric}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Section Recommendations */}
                                            {Array.isArray(section.recommendations) && section.recommendations.length > 0 && (
                                                <div className="mt-4">
                                                    <h5 className="text-sm font-medium text-gray-400 mb-2">
                                                        {t('report.sections.recommendations')}
                                                    </h5>
                                                    <ul className="list-disc list-inside text-sm space-y-1">
                                                        {section.recommendations.map((rec, idx) => (
                                                            <li key={idx} className="text-gray-300">{typeof rec === 'string' ? rec : JSON.stringify(rec)}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Conclusion */}
                                {typeof response.report.conclusion === 'string' && (
                                    <div className="gradient-border p-4">
                                        <h4 className="font-semibold text-purple-400 mb-2">
                                            {t('report.sections.conclusion')}
                                        </h4>
                                        <p className="text-gray-300">{response.report.conclusion}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
        <footer className="glass-card mt-12 p-8 rounded-lg">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            {t('footer.about.title')}
                        </h4>
                        <p className="text-gray-400 text-sm">
                            {t('footer.about.description')}
                        </p>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            {t('footer.resources.title')}
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="https://ethereum.org/en/energy-consumption/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    {t('footer.resources.ethereum')}
                                </a>
                            </li>
                            <li>
                                <a href="https://ccaf.io/cbnsi/cbeci" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    {t('footer.resources.bitcoin')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Connect Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            {t('footer.connect.title')}
                        </h4>
                        <p className="text-gray-400 text-sm mb-4">
                            {t('footer.connect.description')}
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://github.com/afurm/Green-Blockchain-Monitor" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z"/>
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/in/andrii-furmanets-1a5b6452" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                    <p className="text-gray-400 text-sm">
                        {t('footer.copyright')}
                    </p>
                </div>
            </div>
        </footer></>
    );
} 