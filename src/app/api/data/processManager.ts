import { ChildProcess } from 'child_process';

class ProcessManager {
    private static instance: ProcessManager;
    private collectionProcess: ChildProcess | null = null;

    private constructor() {}

    public static getInstance(): ProcessManager {
        if (!ProcessManager.instance) {
            ProcessManager.instance = new ProcessManager();
        }
        return ProcessManager.instance;
    }

    public setProcess(process: ChildProcess) {
        this.collectionProcess = process;
    }

    public getProcess(): ChildProcess | null {
        return this.collectionProcess;
    }

    public clearProcess() {
        this.collectionProcess = null;
    }

    public isProcessRunning(): boolean {
        return this.collectionProcess !== null;
    }
}

export const processManager = ProcessManager.getInstance(); 