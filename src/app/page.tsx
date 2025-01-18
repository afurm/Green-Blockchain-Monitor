'use client';

import Dashboard from './components/Dashboard';

export default function Home() {
  return (
    <div className="space-y-8 p-6 min-h-screen">
      {/* Header */}
      <div className="glass-card p-8 rounded-lg relative overflow-hidden border border-gray-800">
        {/* Background Effect */}
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
          <div className="absolute top-0 right-0 bg-blue-400 rounded-full w-64 h-64 filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 bg-emerald-400 rounded-full w-64 h-64 filter blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Content */}
          {/* Introduction */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-3">
                        <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                                Green Blockchain
                            </h1>
                            <p className="text-sm text-gray-400">Ethereum, Bitcoin & Solana Sustainability Monitor</p>
                        </div>
                    </div>
                    <div className="hidden md:flex flex items-center space-x-4" >
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="text-gray-400 text-sm">Live Monitoring</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                            <span className="text-gray-400 text-sm">ETH</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                            <span className="text-gray-400 text-sm">BTC</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                            <span className="text-gray-400 text-sm">SOL</span>
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                    Revolutionizing Blockchain Sustainability
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                    Harness the power of AI to analyze, optimize, and transform the environmental impact of Ethereum, Bitcoin, and Solana networks in real-time.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                    <button className="glass-card px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-opacity-75 transition-all">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                        <span className="text-blue-400">ETH Network</span>
                    </button>
                    <button className="glass-card px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-opacity-75 transition-all">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                        <span className="text-yellow-400">BTC Network</span>
                    </button>
                    <button className="glass-card px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-opacity-75 transition-all">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                        <span className="text-purple-400">SOL Network</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-card p-4 flex items-center space-x-3">
                        <span className="text-4xl font-bold text-emerald-400">24/7</span>
                        <div>
                            <h3 className="font-semibold text-gray-200">Real-time Monitoring</h3>
                            <p className="text-sm text-gray-400">Continuous network analysis</p>
                        </div>
                    </div>
                    <div className="glass-card p-4 flex items-center space-x-3">
                        <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span>
                        <div>
                            <h3 className="font-semibold text-gray-200">Powered Analysis</h3>
                            <p className="text-sm text-gray-400">Smart insights & predictions</p>
                        </div>
                    </div>
                    <div className="glass-card p-4 flex items-center space-x-3">
                        <span className="text-4xl font-bold text-blue-400">100%</span>
                        <div>
                            <h3 className="font-semibold text-gray-200">Data Transparency</h3>
                            <p className="text-sm text-gray-400">Verifiable metrics</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="gradient-border p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="font-semibold text-emerald-400">Real-time Analysis</h3>
                        </div>
                        <p className="text-sm text-gray-300">Instant insights about energy usage and emissions from blockchain networks.</p>
                    </div>
                    <div className="gradient-border p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <h3 className="font-semibold text-blue-400">Future Predictions</h3>
                        </div>
                        <p className="text-sm text-gray-300">AI-powered forecasts of energy consumption and environmental impact.</p>
                    </div>
                    <div className="gradient-border p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            <h3 className="font-semibold text-purple-400">Optimization Tips</h3>
                        </div>
                        <p className="text-sm text-gray-300">Smart suggestions to improve blockchain sustainability.</p>
                    </div>
                </div>
            </div>

      {/* Dashboard */}
      <Dashboard />
    </div>
  );
} 