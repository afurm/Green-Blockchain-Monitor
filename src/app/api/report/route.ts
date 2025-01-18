import { NextResponse } from 'next/server';
import { generateSustainabilityReport } from '@/services/ai/openai-service';
import { fetchBlockchainData } from '@/lib/blockchain-api';

export async function GET(request: Request) {
    try {
        // Get timeframe and locale from query params
        const { searchParams } = new URL(request.url);
        const timeframe = searchParams.get('timeframe') || '24h';
        const locale = searchParams.get('locale') || 'en';

        // Fetch latest blockchain metrics
        const blockchainData = await fetchBlockchainData();
        
        // Generate sustainability report using OpenAI with locale
        const report = await generateSustainabilityReport(blockchainData, locale);

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