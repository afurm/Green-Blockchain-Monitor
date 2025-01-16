import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Get insights from the last 24 hours
        const insights = await prisma.insight.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                },
                isArchived: false
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return NextResponse.json({ insights });
    } catch (error) {
        console.error('Error fetching insights:', error);
        return NextResponse.json(
            { error: 'Failed to fetch insights' },
            { status: 500 }
        );
    }
} 