import { NextResponse } from 'next/server';

// Store running jobs (in a real app, this should be in a database)
interface Job {
    id: string;
    type: string;
    process: any;
    startTime: Date;
    status: 'running' | 'completed' | 'failed' | 'stopped';
}

const runningJobs = new Map<string, Job>();

export async function GET() {
    // Return list of running jobs
    const jobs = Array.from(runningJobs.values()).map(job => ({
        id: job.id,
        type: job.type,
        startTime: job.startTime,
        status: job.status
    }));
    
    return NextResponse.json({ jobs });
}

export async function POST(request: Request) {
    try {
        const { action, jobId } = await request.json();

        if (action === 'stop') {
            const job = runningJobs.get(jobId);
            if (!job) {
                return NextResponse.json({ error: 'Job not found' }, { status: 404 });
            }

            // Kill the process
            if (job.process && job.process.kill) {
                job.process.kill();
                job.status = 'stopped';
                runningJobs.delete(jobId);
                return NextResponse.json({ message: 'Job stopped successfully' });
            }
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

// Export for use in other API routes
export { runningJobs }; 