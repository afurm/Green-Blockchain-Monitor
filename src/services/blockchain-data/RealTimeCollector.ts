import { BlockchainDataService } from './BlockchainDataService';
import { DATA_COLLECTION_CONFIG } from '../../config/data-collection';

export class RealTimeCollector {
  private dataService: BlockchainDataService;
  private intervals: NodeJS.Timeout[] = [];

  constructor() {
    this.dataService = new BlockchainDataService();
  }

  start() {
    console.log('Starting real-time data collection...');

    // Start collection for each blockchain
    for (const blockchain of DATA_COLLECTION_CONFIG.blockchains) {
      const interval = setInterval(async () => {
        try {
          await this.dataService.fetchAndStoreBlockchainData(
            blockchain.name,
            blockchain.consensusMechanism
          );
          console.log(`Real-time data collected for ${blockchain.name}`);
        } catch (error) {
          console.error(`Error collecting data for ${blockchain.name}:`, error);
        }
      }, DATA_COLLECTION_CONFIG.intervals.realTime);

      this.intervals.push(interval);
    }
  }

  stop() {
    console.log('Stopping real-time data collection...');
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }
} 