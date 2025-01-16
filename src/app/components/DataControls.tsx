'use client';

import { useState } from 'react';
import { ArrowPathIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline';

export default function DataControls() {
    const [isCollecting, setIsCollecting] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const startCollection = async () => {
        try {
            setError(null);
            setStatus('Starting data collection...');
            const response = await fetch('/api/data/start', { method: 'POST' });
            if (!response.ok) {
                throw new Error('Failed to start data collection');
            }
            setIsCollecting(true);
            setStatus('Data collection is running');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start data collection');
            setStatus(null);
        }
    };

    const stopCollection = async () => {
        try {
            setError(null);
            setStatus('Stopping data collection...');
            const response = await fetch('/api/data/stop', { method: 'POST' });
            if (!response.ok) {
                throw new Error('Failed to stop data collection');
            }
            setIsCollecting(false);
            setStatus('Data collection stopped');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to stop data collection');
            setStatus(null);
        }
    };

    const refreshData = async () => {
        try {
            setError(null);
            setStatus('Refreshing data...');
            const response = await fetch('/api/data/refresh', { method: 'POST' });
            if (!response.ok) {
                throw new Error('Failed to refresh data');
            }
            setStatus('Data refreshed successfully');
            // Clear status after 3 seconds
            setTimeout(() => setStatus(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to refresh data');
            setStatus(null);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Data Collection Controls</h2>
                
                <div className="flex items-center space-x-4">
                    {!isCollecting ? (
                        <button
                            onClick={startCollection}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <PlayIcon className="h-5 w-5 mr-2" />
                            Start Collection
                        </button>
                    ) : (
                        <button
                            onClick={stopCollection}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <StopIcon className="h-5 w-5 mr-2" />
                            Stop Collection
                        </button>
                    )}

                    <button
                        onClick={refreshData}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <ArrowPathIcon className="h-5 w-5 mr-2" />
                        Refresh Data
                    </button>
                </div>

                {status && (
                    <div className="mt-2 text-sm text-gray-600">
                        {status}
                    </div>
                )}

                {error && (
                    <div className="mt-2 text-sm text-red-600">
                        Error: {error}
                    </div>
                )}

                <div className="mt-4 text-sm text-gray-500">
                    <h3 className="font-medium mb-2">How it works:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Click "Start Collection" to begin gathering real-time blockchain data</li>
                        <li>Data will be collected every 5 minutes for accurate tracking</li>
                        <li>Use "Stop Collection" to pause data gathering</li>
                        <li>Click "Refresh Data" to manually update the analytics</li>
                    </ul>
                </div>
            </div>
        </div>
    );
} 