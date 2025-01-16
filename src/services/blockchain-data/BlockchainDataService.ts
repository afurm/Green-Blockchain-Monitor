import { PrismaClient } from '@prisma/client';
import { fetchBlockchainData } from '../../lib/blockchain-api';

const prisma = new PrismaClient();

export interface BlockchainData {
    blockchain: string;
    energyUsageKwh: number;
    emissionsKgCo2: number;
    transactionCount: number;
    blockNumber: number;
    gasUsed: number;
    avgGasPrice: number;
}

export class BlockchainDataService {
    private static instance: BlockchainDataService;
    private isCollecting: boolean = false;
    private collectionInterval: NodeJS.Timeout | null = null;

    private constructor() {}

    public static getInstance(): BlockchainDataService {
        if (!BlockchainDataService.instance) {
            BlockchainDataService.instance = new BlockchainDataService();
        }
        return BlockchainDataService.instance;
    }

    public async startCollection(): Promise<void> {
        if (this.isCollecting) {
            throw new Error('Data collection is already running');
        }

        this.isCollecting = true;
        await this.collectData();

        // Set up interval for collecting data every 5 minutes
        this.collectionInterval = setInterval(async () => {
            await this.collectData();
        }, 5 * 60 * 1000);
    }

    public stopCollection(): void {
        if (!this.isCollecting) {
            throw new Error('Data collection is not running');
        }

        if (this.collectionInterval) {
            clearInterval(this.collectionInterval);
            this.collectionInterval = null;
        }
        this.isCollecting = false;
    }

    public async refreshData(): Promise<void> {
        await this.collectData();
    }

    private async collectData(): Promise<void> {
        try {
            // Fetch data from blockchain APIs
            const blockchains = ['Ethereum', 'Bitcoin'];
            const timestamp = new Date();

            for (const blockchain of blockchains) {
                const data = await fetchBlockchainData(blockchain);
                
                // Store the metrics
                await prisma.$queryRaw`
                    INSERT INTO BlockchainMetric (
                        blockchain,
                        energyUsageKwh,
                        emissionsKgCo2,
                        transactionCount,
                        blockNumber,
                        gasUsed,
                        avgGasPrice,
                        timestamp
                    ) VALUES (
                        ${data.blockchain},
                        ${data.energyUsageKwh},
                        ${data.emissionsKgCo2},
                        ${data.transactionCount},
                        ${data.blockNumber},
                        ${data.gasUsed},
                        ${data.avgGasPrice},
                        ${timestamp}
                    )
                `;
            }

            console.log('Data collection completed successfully');
        } catch (error) {
            console.error('Error collecting blockchain data:', error);
            throw error;
        }
    }

    public async getLatestMetrics(blockchain: string): Promise<BlockchainData | null> {
        try {
            const [latestMetric] = await prisma.$queryRaw<BlockchainData[]>`
                SELECT *
                FROM BlockchainMetric
                WHERE blockchain = ${blockchain}
                ORDER BY timestamp DESC
                LIMIT 1
            `;

            if (!latestMetric) return null;

            return latestMetric;
        } catch (error) {
            console.error('Error fetching latest metrics:', error);
            throw error;
        }
    }

    public async getMetricsHistory(
        blockchain: string,
        startTime: Date,
        endTime: Date
    ): Promise<BlockchainData[]> {
        try {
            const metrics = await prisma.$queryRaw<BlockchainData[]>`
                SELECT *
                FROM BlockchainMetric
                WHERE blockchain = ${blockchain}
                AND timestamp >= ${startTime}
                AND timestamp <= ${endTime}
                ORDER BY timestamp ASC
            `;

            return metrics;
        } catch (error) {
            console.error('Error fetching metrics history:', error);
            throw error;
        }
    }
} 