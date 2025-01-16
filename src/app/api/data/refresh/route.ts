import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST() {
    try {
        // Run the data collection script once
        const scriptPath = path.join(process.cwd(), 'src/scripts/collectAndPreprocessData.ts');
        
        const refreshProcess = spawn('npx', [
            'ts-node',
            '-r', 'tsconfig-paths/register',
            '-P', 'tsconfig.scripts.json',
            scriptPath,
            '--once'  // Run once flag
        ], {
            env: {
                ...process.env,
                NODE_ENV: 'development',
                TS_NODE_PROJECT: 'tsconfig.scripts.json',
                PATH: process.env.PATH
            },
            cwd: process.cwd()
        });

        return new Promise((resolve, reject) => {
            let output = '';
            let errorOutput = '';

            refreshProcess.stdout.on('data', (data: Buffer) => {
                output += data.toString();
                console.log(`Data refresh output: ${data}`);
            });

            refreshProcess.stderr.on('data', (data: Buffer) => {
                errorOutput += data.toString();
                console.error(`Data refresh error: ${data}`);
            });

            refreshProcess.on('close', (code: number) => {
                console.log(`Data refresh process exited with code ${code}`);
                if (code === 0) {
                    resolve(NextResponse.json({ 
                        message: 'Data refreshed successfully',
                        output 
                    }));
                } else {
                    console.error('Error output:', errorOutput);
                    reject(new Error(`Data refresh failed with code ${code}\n${errorOutput}`));
                }
            });

            refreshProcess.on('error', (err) => {
                console.error('Failed to start refresh process:', err);
                reject(err);
            });
        }).catch(error => {
            console.error('Error during refresh:', error);
            return NextResponse.json(
                { error: 'Failed to refresh data', details: error.message },
                { status: 500 }
            );
        });
    } catch (error) {
        console.error('Error refreshing data:', error);
        return NextResponse.json(
            { error: 'Failed to refresh data' },
            { status: 500 }
        );
    }
} 