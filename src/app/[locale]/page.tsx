'use client';

import { useTranslations } from 'next-intl';
import Dashboard from '@/app/components/Dashboard';

export default function Home() {
  const t = useTranslations();
  
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
                {t('title')}
              </h1>
              <p className="text-sm text-gray-400">{t('subtitle')}</p>
            </div>
          </div>
          <div className="hidden md:flex flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-gray-400 text-sm">{t('networks.monitoring')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <span className="text-gray-400 text-sm">{t('networks.eth')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
              <span className="text-gray-400 text-sm">{t('networks.btc')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
              <span className="text-gray-400 text-sm">{t('networks.sol')}</span>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
          {t('environmentalImpact.title')}
        </h2>
        <p className="text-gray-300 text-lg mb-8">
          {t('mainAction.description')}
        </p>

        <div className="flex flex-wrap gap-4 mb-8">
          <button className="glass-card px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-opacity-75 transition-all">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            <span className="text-blue-400">{t('networks.ethNetwork')}</span>
          </button>
          <button className="glass-card px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-opacity-75 transition-all">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-yellow-400">{t('networks.btcNetwork')}</span>
          </button>
          <button className="glass-card px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-opacity-75 transition-all">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
            <span className="text-purple-400">{t('networks.solNetwork')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-4 flex items-center space-x-3">
            <span className="text-4xl font-bold text-emerald-400">24/7</span>
            <div>
              <h3 className="font-semibold text-gray-200">{t('features.realtime.title')}</h3>
              <p className="text-sm text-gray-400">{t('features.realtime.description')}</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center space-x-3">
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span>
            <div>
              <h3 className="font-semibold text-gray-200">{t('features.ai.title')}</h3>
              <p className="text-sm text-gray-400">{t('features.ai.description')}</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center space-x-3">
            <span className="text-4xl font-bold text-blue-400">100%</span>
            <div>
              <h3 className="font-semibold text-gray-200">{t('features.transparency.title')}</h3>
              <p className="text-sm text-gray-400">{t('features.transparency.description')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Real-time Analysis */}
          <div className="glass-card p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="font-semibold text-green-400">{t('analysisFeatures.realtime.title')}</h3>
            </div>
            <p className="text-sm text-gray-300">{t('analysisFeatures.realtime.description')}</p>
          </div>

          {/* Future Predictions */}
          <div className="glass-card p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="font-semibold text-blue-400">{t('analysisFeatures.predictions.title')}</h3>
            </div>
            <p className="text-sm text-gray-300">{t('analysisFeatures.predictions.description')}</p>
          </div>

          {/* Optimization Tips */}
          <div className="glass-card p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <h3 className="font-semibold text-purple-400">{t('analysisFeatures.optimization.title')}</h3>
            </div>
            <p className="text-sm text-gray-300">{t('analysisFeatures.optimization.description')}</p>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <Dashboard />
    </div>
  );
} 