'use client';

import { BookOpenIcon, BeakerIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline';

export default function DocumentationPage() {
    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Documentation
                </h1>
                <p className="text-gray-600">
                    Welcome to the Green Blockchain Monitor documentation. Here you'll find detailed information about
                    how to use the system, its features, and best practices.
                </p>
            </div>

            {/* Quick Start Guide */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <BookOpenIcon className="h-6 w-6 mr-2 text-green-600" />
                    Quick Start Guide
                </h2>
                <div className="prose max-w-none">
                    <ol className="list-decimal pl-5 space-y-4">
                        <li>
                            <strong>Start Data Collection:</strong> Go to the Admin page and use the Data Collection
                            Controls to start gathering blockchain data. The system will automatically collect data
                            every 5 minutes.
                        </li>
                        <li>
                            <strong>View Analytics:</strong> Visit the Analytics page to see detailed charts and
                            metrics about blockchain energy consumption and emissions.
                        </li>
                        <li>
                            <strong>Generate Insights:</strong> Use the Maintenance Scripts in the Admin page to
                            generate AI-powered insights about the collected data.
                        </li>
                    </ol>
                </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <ChartBarIcon className="h-6 w-6 mr-2 text-green-600" />
                    Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Real-time blockchain energy metrics</li>
                            <li>Customizable time ranges</li>
                            <li>Multiple blockchain network support</li>
                            <li>Interactive charts and visualizations</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Automated pattern detection</li>
                            <li>Anomaly detection</li>
                            <li>Predictive analytics</li>
                            <li>Sustainability recommendations</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Admin Controls */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <CogIcon className="h-6 w-6 mr-2 text-green-600" />
                    Admin Controls
                </h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Data Collection Controls</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li><strong>Start Collection:</strong> Begins automated data collection every 5 minutes</li>
                            <li><strong>Stop Collection:</strong> Pauses the data collection process</li>
                            <li><strong>Refresh Data:</strong> Manually triggers a single data collection cycle</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Maintenance Scripts</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li><strong>Generate Insights:</strong> Creates new analytics and insights from collected data</li>
                            <li><strong>Test Insights:</strong> Validates the insights generation system</li>
                            <li><strong>Update Anomaly Model:</strong> Trains the model with the latest blockchain data</li>
                            <li><strong>Collect Data:</strong> Manually runs the data collection and preprocessing script</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Troubleshooting */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <BeakerIcon className="h-6 w-6 mr-2 text-green-600" />
                    Troubleshooting
                </h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Common Issues</h3>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900">Data Collection Not Starting</h4>
                                <p className="text-gray-600 mt-1">
                                    If data collection fails to start, check the following:
                                </p>
                                <ul className="list-disc pl-5 mt-2 text-gray-600">
                                    <li>Ensure no other collection process is running</li>
                                    <li>Check system logs for error messages</li>
                                    <li>Verify network connectivity</li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900">Script Execution Errors</h4>
                                <p className="text-gray-600 mt-1">
                                    If maintenance scripts fail to run:
                                </p>
                                <ul className="list-disc pl-5 mt-2 text-gray-600">
                                    <li>Check the error message in the admin interface</li>
                                    <li>Ensure all required dependencies are installed</li>
                                    <li>Verify the script has the correct permissions</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 