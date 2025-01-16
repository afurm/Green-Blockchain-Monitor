export interface BlockchainConfig {
  apiKey?: string;
  apiEndpoint?: string;
  fetchIntervalMs?: number;
}

export interface EnergyMetricData {
  timestamp: Date;
  energyUsageKwh: number;
  transactionCount: number;
  emissionsKgCo2: number;
  source: string;
}

export interface BlockchainData {
  name: string;
  consensusMechanism: string;
  metrics: EnergyMetricData[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface DataFetchResult {
  success: boolean;
  data?: BlockchainData;
  error?: string;
} 