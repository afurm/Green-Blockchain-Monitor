import { NextResponse } from 'next/server';
import { generateSustainabilityReport } from '@/services/ai/openai-service';
import { fetchBlockchainData } from '@/lib/blockchain-api';

export async function GET(request: Request) {
    try {
        // Get timeframe from query params (default to 24h)
        const { searchParams } = new URL(request.url);
        const timeframe = searchParams.get('timeframe') || '24h';

        // Fetch latest blockchain metrics
        const blockchainData = await fetchBlockchainData();
        
        // Generate sustainability report using OpenAI
        const report = await generateSustainabilityReport(blockchainData);

        // Return the combined response
        return NextResponse.json({
            metrics: {
                ethereum: blockchainData.find(m => m.network === 'ethereum'),
                bitcoin: blockchainData.find(m => m.network === 'bitcoin'),
                timeframe,
                timestamp: new Date().toISOString()
            },
            report,
            status: 'success'
        });

    } catch (error: any) {
        console.error('Error in report route:', error);
        return NextResponse.json(
            { 
                error: 'Failed to generate sustainability report', 
                details: error?.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
} 