import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // For now, return default preferences since we don't have user authentication yet
        const defaultPreferences = {
            blockchains: ['Ethereum', 'Bitcoin'],
            focusAreas: ['energy', 'emissions', 'transactions'],
            alertThresholds: {
                energyChange: 10,
                emissionsChange: 10,
                transactionChange: 20
            }
        };

        return NextResponse.json(defaultPreferences);
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user preferences' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        // Validate the data
        if (!data.blockchains || !data.focusAreas) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // For now, just return the received preferences since we don't have user authentication
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating user preferences:', error);
        return NextResponse.json(
            { error: 'Failed to update user preferences' },
            { status: 500 }
        );
    }
} 