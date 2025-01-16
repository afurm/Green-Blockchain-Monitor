import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const metrics = await prisma.$queryRaw`
            SELECT *
            FROM BlockchainMetric
            ORDER BY timestamp DESC
            LIMIT 24
        `;

        if (!metrics || (metrics as any[]).length === 0) {
            return NextResponse.json(
                { error: 'No metrics data available' },
                { status: 404 }
            );
        }

        return NextResponse.json(metrics);
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch metrics' },
            { status: 500 }
        );
    }
} 