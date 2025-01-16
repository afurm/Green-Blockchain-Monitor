import { NextResponse } from 'next/server';
import { spawn, type ChildProcess } from 'child_process';
import path from 'path';

// Define allowed scripts and their configurations
const allowedScripts: Record<string, { command: string; args: string[] }> = {
    'collectAndPreprocessData.ts': {
        command: 'ts-node',
        args: ['-r', 'tsconfig-paths/register', '-P', 'tsconfig.scripts.json']
    },
    'generate_insights.py': {
        command: 'python3',
        args: []
    },
    'update_anomaly_model.py': {
        command: 'python3',
        args: []
    }
};

export async function POST(request: Request) {
    try {
        const { script } = await request.json();

        if (!script || !(script in allowedScripts)) {
            return NextResponse.json(
                { error: 'Invalid or unauthorized script' },
                { status: 400 }
            );
        }

        const scriptPath = path.join(process.cwd(), 'src/scripts', script);
        const config = allowedScripts[script];

        const scriptProcess: ChildProcess = spawn(config.command, [...config.args, scriptPath], {
            env: {
                ...process.env,
                NODE_ENV: 'development',
                TS_NODE_PROJECT: 'tsconfig.scripts.json',
                PATH: process.env.PATH
            },
            cwd: process.cwd()
        });

        let output = '';
        let errorOutput = '';

        scriptProcess.stdout?.on('data', (data: Buffer) => {
            output += data.toString();
            console.log(`Script output: ${data}`);
        });

        scriptProcess.stderr?.on('data', (data: Buffer) => {
            errorOutput += data.toString();
            console.error(`Script error: ${data}`);
        });

        const exitCode = await new Promise<number>((resolve) => {
            scriptProcess.on('close', resolve);
        });

        if (exitCode !== 0) {
            console.error('Script error output:', errorOutput);
            return NextResponse.json(
                { error: 'Script execution failed', output: errorOutput },
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            message: 'Script executed successfully',
            output 
        });
    } catch (error) {
        console.error('Error running script:', error);
        return NextResponse.json(
            { error: 'Failed to run script' },
            { status: 500 }
        );
    }
} 