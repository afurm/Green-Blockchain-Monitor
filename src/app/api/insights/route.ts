import { NextResponse } from 'next/server';
import { fetchBlockchainData } from '@/lib/blockchain-api';
import { analyzeBlockchainData } from '@/services/ai/openai-service';

export async function GET(request: Request) {
    try {
        // Get locale from query params
        const { searchParams } = new URL(request.url);
        const locale = searchParams.get('locale') || 'en';

        // Fetch data for all networks
        const metrics = await fetchBlockchainData();
        
        // Get AI analysis of the data with locale
        const { insights, predictions } = await analyzeBlockchainData(metrics, locale);

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