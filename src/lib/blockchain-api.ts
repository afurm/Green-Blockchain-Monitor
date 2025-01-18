export interface BlockchainMetrics {
    network: 'ethereum' | 'bitcoin' | 'solana';
    energyUsageKwh: number;
    emissionsKgCo2: number;
    waterUsageLiters: number;
    eWasteKg: number;
}

async function fetchEthereumData(): Promise<BlockchainMetrics> {
    try {
        // Fetch from Etherscan API
        const response = await fetch(`https://api.etherscan.io/api?module=stats&action=dailygaslimit&apikey=${process.env.ETHERSCAN_API_KEY}`);
        const data = await response.json();
        
        // Calculate metrics based on gas usage
        const gasUsage = parseInt(data.result);
        const energyPerGas = 20; // kWh per million gas
        const energyUsageKwh = gasUsage * energyPerGas;
        
        return {
            network: 'ethereum',
            energyUsageKwh,
            emissionsKgCo2: energyUsageKwh * 0.48, // CO2 emissions factor
            waterUsageLiters: energyUsageKwh * 2.0, // Water usage factor
            eWasteKg: energyUsageKwh * 0.00035 // E-waste factor
        };
    } catch (error) {
        console.error('Error fetching Ethereum data:', error);
        return getMockData()[0];
    }
}

async function fetchBitcoinData(): Promise<BlockchainMetrics> {
    try {
        // Fetch from Blockchain.info API
        const response = await fetch('https://api.blockchain.info/stats');
        const data = await response.json();
        
        // Calculate metrics based on hash rate
        const hashRate = data.hash_rate;
        const energyPerHash = 0.1; // kWh per TH/s
        const energyUsageKwh = hashRate * energyPerHash;
        
        return {
            network: 'bitcoin',
            energyUsageKwh,
            emissionsKgCo2: energyUsageKwh * 0.50, // CO2 emissions factor
            waterUsageLiters: energyUsageKwh * 0.7, // Water usage factor
            eWasteKg: energyUsageKwh * 0.0002 // E-waste factor
        };
    } catch (error) {
        console.error('Error fetching Bitcoin data:', error);
        return getMockData()[1];
    }
}

async function fetchSolanaData(): Promise<BlockchainMetrics> {
    try {
        // Fetch from public Solana RPC
        const response = await fetch('https://api.mainnet-beta.solana.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getRecentPerformanceSamples",
                "params": [1]
            })
        });
        const data = await response.json();
        
        // Calculate metrics based on TPS
        const tps = data.result[0].numTransactions / data.result[0].samplePeriodSecs;
        const energyPerTx = 0.0001; // kWh per transaction
        const energyUsageKwh = tps * energyPerTx * 3600 * 24; // Daily energy usage
        
        return {
            network: 'solana',
            energyUsageKwh,
            emissionsKgCo2: energyUsageKwh * 0.45, // CO2 emissions factor
            waterUsageLiters: energyUsageKwh * 3.0, // Water usage factor
            eWasteKg: energyUsageKwh * 0.0003 // E-waste factor
        };
    } catch (error) {
        console.error('Error fetching Solana data:', error);
        return getMockData()[2];
    }
}

export async function fetchBlockchainData(): Promise<BlockchainMetrics[]> {
    try {
        const [ethereumData, bitcoinData, solanaData] = await Promise.all([
            fetchEthereumData(),
            fetchBitcoinData(),
            fetchSolanaData()
        ]);

        return [ethereumData, bitcoinData, solanaData];
    } catch (error) {
        console.error('Error fetching blockchain data:', error);
        return getMockData();
    }
}

function getMockData(): BlockchainMetrics[] {
    return [
        {
            network: 'ethereum',
            energyUsageKwh: 23000000000,
            emissionsKgCo2: 11000000000,
            waterUsageLiters: 45000000000,
            eWasteKg: 8000000
        },
        {
            network: 'bitcoin',
            energyUsageKwh: 107000000000,
            emissionsKgCo2: 54000000000,
            waterUsageLiters: 75000000000,
            eWasteKg: 22000000
        },
        {
            network: 'solana',
            energyUsageKwh: 3800000000,
            emissionsKgCo2: 1900000000,
            waterUsageLiters: 12000000000,
            eWasteKg: 1200000
        }
    ];
} 