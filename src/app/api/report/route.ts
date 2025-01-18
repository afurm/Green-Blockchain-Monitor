import { NextResponse } from 'next/server';
import { generateSustainabilityReport } from '@/services/ai/openai-service';
import { fetchBlockchainData } from '@/lib/blockchain-api';

export async function GET(request: Request) {
    try {
        // Get timeframe from query params (default to 24h)
        const { searchParams } = new URL(request.url);
        const timeframe = searchParams.get('timeframe') || '24h';

        // Fetch latest blockchain metrics
        const [ethMetrics, btcMetrics] = await Promise.all([
            fetchBlockchainData('Ethereum'),
            fetchBlockchainData('Bitcoin')
        ]);

        const metrics = {
            ethereum: ethMetrics,
            bitcoin: btcMetrics,
            timeframe,
            timestamp: new Date().toISOString()
        };

        // Generate sustainability report using OpenAI
        const report = await generateSustainabilityReport(metrics);

        // Return the combined response
        return NextResponse.json({
            metrics,
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