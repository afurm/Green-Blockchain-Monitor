import { NextResponse } from 'next/server';
import { scriptManager } from '../scripts/manager';

export async function POST(request: Request) {
    try {
        const { action } = await request.json();

        switch (action) {
            case 'start':
                await scriptManager.startSystem();
                return NextResponse.json({
                    message: 'System started successfully',
                    status: scriptManager.getSystemStatus()
                });

            case 'stop':
                await scriptManager.stopSystem();
                return NextResponse.json({
                    message: 'System stopped successfully',
                    status: scriptManager.getSystemStatus()
                });

            case 'status':
                return NextResponse.json({
                    status: scriptManager.getSystemStatus()
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error handling system action:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'System operation failed' },
            { status: 500 }
        );
    }
} 