import { BlockchainDataService } from '../services/blockchain-data/BlockchainDataService';

async function main() {
    try {
        // Get the singleton instance instead of creating a new one
        const dataService = BlockchainDataService.getInstance();

        // Check if this is a one-time run
        const isOneTime = process.argv.includes('--once');

        if (isOneTime) {
            console.log('Running one-time data collection...');
            await dataService.refreshData();
            console.log('Data collection completed successfully');
        } else {
            console.log('Starting continuous data collection...');
            await dataService.startCollection();
            console.log('Data collection service started');
        }
    } catch (error) {
        console.error('Error in data collection:', error);
        process.exit(1);
    }
}

// Run the script
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 