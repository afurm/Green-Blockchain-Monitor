'use client';

import { useState, useEffect } from 'react';
import SystemControls from '../components/SystemControls';

export default function AdminPage() {
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        // Update time only on client side
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleString('en-US', { 
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8 p-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Admin Dashboard
                </h1>
                <p className="text-gray-600 mb-6">
                    Manage system operations and monitor running processes. Use these controls with caution
                    as they can affect system performance and data integrity.
                </p>
            </div>

            {/* System Status Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Last Update</p>
                        <p className="text-lg font-semibold text-blue-700">
                            {currentTime || 'Loading...'}
                        </p>
                    </div>
                </div>
            </div>

            {/* System Controls Section */}
            <SystemControls />
        </div>
    );
} 