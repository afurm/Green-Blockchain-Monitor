'use client';

import React from 'react';
import { 
    InformationCircleIcon, 
    ExclamationTriangleIcon, 
    ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

interface Insight {
    id: number;
    type: string;
    message: string;
    blockchain: string;
    category: string;
    createdAt: string;
    metadata: any;
    isRead: boolean;
    isArchived: boolean;
    user: {
        name: string;
    };
}

interface InsightCardsProps {
    insights: Insight[];
}

export default function InsightCards({ insights }: InsightCardsProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'info':
                return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
            case 'warning':
                return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
            case 'alert':
                return <ExclamationCircleIcon className="h-6 w-6 text-red-500" />;
            default:
                return <InformationCircleIcon className="h-6 w-6 text-gray-500" />;
        }
    };

    const getBackgroundColor = (type: string) => {
        switch (type) {
            case 'info':
                return 'bg-blue-50';
            case 'warning':
                return 'bg-yellow-50';
            case 'alert':
                return 'bg-red-50';
            default:
                return 'bg-gray-50';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const formatMetadata = (metadata: any) => {
        if (!metadata) return null;

        return (
            <div className="mt-2 text-sm text-gray-600">
                {metadata.percentageChange && (
                    <div>
                        Change: {metadata.percentageChange}% over {metadata.timeframe}
                    </div>
                )}
                {metadata.previousValue && metadata.currentValue && (
                    <div>
                        Value: {metadata.previousValue} → {metadata.currentValue}
                    </div>
                )}
                {metadata.currentCapacity && (
                    <div>
                        Current Capacity: {metadata.currentCapacity}%
                        {metadata.threshold && ` (Threshold: ${metadata.threshold}%)`}
                    </div>
                )}
                {metadata.avgTransactionTime && (
                    <div>
                        Avg Transaction Time: {metadata.avgTransactionTime}
                    </div>
                )}
            </div>
        );
    };

    if (!insights || insights.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No insights available at this time.
            </div>
        );
    }

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight) => (
                <div
                    key={insight.id}
                    className={`p-4 rounded-lg shadow-sm ${getBackgroundColor(insight.type)} hover:shadow-md transition-shadow duration-200`}
                >
                    <div className="flex items-start space-x-3">
                        {getIcon(insight.type)}
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full capitalize mr-2"
                                        style={{
                                            backgroundColor: insight.blockchain === 'Ethereum' ? '#627EEA33' : '#F7931A33',
                                            color: insight.blockchain === 'Ethereum' ? '#627EEA' : '#F7931A'
                                        }}>
                                        {insight.blockchain}
                                    </span>
                                    <span className="text-xs text-gray-500 capitalize">
                                        {insight.category}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {formatTimestamp(insight.createdAt)}
                                </span>
                            </div>
                            <p className="mt-2 text-gray-800">
                                {insight.message}
                            </p>
                            {formatMetadata(insight.metadata)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 