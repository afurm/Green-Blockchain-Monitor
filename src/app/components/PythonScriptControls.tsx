'use client';

import { useState, useEffect } from 'react';
import { PlayIcon, ArrowPathIcon, BeakerIcon, StopIcon } from '@heroicons/react/24/outline';

interface Job {
    id: string;
    type: string;
    startTime: string;
    status: 'running' | 'completed' | 'failed' | 'stopped';
}

export default function PythonScriptControls() {
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [runningJobs, setRunningJobs] = useState<Job[]>([]);

    // Fetch running jobs periodically
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('/api/jobs');
                if (response.ok) {
                    const data = await response.json();
                    setRunningJobs(data.jobs);
                }
            } catch (err) {
                console.error('Failed to fetch jobs:', err);
            }
        };

        // Fetch immediately and then every 5 seconds
        fetchJobs();
        const interval = setInterval(fetchJobs, 5000);

        return () => clearInterval(interval);
    }, []);

    const runScript = async (scriptName: string) => {
        try {
            setError(null);
            setStatus(`Starting ${scriptName}...`);
            const response = await fetch('/api/python/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ script: scriptName }),
            });
            
            if (!response.ok) {
                throw new Error(`Failed to start ${scriptName}`);
            }

            const data = await response.json();
            setStatus(`${scriptName} started with job ID: ${data.jobId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : `Failed to run ${scriptName}`);
            setStatus(null);
        }
    };

    const stopJob = async (jobId: string) => {
        try {
            setError(null);
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'stop', jobId }),
            });

            if (!response.ok) {
                throw new Error('Failed to stop job');
            }

            setStatus('Job stopped successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to stop job');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const scripts = [
        {
            name: 'Generate Insights',
            id: 'generate_insights.py',
            description: 'Generate new blockchain insights and analytics',
            icon: PlayIcon,
        },
        {
            name: 'Test Insights',
            id: 'test_insights.py',
            description: 'Run tests on the insights generation system',
            icon: BeakerIcon,
        },
        {
            name: 'Update Anomaly Model',
            id: 'update_anomaly_model.py',
            description: 'Update the anomaly detection model with new data',
            icon: ArrowPathIcon,
        },
        {
            name: 'Collect Data',
            id: 'collectAndPreprocessData.ts',
            description: 'Collect and preprocess blockchain data',
            icon: ArrowPathIcon,
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Script Controls</h2>
                
                {/* Running Jobs Section */}
                {runningJobs.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-md font-medium text-gray-700 mb-2">Running Jobs</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            {runningJobs.map((job) => (
                                <div key={job.id} className="flex items-center justify-between py-2">
                                    <div>
                                        <span className="font-medium text-gray-900">{job.type}</span>
                                        <span className="ml-2 text-sm text-gray-500">
                                            Started: {formatDate(job.startTime)}
                                        </span>
                                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                            job.status === 'running' ? 'bg-green-100 text-green-800' :
                                            job.status === 'failed' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {job.status}
                                        </span>
                                    </div>
                                    {job.status === 'running' && (
                                        <button
                                            onClick={() => stopJob(job.id)}
                                            className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                                        >
                                            <StopIcon className="h-4 w-4 mr-1" />
                                            Stop
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Script Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {scripts.map((script) => (
                        <div key={script.id} className="border rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <script.icon className="h-5 w-5 text-gray-500 mr-2" />
                                <h3 className="font-medium text-gray-900">{script.name}</h3>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{script.description}</p>
                            <button
                                onClick={() => runScript(script.id)}
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Run Script
                            </button>
                        </div>
                    ))}
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
                    <h3 className="font-medium mb-2">About these scripts:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Generate Insights: Creates new analytics and insights from collected data</li>
                        <li>Test Insights: Validates the insights generation system</li>
                        <li>Update Anomaly Model: Trains the model with the latest blockchain data</li>
                    </ul>
                </div>
            </div>
        </div>
    );
} 