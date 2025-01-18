import { NextResponse } from 'next/server';
import { fetchBlockchainData } from '@/lib/blockchain-api';
import { getOptimizationSuggestions } from '@/services/ai/openai-service';

export async function GET(request: Request) {
    try {
        // Get locale from query params
        const { searchParams } = new URL(request.url);
        const locale = searchParams.get('locale') || 'en';

        // Fetch the latest blockchain data
        const blockchainData = await fetchBlockchainData();

        // Get optimization suggestions based on the metrics with locale
        const suggestions = await getOptimizationSuggestions(blockchainData, locale);

        return NextResponse.json({
            recommendations: suggestions,
            success: true
        });

    } catch (error) {
        console.error('Failed to get optimization suggestions:', error);
        return NextResponse.json(
            { error: 'Failed to get optimization suggestions' },
            { status: 500 }
        );
    }
} 