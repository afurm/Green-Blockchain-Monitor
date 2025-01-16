import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // For now, return default settings since we don't have user authentication
        const defaultSettings = {
            notifications: {
                emailNotifications: false,
                browserNotifications: true,
                weeklyReports: false,
            },
            data: {
                retentionPeriod: '30',
            },
        };

        return NextResponse.json(defaultSettings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Validate the data
        if (!data.notifications || !data.data) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // In a real application, you would save these settings to the database
        // For now, we'll just return the received settings
        const savedSettings = {
            notifications: data.notifications,
            data: data.data,
            updatedAt: new Date().toISOString(),
        };

        return NextResponse.json(savedSettings);
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
} 