import { PrismaClient } from '@prisma/client';

interface PreprocessingConfig {
  outlierThreshold: number;
  normalizationMethod: 'minmax' | 'zscore';
}

export class DataPreprocessor {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async preprocessMetrics(blockchainId: number, startDate: Date, endDate: Date, config: PreprocessingConfig) {
    const startTimestamp = new Date();
    
    try {
      // Log preprocessing start
      await this.logPreprocessing('metrics', config, startTimestamp, null, 'running');

      // Fetch data
      const metrics = await this.prisma.energyMetric.findMany({
        where: {
          blockchainId,
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          timestamp: 'asc',
        },
      });

      // Extract numerical values for processing
      const energyValues = metrics.map(m => m.energyUsageKwh);
      const emissionValues = metrics.map(m => m.emissionsKgCo2);
      const txCountValues = metrics.map(m => m.transactionCount);

      // Remove outliers
      const cleanedEnergy = this.removeOutliers(energyValues, config.outlierThreshold);
      const cleanedEmissions = this.removeOutliers(emissionValues, config.outlierThreshold);
      const cleanedTxCount = this.removeOutliers(txCountValues, config.outlierThreshold);

      // Normalize data
      const normalizedEnergy = this.normalize(cleanedEnergy, config.normalizationMethod);
      const normalizedEmissions = this.normalize(cleanedEmissions, config.normalizationMethod);
      const normalizedTxCount = this.normalize(cleanedTxCount, config.normalizationMethod);

      // Store preprocessed data
      await this.storePreprocessedData(blockchainId, metrics, {
        energy: normalizedEnergy,
        emissions: normalizedEmissions,
        txCount: normalizedTxCount,
      });

      // Log successful completion
      const endTimestamp = new Date();
      await this.logPreprocessing('metrics', config, startTimestamp, endTimestamp, 'completed');

    } catch (error) {
      const endTimestamp = new Date();
      await this.logPreprocessing(
        'metrics',
        config,
        startTimestamp,
        endTimestamp,
        'failed',
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  private removeOutliers(data: number[], threshold: number): number[] {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const stdDev = Math.sqrt(
      data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    );

    return data.filter(val => 
      Math.abs((val - mean) / stdDev) <= threshold
    );
  }

  private normalize(data: number[], method: 'minmax' | 'zscore'): number[] {
    if (method === 'minmax') {
      const min = Math.min(...data);
      const max = Math.max(...data);
      return data.map(val => (val - min) / (max - min));
    } else {
      const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
      const stdDev = Math.sqrt(
        data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
      );
      return data.map(val => (val - mean) / stdDev);
    }
  }

  private async storePreprocessedData(
    blockchainId: number,
    originalMetrics: any[],
    normalizedData: { energy: number[]; emissions: number[]; txCount: number[] }
  ) {
    // Store preprocessed data in RawData table
    await this.prisma.rawData.create({
      data: {
        blockchainId,
        dataType: 'preprocessed_metrics',
        content: {
          originalMetricIds: originalMetrics.map(m => m.id),
          normalizedData,
          timestamp: new Date(),
        },
        timestamp: new Date(),
        source: 'data_preprocessor',
      },
    });
  }

  private async logPreprocessing(
    dataType: string,
    config: PreprocessingConfig,
    startTimestamp: Date,
    endTimestamp: Date | null,
    status: string,
    errorMessage?: string
  ) {
    await this.prisma.preprocessingLog.create({
      data: {
        dataType,
        preprocessingSteps: {
          outlierRemoval: {
            method: 'zscore',
            threshold: config.outlierThreshold,
          },
          normalization: {
            method: config.normalizationMethod,
          },
        },
        startTimestamp,
        endTimestamp,
        status,
        errorMessage,
      },
    });
  }
} 