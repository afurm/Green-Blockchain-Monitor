import { BlockchainDataService } from '../blockchain-data/BlockchainDataService';
import { DataPreprocessor } from '../preprocessing/DataPreprocessor';
import { DATA_COLLECTION_CONFIG } from '../../config/data-collection';

export class DataCollectionScheduler {
  private dataService: BlockchainDataService;
  private preprocessor: DataPreprocessor;
  private dailyJob: NodeJS.Timeout | null = null;

  constructor() {
    this.dataService = new BlockchainDataService();
    this.preprocessor = new DataPreprocessor();
  }

  startDailyCollection() {
    console.log('Starting daily data collection scheduler...');
    
    // Run immediately on start
    this.runDailyCollection();

    // Schedule next runs every 24 hours
    this.dailyJob = setInterval(() => {
      this.runDailyCollection();
    }, DATA_COLLECTION_CONFIG.intervals.batch);
  }

  stop() {
    if (this.dailyJob) {
      clearInterval(this.dailyJob);
      this.dailyJob = null;
    }
    console.log('Data collection scheduler stopped');
  }

  private async runDailyCollection() {
    const startTime = new Date();
    console.log(`Starting daily collection at ${startTime.toISOString()}`);

    try {
      // Collect data for each blockchain
      for (const blockchain of DATA_COLLECTION_CONFIG.blockchains) {
        console.log(`Processing ${blockchain.name}...`);
        await this.dataService.fetchAndStoreBlockchainData(
          blockchain.name,
          blockchain.consensusMechanism
        );
      }

      // Preprocess last 24 hours of data
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);

      for (const blockchain of DATA_COLLECTION_CONFIG.blockchains) {
        console.log(`Preprocessing data for ${blockchain.name}...`);
        await this.preprocessor.preprocessMetrics(1, startDate, endDate, {
          outlierThreshold: DATA_COLLECTION_CONFIG.preprocessing.outlierThreshold,
          normalizationMethod: DATA_COLLECTION_CONFIG.preprocessing.normalizationMethod
        });
      }

      console.log(`Daily collection completed. Duration: ${(new Date().getTime() - startTime.getTime()) / 1000}s`);
    } catch (error) {
      console.error('Error in daily collection:', error);
    }
  }
} 