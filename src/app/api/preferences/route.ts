import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface AlertThresholds {
  energyChange: number;
  emissionsChange: number;
  transactionChange: number;
}

interface PreferencesData {
  blockchains: string[];
  focusAreas: string[];
  alertThresholds: AlertThresholds;
}

export async function GET() {
  try {
    // For now, we'll use a default user ID of 1 until we implement authentication
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: 1 },
    });

    if (!preferences) {
      // Return default preferences if none exist
      return NextResponse.json({
        blockchains: ['Ethereum', 'Bitcoin'],
        focusAreas: ['energy', 'emissions', 'transactions'],
        alertThresholds: {
          energyChange: 10,
          emissionsChange: 10,
          transactionChange: 20,
        },
      });
    }

    // Convert JSON fields back to their proper types
    return NextResponse.json({
      blockchains: JSON.parse(preferences.blockchains as string),
      focusAreas: JSON.parse(preferences.focusAreas as string),
      alertThresholds: preferences.alertThresholds,
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: PreferencesData = await request.json();

    // Validate the data
    if (!data.blockchains || !data.focusAreas || !data.alertThresholds) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate thresholds are between 0 and 100
    const thresholds = Object.values(data.alertThresholds);
    if (thresholds.some(t => t < 0 || t > 100)) {
      return NextResponse.json(
        { error: 'Thresholds must be between 0 and 100' },
        { status: 400 }
      );
    }

    // First ensure we have a user
    const user = await prisma.user.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        email: 'default@example.com',
        name: 'Default User',
      },
    });

    // Update or create preferences
    const preferences = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        blockchains: JSON.stringify(data.blockchains),
        focusAreas: JSON.stringify(data.focusAreas),
        alertThresholds: data.alertThresholds,
      },
      create: {
        userId: user.id,
        blockchains: JSON.stringify(data.blockchains),
        focusAreas: JSON.stringify(data.focusAreas),
        alertThresholds: data.alertThresholds,
      },
    });

    // Convert JSON fields back to their proper types for the response
    return NextResponse.json({
      blockchains: JSON.parse(preferences.blockchains as string),
      focusAreas: JSON.parse(preferences.focusAreas as string),
      alertThresholds: preferences.alertThresholds,
    });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
} 