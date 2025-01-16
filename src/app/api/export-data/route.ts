import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { BlockchainMetric } from '@prisma/client';

export async function GET() {
    try {
        // Fetch blockchain metrics data
        const metrics = await prisma.blockchainMetrics.findMany({
            orderBy: {
                timestamp: 'desc'
            }
        });

        // Convert data to CSV format
        const headers = ['Timestamp', 'Blockchain', 'Energy Usage (kWh)', 'Emissions (kg CO2)', 'Transactions', 'Block Number', 'Gas Used', 'Average Gas Price'];
        const rows = metrics.map((metric: BlockchainMetric) => [
            metric.timestamp.toISOString(),
            metric.blockchain,
            metric.energyUsageKwh.toString(),
            metric.emissionsKgCo2.toString(),
            metric.transactionCount.toString(),
            metric.blockNumber.toString(),
            metric.gasUsed.toString(),
            metric.avgGasPrice.toString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map((row: string[]) => row.join(','))
        ].join('\n');

        // Return CSV file
        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename=blockchain-data-${new Date().toISOString().split('T')[0]}.csv`
            }
        });
    } catch (error) {
        console.error('Error exporting data:', error);
        return NextResponse.json(
            { error: 'Failed to export data' },
            { status: 500 }
        );
    }
} 