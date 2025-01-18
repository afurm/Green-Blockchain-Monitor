'use client';

import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
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
            
            // Run all analyses in parallel
            const [insightsRes, reportRes, optimizeRes] = await Promise.all([
                fetch('/api/insights'),
                fetch('/api/report?timeframe=24h'),
                fetch('/api/optimize')
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
            toast.success('Analysis completed successfully');
            
            // Scroll to results after a short delay
            setTimeout(() => {
                scrollToSection(analysisRef);
            }, 100);

        } catch (error) {
            console.error('Analysis error:', error);
            toast.error('Failed to generate analysis');
        } finally {
            setLoading(null);
        }
    };

    return (
        <><div className="space-y-8 p-4">
            {/* Main Action Button */}
            <div className="glass-card p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                    Blockchain Environmental Analysis
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
                                <span>Generating Analysis...</span>
                            </div>
                        ) : (
                            <>
                                <span className="relative z-10">Generate Environmental Impact Analysis</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </>
                        )}
                    </button>
                    <p className="text-gray-400 mt-4">
                        Click to generate a comprehensive analysis of blockchain networks' environmental impact, including real-time metrics,
                        sustainability report, and optimization suggestions.
                    </p>
                </div>
            </div>

            {/* Environmental Impact Overview */}
            <div className="glass-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Environmental Impact Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Energy Usage Card */}
                    <div className="gradient-border p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <h4 className="font-semibold text-yellow-400">Energy Usage</h4>
                        </div>
                        <div className="text-2xl font-bold text-white mb-2">≈ 134 TWh</div>
                        <p className="text-sm text-gray-300">Combined annual energy consumption</p>
                        <div className="mt-2 text-xs text-gray-400">
                            <div className="flex justify-between">
                                <span>ETH:</span>
                                <span className="text-emerald-400">23 TWh</span>
                            </div>
                            <div className="flex justify-between">
                                <span>BTC:</span>
                                <span className="text-yellow-400">107 TWh</span>
                            </div>
                            <div className="flex justify-between">
                                <span>SOL:</span>
                                <span className="text-purple-400">3.8 TWh</span>
                            </div>
                        </div>
                    </div>

                    {/* Carbon Footprint Card */}
                    <div className="gradient-border p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                            <h4 className="font-semibold text-emerald-400">Carbon Footprint</h4>
                        </div>
                        <div className="text-2xl font-bold text-white mb-2">≈ 67M tons CO2</div>
                        <p className="text-sm text-gray-300">Annual carbon emissions</p>
                        <div className="mt-2 text-xs text-gray-400">
                            <div className="flex justify-between">
                                <span>ETH:</span>
                                <span className="text-emerald-400">11M tons</span>
                            </div>
                            <div className="flex justify-between">
                                <span>BTC:</span>
                                <span className="text-yellow-400">54M tons</span>
                            </div>
                            <div className="flex justify-between">
                                <span>SOL:</span>
                                <span className="text-purple-400">1.9M tons</span>
                            </div>
                        </div>
                    </div>

                    {/* Water Impact Card */}
                    <div className="gradient-border p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <h4 className="font-semibold text-blue-400">Water Usage</h4>
                        </div>
                        <div className="text-2xl font-bold text-white mb-2">≈ 132B Liters</div>
                        <p className="text-sm text-gray-300">Annual water consumption</p>
                        <div className="mt-2 text-xs text-gray-400">
                            <div className="flex justify-between">
                                <span>ETH:</span>
                                <span className="text-emerald-400">45B L</span>
                            </div>
                            <div className="flex justify-between">
                                <span>BTC:</span>
                                <span className="text-yellow-400">75B L</span>
                            </div>
                            <div className="flex justify-between">
                                <span>SOL:</span>
                                <span className="text-purple-400">12B L</span>
                            </div>
                        </div>
                    </div>

                    {/* E-waste Card */}
                    <div className="gradient-border p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <h4 className="font-semibold text-red-400">E-waste</h4>
                        </div>
                        <div className="text-2xl font-bold text-white mb-2">≈ 31,200 tons</div>
                        <p className="text-sm text-gray-300">Annual electronic waste</p>
                        <div className="mt-2 text-xs text-gray-400">
                            <div className="flex justify-between">
                                <span>ETH:</span>
                                <span className="text-emerald-400">8,000 tons</span>
                            </div>
                            <div className="flex justify-between">
                                <span>BTC:</span>
                                <span className="text-yellow-400">22,000 tons</span>
                            </div>
                            <div className="flex justify-between">
                                <span>SOL:</span>
                                <span className="text-purple-400">1,200 tons</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simple Explanation */}
                <div className="mt-6 p-4 bg-opacity-50 bg-blue-900 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">Why Does This Matter? 🌍</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                        <p>• Blockchain networks use a lot of computers working 24/7 to keep everything secure</p>
                        <p>• These computers need electricity, which often comes from fossil fuels</p>
                        <p>• Mining equipment gets outdated quickly, creating electronic waste</p>
                        <p>• The good news: Many networks are moving to greener solutions!</p>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {response && (
                <div className="space-y-6">
                    <div ref={analysisRef} className="glass-card p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2 text-blue-400">Blockchain Impact Analysis</h3>
                        <p className="text-gray-400 mb-4">
                            Compare the environmental impact between blockchain networks.
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
                            <h3 className="text-base sm:text-lg font-semibold mb-2 text-yellow-400">Energy Usage Comparison</h3>
                            <p className="text-xs sm:text-sm text-gray-400 mb-4">
                                Annual energy consumption in TWh
                            </p>
                            <div className="h-[250px] sm:h-[400px]">
                                <Bar
                                    data={{
                                        labels: ['Ethereum', 'Bitcoin', 'Solana'],
                                        datasets: [{
                                            label: 'Energy Usage (TWh/year)',
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
                            <h3 className="text-base sm:text-lg font-semibold mb-2 text-emerald-400">Carbon Footprint Comparison</h3>
                            <p className="text-xs sm:text-sm text-gray-400 mb-4">
                                Annual CO2 emissions in million tons
                            </p>
                            <div className="h-[250px] sm:h-[400px]">
                                <Bar
                                    data={{
                                        labels: ['Ethereum', 'Bitcoin', 'Solana'],
                                        datasets: [{
                                            label: 'CO2 Emissions (Mt/year)',
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
                            <h3 className="text-base sm:text-lg font-semibold mb-2 text-blue-400">Water Usage Comparison</h3>
                            <p className="text-xs sm:text-sm text-gray-400 mb-4">
                                Annual water consumption in billion liters
                            </p>
                            <div className="h-[250px] sm:h-[400px]">
                                <Bar
                                    data={{
                                        labels: ['Ethereum', 'Bitcoin', 'Solana'],
                                        datasets: [{
                                            label: 'Water Usage (B liters/year)',
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
                            <h3 className="text-base sm:text-lg font-semibold mb-2 text-red-400">E-waste Comparison</h3>
                            <p className="text-xs sm:text-sm text-gray-400 mb-4">
                                Annual electronic waste in tons
                            </p>
                            <div className="h-[250px] sm:h-[400px]">
                                <Bar
                                    data={{
                                        labels: ['Ethereum', 'Bitcoin', 'Solana'],
                                        datasets: [{
                                            label: 'E-waste (tons/year)',
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
                            <h3 className="text-lg font-semibold mb-2 text-emerald-400">Optimization Suggestions</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Actionable recommendations to improve blockchain sustainability.
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
                                                {rec.impact.toUpperCase()} Impact
                                            </span>
                                            <span className="ml-4 text-gray-400">
                                                Est. Savings: {rec.estimatedSavings}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Report */}
                    {response.report && (
                        <div ref={reportRef} className="glass-card p-6 rounded-lg col-span-2">
                            <h3 className="text-lg font-semibold mb-2 text-blue-400">Sustainability Report</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Comprehensive 24-hour analysis of blockchain environmental impact.
                            </p>
                            <div className="space-y-6">
                                {/* Executive Summary */}
                                {typeof response.report.summary === 'string' && (
                                    <div className="gradient-border p-4">
                                        <h4 className="font-semibold text-emerald-400 mb-2">Executive Summary</h4>
                                        <p className="text-gray-300">{response.report.summary}</p>
                                    </div>
                                )}

                                {/* Report Sections */}
                                {Array.isArray(response.report.sections) && response.report.sections.map((section, index) => (
                                    <div key={index} className="gradient-border p-4">
                                        <h4 className="font-semibold text-blue-400 mb-2">{section.title}</h4>
                                        <div className="text-gray-300 space-y-4">
                                            <p>{section.content}</p>
                                            
                                            {/* Key Metrics */}
                                            {Array.isArray(section.key_metrics) && section.key_metrics.length > 0 && (
                                                <div className="mt-4">
                                                    <h5 className="text-sm font-medium text-gray-400 mb-2">Key Metrics:</h5>
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
                                                    <h5 className="text-sm font-medium text-gray-400 mb-2">Recommendations:</h5>
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
                                        <h4 className="font-semibold text-purple-400 mb-2">Conclusion</h4>
                                        <p className="text-gray-300">{response.report.conclusion}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div><footer className="glass-card mt-12 p-8 rounded-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* About Section */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                About This Project
                            </h4>
                            <p className="text-gray-400 text-sm">
                                An AI-powered platform monitoring and analyzing the environmental impact of blockchain networks.
                                Committed to promoting sustainable practices in the crypto space.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                Resources
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="https://ethereum.org/en/energy-consumption/"
                                        className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                                        Ethereum Energy Consumption
                                    </a>
                                </li>
                                <li>
                                    <a href="https://ccaf.io/cbnsi/cbeci"
                                        className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                                        Cambridge Bitcoin Electricity Consumption Index
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact/Social */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                Stay Connected
                            </h4>
                            <div className="flex space-x-4">
                                <a href="https://www.linkedin.com/in/andrii-furmanets-1a5b6452/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                </a>
                                <a href="https://github.com/afurm/Green-Blockchain-Monitor" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                </a>
                            </div>
                            <p className="mt-4 text-sm text-gray-400">
                                Stay updated with our latest insights and developments in blockchain sustainability.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 text-sm">
                                © 2025 Green Blockchain Monitor. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer></>
    );
} 