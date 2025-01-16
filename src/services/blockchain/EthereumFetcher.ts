import { BaseBlockchainFetcher } from './BaseBlockchainFetcher';
import { BlockchainConfig, DataFetchResult } from './types';
import axios from 'axios';

export class EthereumFetcher extends BaseBlockchainFetcher {
  constructor(config: BlockchainConfig) {
    super({
      apiKey: config.apiKey || process.env.ETHERSCAN_API_KEY,
      apiEndpoint: config.apiEndpoint || 'https://api.etherscan.io/api',
      fetchIntervalMs: config.fetchIntervalMs || 60000, // Default to 1 minute
    });
  }

  async fetchData(): Promise<DataFetchResult> {
    try {
      // Fetch transaction count
      const txCountResponse = await axios.get(`${this.config.apiEndpoint}`, {
        params: {
          module: 'proxy',
          action: 'eth_blockNumber',
          apikey: this.config.apiKey,
        },
      });

      // Convert block number to decimal and get approximate transaction count
      const blockNumber = parseInt(txCountResponse.data.result, 16);
      const avgTxPerBlock = 100; // Average transactions per block
      const estimatedTxCount = blockNumber * avgTxPerBlock;

      // Calculate energy usage based on network hash rate
      // Note: This is a simplified calculation for demonstration
      const energyPerTx = 200; // kWh per transaction (simplified estimate)
      const totalEnergyKwh = estimatedTxCount * energyPerTx;

      // Calculate emissions (simplified)
      const kgCo2PerKwh = 0.475; // Global average CO2 emissions per kWh
      const totalEmissions = totalEnergyKwh * kgCo2PerKwh;

      return {
        success: true,
        data: {
          name: 'Ethereum',
          consensusMechanism: 'Proof of Work',
          metrics: [{
            timestamp: new Date(),
            energyUsageKwh: totalEnergyKwh,
            transactionCount: estimatedTxCount,
            emissionsKgCo2: totalEmissions,
            source: 'etherscan-api',
          }],
        },
      };
    } catch (error) {
      console.error('Error fetching Ethereum data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
} 