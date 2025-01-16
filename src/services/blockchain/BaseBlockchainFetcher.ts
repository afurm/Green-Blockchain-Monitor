import { BlockchainConfig, BlockchainData, ValidationResult, DataFetchResult } from './types';
import { PrismaClient } from '@prisma/client';

export abstract class BaseBlockchainFetcher {
  protected config: BlockchainConfig;
  protected prisma: PrismaClient;

  constructor(config: BlockchainConfig) {
    this.config = config;
    this.prisma = new PrismaClient();
  }

  abstract fetchData(): Promise<DataFetchResult>;

  protected validateData(data: BlockchainData): ValidationResult {
    const errors: string[] = [];

    // Validate blockchain info
    if (!data.name) errors.push('Blockchain name is required');
    if (!data.consensusMechanism) errors.push('Consensus mechanism is required');

    // Validate metrics
    if (!Array.isArray(data.metrics)) {
      errors.push('Metrics must be an array');
    } else {
      data.metrics.forEach((metric, index) => {
        if (!metric.timestamp) errors.push(`Metric ${index}: timestamp is required`);
        if (typeof metric.energyUsageKwh !== 'number') errors.push(`Metric ${index}: energyUsageKwh must be a number`);
        if (typeof metric.transactionCount !== 'number') errors.push(`Metric ${index}: transactionCount must be a number`);
        if (typeof metric.emissionsKgCo2 !== 'number') errors.push(`Metric ${index}: emissionsKgCo2 must be a number`);
        if (!metric.source) errors.push(`Metric ${index}: source is required`);
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async storeData(data: BlockchainData): Promise<void> {
    try {
      // Create or update blockchain
      const blockchain = await this.prisma.blockchain.upsert({
        where: { name: data.name },
        create: {
          name: data.name,
          consensusMechanism: data.consensusMechanism,
        },
        update: {
          consensusMechanism: data.consensusMechanism,
        },
      });

      // Store metrics
      await this.prisma.energyMetric.createMany({
        data: data.metrics.map(metric => ({
          blockchainId: blockchain.id,
          timestamp: metric.timestamp,
          energyUsageKwh: metric.energyUsageKwh,
          transactionCount: metric.transactionCount,
          emissionsKgCo2: metric.emissionsKgCo2,
          source: metric.source,
        })),
        skipDuplicates: true,
      });
    } catch (error) {
      console.error('Error storing blockchain data:', error);
      throw error;
    }
  }

  async fetchAndStore(): Promise<void> {
    try {
      const result = await this.fetchData();
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch blockchain data');
      }

      const validation = this.validateData(result.data);
      if (!validation.isValid) {
        throw new Error(`Invalid data: ${validation.errors.join(', ')}`);
      }

      await this.storeData(result.data);
    } catch (error) {
      console.error('Error in fetch and store process:', error);
      throw error;
    }
  }
} 