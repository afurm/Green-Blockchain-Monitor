'use client';

import { useState, useEffect } from 'react';
import { PlayIcon, StopIcon, ClockIcon, TrashIcon } from '@heroicons/react/24/outline';

interface SystemStatus {
    isRunning: boolean;
    processes: {
        id: string;
        name: string;
        status: string;
        startTime: Date;
        type: string;
    }[];
}

interface LogEntry {
    timestamp: Date;
    message: string;
    type: 'info' | 'success' | 'error';
}

export default function SystemControls() {
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start with loading state
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
        setLogs(prev => [...prev, {
            timestamp: new Date(),
            message,
            type
        }].slice(-50)); // Keep last 50 logs
    };

    // Initial status check and periodic updates
    useEffect(() => {
        let isMounted = true;

        const fetchStatus = async () => {
            try {
                const response = await fetch('/api/system', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'status' })
                });
                
                if (!response.ok) throw new Error('Failed to fetch status');
                
                const data = await response.json();
                
                if (isMounted) {
                    setStatus(data.status);
                    setIsLoading(false);

                    // Add log for process changes
                    if (data.status?.processes) {
                        data.status.processes.forEach((process: any) => {
                            if (process.status === 'running') {
                                addLog(`Process ${process.name} is running`, 'info');
                            } else if (process.status === 'failed') {
                                addLog(`Process ${process.name} failed`, 'error');
                            }
                        });
                    }

                    // Log system status on initial load
                    if (data.status?.isRunning) {
                        addLog('System is currently running', 'info');
                    }
                }
            } catch (err) {
                console.error('Error fetching status:', err);
                if (isMounted) {
                    addLog('Failed to fetch system status', 'error');
                    setIsLoading(false);
                }
            }
        };

        fetchStatus(); // Initial fetch
        const interval = setInterval(fetchStatus, 5000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    const handleAction = async (action: 'start' | 'stop') => {
        try {
            setError(null);
            setIsLoading(true);
            addLog(`Attempting to ${action} system...`, 'info');

            const response = await fetch('/api/system', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Operation failed');
            }

            const data = await response.json();
            setStatus(data.status);
            addLog(`System ${action}ed successfully`, 'success');

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Operation failed';
            setError(message);
            addLog(`Error: ${message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCleanup = async () => {
        if (!confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            return;
        }

        try {
            setError(null);
            setIsLoading(true);
            addLog('Cleaning database...', 'info');

            const response = await fetch('/api/data/cleanup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to clean database');
            }

            addLog('Database cleaned successfully', 'success');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to clean database';
            setError(message);
            addLog(`Error: ${message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">System Controls</h2>
                
                <div className="flex items-center space-x-4">
                    {isLoading ? (
                        <div className="flex items-center text-gray-500">
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Checking system status...
                        </div>
                    ) : !status?.isRunning ? (
                        <>
                            <button
                                onClick={() => handleAction('start')}
                                disabled={isLoading}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                <PlayIcon className="h-5 w-5 mr-2" />
                                Start System
                            </button>
                            <button
                                onClick={handleCleanup}
                                disabled={isLoading}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                            >
                                <TrashIcon className="h-5 w-5 mr-2" />
                                Clear All Data
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => handleAction('stop')}
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                            <StopIcon className="h-5 w-5 mr-2" />
                            Stop System
                        </button>
                    )}
                </div>

                {/* Process List */}
                {status?.processes && status.processes.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Running Processes</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            {status.processes.map((process) => (
                                <div key={process.id} className="flex items-center justify-between py-2">
                                    <div>
                                        <span className="font-medium text-gray-900">{process.name}</span>
                                        <span className="ml-2 text-sm text-gray-500">
                                            Started: {new Date(process.startTime).toLocaleString()}
                                        </span>
                                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                            process.status === 'running' ? 'bg-green-100 text-green-800' :
                                            process.status === 'failed' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {process.status}
                                        </span>
                                        <span className="ml-2 text-xs text-gray-500">
                                            ({process.type})
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* System Logs */}
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">System Logs</h3>
                    <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-auto">
                        {logs.map((log, index) => (
                            <div key={index} className="py-1">
                                <span className="text-xs text-gray-500">
                                    <ClockIcon className="inline h-3 w-3 mr-1" />
                                    {log.timestamp.toLocaleTimeString()}
                                </span>
                                <span className={`ml-2 text-sm ${
                                    log.type === 'error' ? 'text-red-600' :
                                    log.type === 'success' ? 'text-green-600' :
                                    'text-gray-600'
                                }`}>
                                    {log.message}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="mt-2 text-sm text-red-600">
                        Error: {error}
                    </div>
                )}

                <div className="mt-4 text-sm text-gray-500">
                    <h3 className="font-medium mb-2">About System Controls:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Start System: Begins all necessary data collection and processing</li>
                        <li>Data collection runs every 5 minutes</li>
                        <li>Insights are generated hourly</li>
                        <li>Anomaly model updates daily</li>
                    </ul>
                </div>
            </div>
        </div>
    );
} 