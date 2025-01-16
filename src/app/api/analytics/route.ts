import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const blockchain = searchParams.get('blockchain') || 'Ethereum';
        const timeRange = searchParams.get('timeRange') || '24h';

        // Calculate the start time based on the time range
        const now = new Date();
        let startTime = new Date();
        switch (timeRange) {
            case '7d':
                startTime.setDate(now.getDate() - 7);
                break;
            case '30d':
                startTime.setDate(now.getDate() - 30);
                break;
            default: // 24h
                startTime.setDate(now.getDate() - 1);
        }

        // Fetch metrics for the selected blockchain and time range
        const metrics = await prisma.blockchainMetric.findMany({
            where: {
                blockchain: blockchain,
                timestamp: {
                    gte: startTime
                }
            },
            orderBy: {
                timestamp: 'asc'
            }
        });

        // Calculate key statistics
        const totalEnergyUsage = metrics.reduce((sum, metric) => sum + metric.energyUsageKwh, 0);
        const totalEmissions = metrics.reduce((sum, metric) => sum + metric.emissionsKgCo2, 0);
        const totalTransactions = metrics.reduce((sum, metric) => sum + metric.transactionCount, 0);

        // Calculate efficiency score (example formula)
        const avgEnergyPerTransaction = totalEnergyUsage / totalTransactions;
        const efficiencyScore = Math.min(10, Math.max(1, 10 - (avgEnergyPerTransaction * 10)));

        // Generate simple predictions for the next 24 hours
        const lastMetric = metrics[metrics.length - 1];
        const predictions = [];
        if (lastMetric) {
            for (let i = 1; i <= 24; i++) {
                const predictionTime = new Date(lastMetric.timestamp);
                predictionTime.setHours(predictionTime.getHours() + i);
                
                // Add some random variation to predictions
                const variation = 0.1; // 10% variation
                predictions.push({
                    timestamp: predictionTime.toISOString(),
                    emissionsKgCo2: lastMetric.emissionsKgCo2 * (1 + (Math.random() - 0.5) * variation)
                });
            }
        }

        return NextResponse.json({
            metrics: metrics.map(m => ({
                timestamp: m.timestamp,
                energyUsageKwh: m.energyUsageKwh,
                emissionsKgCo2: m.emissionsKgCo2,
                transactionCount: m.transactionCount
            })),
            predictions,
            statistics: {
                totalEnergyUsage,
                totalEmissions,
                totalTransactions,
                efficiencyScore,
                sustainabilityRank: 2 // Placeholder - would need comparison with other chains
            }
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics data' },
            { status: 500 }
        );
    }
} 