import { NextResponse } from 'next/server';
import { fetchBlockchainData } from '@/lib/blockchain-api';
import { analyzeBlockchainData } from '@/services/ai/openai-service';

export async function GET() {
    try {
        // Fetch data for all networks
        const metrics = await fetchBlockchainData();
        
        // Get AI analysis of the data
        const { insights, predictions } = await analyzeBlockchainData(metrics);

        return NextResponse.json({
            success: true,
            metrics,
            insights,
            predictions
        });
    } catch (error) {
        console.error('Error in insights route:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get blockchain insights' },
            { status: 500 }
        );
    }
} 