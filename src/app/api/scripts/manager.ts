import { ChildProcess, spawn } from 'child_process';
import path from 'path';

interface ScriptProcess {
    process: ChildProcess;
    name: string;
    startTime: Date;
    status: 'running' | 'stopped' | 'failed';
    type: 'continuous' | 'one-time';
}

class ScriptManager {
    private static instance: ScriptManager;
    private processes: Map<string, ScriptProcess> = new Map();
    private isSystemRunning: boolean = false;

    private constructor() {}

    public static getInstance(): ScriptManager {
        if (!ScriptManager.instance) {
            ScriptManager.instance = new ScriptManager();
        }
        return ScriptManager.instance;
    }

    public async startSystem(): Promise<void> {
        if (this.isSystemRunning) {
            throw new Error('System is already running');
        }

        try {
            // Start data collection (continuous)
            await this.startScript('collectAndPreprocessData.ts', 'continuous');
            
            // Start periodic tasks
            this.startPeriodicTasks();

            this.isSystemRunning = true;
            console.log('System started successfully');
        } catch (error) {
            console.error('Error starting system:', error);
            await this.stopSystem();
            throw error;
        }
    }

    public async stopSystem(): Promise<void> {
        try {
            // Stop all running processes
            for (const [id, scriptProcess] of this.processes.entries()) {
                await this.stopScript(id);
            }

            this.isSystemRunning = false;
            console.log('System stopped successfully');
        } catch (error) {
            console.error('Error stopping system:', error);
            throw error;
        }
    }

    private async startScript(
        scriptName: string,
        type: 'continuous' | 'one-time',
        args: string[] = []
    ): Promise<string> {
        const scriptPath = path.join(process.cwd(), 'src/scripts', scriptName);
        const scriptId = `${scriptName}-${Date.now()}`;

        try {
            const scriptProcess = spawn('npx', [
                'ts-node',
                '-r', 'tsconfig-paths/register',
                '-P', 'tsconfig.scripts.json',
                scriptPath,
                ...args
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

            scriptProcess.stdout.on('data', (data: Buffer) => {
                console.log(`[${scriptName}] Output:`, data.toString());
            });

            scriptProcess.stderr.on('data', (data: Buffer) => {
                errorOutput += data.toString();
                console.error(`[${scriptName}] Error:`, data.toString());
            });

            scriptProcess.on('close', (code: number) => {
                console.log(`[${scriptName}] Process exited with code ${code}`);
                if (code !== 0) {
                    console.error(`[${scriptName}] Error output:`, errorOutput);
                    const scriptProcess = this.processes.get(scriptId);
                    if (scriptProcess) {
                        scriptProcess.status = 'failed';
                    }
                }

                // For one-time scripts, remove them from the process list
                if (type === 'one-time') {
                    this.processes.delete(scriptId);
                }
            });

            this.processes.set(scriptId, {
                process: scriptProcess,
                name: scriptName,
                startTime: new Date(),
                status: 'running',
                type
            });

            return scriptId;
        } catch (error) {
            console.error(`Error starting script ${scriptName}:`, error);
            throw error;
        }
    }

    private async stopScript(scriptId: string): Promise<void> {
        const scriptProcess = this.processes.get(scriptId);
        if (!scriptProcess) {
            throw new Error(`No script found with ID ${scriptId}`);
        }

        try {
            scriptProcess.process.kill();
            scriptProcess.status = 'stopped';
            this.processes.delete(scriptId);
        } catch (error) {
            console.error(`Error stopping script ${scriptProcess.name}:`, error);
            throw error;
        }
    }

    private startPeriodicTasks(): void {
        // Run insights generation every hour
        setInterval(async () => {
            try {
                await this.startScript('generate_insights.py', 'one-time');
            } catch (error) {
                console.error('Error running periodic insights generation:', error);
            }
        }, 60 * 60 * 1000);

        // Update anomaly model daily
        setInterval(async () => {
            try {
                await this.startScript('update_anomaly_model.py', 'one-time');
            } catch (error) {
                console.error('Error running periodic model update:', error);
            }
        }, 24 * 60 * 60 * 1000);
    }

    public getSystemStatus(): {
        isRunning: boolean;
        processes: { id: string; name: string; status: string; startTime: Date; type: string }[];
    } {
        const processes = Array.from(this.processes.entries()).map(([id, proc]) => ({
            id,
            name: proc.name,
            status: proc.status,
            startTime: proc.startTime,
            type: proc.type
        }));

        return {
            isRunning: this.isSystemRunning,
            processes
        };
    }
}

export const scriptManager = ScriptManager.getInstance(); 