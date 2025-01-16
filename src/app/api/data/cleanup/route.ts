import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
    try {
        // Delete all records from BlockchainMetric table
        await prisma.$queryRaw`TRUNCATE TABLE BlockchainMetric`;

        return NextResponse.json({ 
            message: 'Database cleaned successfully' 
        });
    } catch (error) {
        console.error('Error cleaning database:', error);
        return NextResponse.json(
            { error: 'Failed to clean database' },
            { status: 500 }
        );
    }
} 