export const DATA_COLLECTION_CONFIG = {
  // Supported blockchains and their configurations
  blockchains: [
    {
      name: 'ethereum',
      consensusMechanism: 'proof-of-stake',
      apiEndpoint: 'https://api.etherscan.io/api',
      // Energy consumption estimates (kWh per transaction)
      energyPerTx: 0.000002,
    },
    // Add more blockchains here
  ],

  // Data collection intervals (in milliseconds)
  intervals: {
    realTime: 5 * 60 * 1000, // 5 minutes
    batch: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Preprocessing configuration
  preprocessing: {
    outlierThreshold: 3, // Number of standard deviations for outlier detection
    normalizationMethod: 'minmax' as const, // 'minmax' or 'zscore'
    batchSize: 1000, // Number of records to process at once
  },

  // Environmental constants
  environmental: {
    // Global average CO2 emissions per kWh (in kg)
    co2PerKwh: 0.385,
  },
}; 