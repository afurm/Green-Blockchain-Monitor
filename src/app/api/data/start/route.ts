import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { processManager } from '../processManager';

export async function POST() {
    try {
        if (processManager.isProcessRunning()) {
            return NextResponse.json(
                { error: 'Data collection is already running' },
                { status: 400 }
            );
        }

        // Start the data collection script
        const scriptPath = path.join(process.cwd(), 'src/scripts/collectAndPreprocessData.ts');
        
        const collectionProcess = spawn('npx', [
            'ts-node',
            '-r', 'tsconfig-paths/register',
            '-P', 'tsconfig.scripts.json',
            scriptPath
        ], {
            env: {
                ...process.env,
                NODE_ENV: 'development',
                TS_NODE_PROJECT: 'tsconfig.scripts.json',
                PATH: process.env.PATH
            },
            cwd: process.cwd()
        });

        let errorOutput = '';

        // Handle script output
        collectionProcess.stdout.on('data', (data: Buffer) => {
            console.log(`Data collection output: ${data}`);
        });

        collectionProcess.stderr.on('data', (data: Buffer) => {
            errorOutput += data.toString();
            console.error(`Data collection error: ${data}`);
        });

        collectionProcess.on('close', (code: number) => {
            console.log(`Data collection process exited with code ${code}`);
            if (code !== 0) {
                console.error('Error output:', errorOutput);
            }
            processManager.clearProcess();
        });

        // Store the process in the manager
        processManager.setProcess(collectionProcess);

        return NextResponse.json({ message: 'Data collection started successfully' });
    } catch (error) {
        console.error('Error starting data collection:', error);
        return NextResponse.json(
            { error: 'Failed to start data collection' },
            { status: 500 }
        );
    }
} 