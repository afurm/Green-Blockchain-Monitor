import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';
import path from 'path';

const prisma = new PrismaClient();

// Get Python path from virtual environment
const PYTHON_PATH = process.platform === 'win32' 
    ? path.join(process.cwd(), 'venv', 'Scripts', 'python.exe')
    : path.join(process.cwd(), 'venv', 'bin', 'python');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { type, id, feedback } = req.body;

        if (!type || !id || !feedback) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate feedback type
        if (!['anomaly', 'insight', 'alert'].includes(type)) {
            return res.status(400).json({ error: 'Invalid feedback type' });
        }

        // Store feedback in database
        const storedFeedback = await prisma.insightFeedback.create({
            data: {
                type,
                insightId: id,
                feedback: JSON.stringify(feedback),
                timestamp: new Date()
            }
        });

        // If it's anomaly feedback, update the anomaly detection model
        if (type === 'anomaly') {
            const pythonProcess = spawn(PYTHON_PATH, [
                path.join(process.cwd(), 'src/scripts/update_anomaly_model.py'),
                JSON.stringify({
                    anomaly_id: id,
                    is_valid: feedback.isValid
                })
            ]);

            let pythonError = '';

            pythonProcess.stderr.on('data', (data) => {
                pythonError += data.toString();
            });

            await new Promise((resolve, reject) => {
                pythonProcess.on('close', (code) => {
                    if (code !== 0) {
                        console.error(`Python process error: ${pythonError}`);
                        // Don't reject, just log the error
                        resolve(null);
                    } else {
                        resolve(null);
                    }
                });
            });
        }

        // Return success response
        return res.status(200).json({
            message: 'Feedback received successfully',
            feedbackId: storedFeedback.id
        });

    } catch (error) {
        console.error('Error processing feedback:', error);
        return res.status(500).json({ error: 'Failed to process feedback' });
    }
} 