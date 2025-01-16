import { NextResponse } from 'next/server';
import { processManager } from '../processManager';

export async function POST() {
    try {
        const process = processManager.getProcess();
        if (!process) {
            return NextResponse.json(
                { error: 'No data collection process is running' },
                { status: 400 }
            );
        }

        // Kill the data collection process
        process.kill();
        processManager.clearProcess();

        return NextResponse.json({ message: 'Data collection stopped successfully' });
    } catch (error) {
        console.error('Error stopping data collection:', error);
        return NextResponse.json(
            { error: 'Failed to stop data collection' },
            { status: 500 }
        );
    }
} 