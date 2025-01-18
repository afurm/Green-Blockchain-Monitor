import { NextResponse } from 'next/server';
import { fetchBlockchainData } from '@/lib/blockchain-api';
import { getOptimizationSuggestions } from '@/services/ai/openai-service';

export async function GET() {
    try {
        // Fetch the latest blockchain data
        const blockchainData = await fetchBlockchainData();

        // Get optimization suggestions based on the metrics
        const suggestions = await getOptimizationSuggestions(blockchainData);

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