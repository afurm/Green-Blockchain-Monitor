import axios from 'axios';
import { BlockchainData } from '@/services/blockchain-data/BlockchainDataService';

interface BlockchainConfig {
    name: string;
    apiEndpoint: string;
    energyPerTx: number;
}

const BLOCKCHAIN_CONFIGS: Record<string, BlockchainConfig> = {
    Ethereum: {
        name: 'Ethereum',
        apiEndpoint: 'https://api.etherscan.io/api',
        energyPerTx: 200 // kWh per transaction (example value)
    },
    Bitcoin: {
        name: 'Bitcoin',
        apiEndpoint: 'https://api.blockchair.com/bitcoin/stats',
        energyPerTx: 700 // kWh per transaction (example value)
    }
};

const CO2_PER_KWH = 0.5; // kg CO2 per kWh (example value)

export async function fetchBlockchainData(blockchain: string): Promise<BlockchainData> {
    const config = BLOCKCHAIN_CONFIGS[blockchain];
    if (!config) {
        throw new Error(`Unsupported blockchain: ${blockchain}`);
    }

    try {
        let data;
        if (blockchain === 'Ethereum') {
            data = await fetchEthereumData(config);
        } else if (blockchain === 'Bitcoin') {
            data = await fetchBitcoinData(config);
        } else {
            throw new Error(`No data fetcher implemented for ${blockchain}`);
        }

        return data;
    } catch (error) {
        console.error(`Error fetching ${blockchain} data:`, error);
        throw error;
    }
}

async function fetchEthereumData(config: BlockchainConfig): Promise<BlockchainData> {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    if (!etherscanApiKey) {
        throw new Error('ETHERSCAN_API_KEY not configured');
    }

    // Fetch latest block
    const blockResponse = await axios.get(
        `${config.apiEndpoint}?module=proxy&action=eth_getBlockByNumber&tag=latest&boolean=false&apikey=${etherscanApiKey}`
    );

    // Fetch gas price
    const gasPriceResponse = await axios.get(
        `${config.apiEndpoint}?module=proxy&action=eth_gasPrice&apikey=${etherscanApiKey}`
    );

    const block = blockResponse.data.result;
    const transactions = block.transactions.length;
    const blockNumber = parseInt(block.number, 16);
    const gasUsed = parseInt(block.gasUsed, 16);
    const avgGasPrice = parseInt(gasPriceResponse.data.result, 16) / 1e9; // Convert to Gwei

    const energyUsageKwh = transactions * config.energyPerTx;
    const emissionsKgCo2 = energyUsageKwh * CO2_PER_KWH;

    return {
        blockchain: config.name,
        energyUsageKwh,
        emissionsKgCo2,
        transactionCount: transactions,
        blockNumber,
        gasUsed,
        avgGasPrice
    };
}

async function fetchBitcoinData(config: BlockchainConfig): Promise<BlockchainData> {
    const response = await axios.get(config.apiEndpoint);
    const stats = response.data.data;

    const transactions = stats.transactions;
    const blockNumber = stats.blocks;
    const energyUsageKwh = transactions * config.energyPerTx;
    const emissionsKgCo2 = energyUsageKwh * CO2_PER_KWH;

    return {
        blockchain: config.name,
        energyUsageKwh,
        emissionsKgCo2,
        transactionCount: transactions,
        blockNumber,
        gasUsed: 0, // Bitcoin doesn't use gas
        avgGasPrice: 0 // Bitcoin doesn't use gas
    };
} 