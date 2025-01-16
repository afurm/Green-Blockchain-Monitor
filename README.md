# Green Blockchain Monitor

An AI-driven monitoring system for analyzing and optimizing blockchain sustainability metrics.

## Features

- Real-time monitoring of blockchain energy consumption and carbon emissions
- AI-powered sustainability predictions and trend analysis
- Recommendations for greener blockchain alternatives
- Dynamic optimization suggestions for improving sustainability
- Beautiful and modern UI built with Next.js and TailwindCSS

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Next.js API routes, Node.js
- **Database**: MySQL
- **Machine Learning**: Python, scikit-learn, pandas
- **Data Collection**: Blockchain APIs (Etherscan, etc.)

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.11 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/green-blockchain-monitor.git
cd green-blockchain-monitor
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Set up Python virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory:
```env
# Database Configuration
DATABASE_URL="mysql://root:@localhost:3306/green_blockchain"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# API Keys (required for data collection)
ETHERSCAN_API_KEY="your_etherscan_api_key"
```

5. Initialize the database:
```bash
npx prisma db push
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Collection and ML Pipeline

### 1. Collecting Blockchain Data

Run the data collection script to fetch blockchain metrics:
```bash
npm run collect-data
```

This script should be run periodically (recommended: once every 24 hours) to gather fresh data.

### 2. Training ML Models

Once you have collected enough data points (minimum 10), train the ML models:
```bash
# Activate Python virtual environment first
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
python src/ml/train.py
```

The training script will:
- Load historical data from the database
- Prepare features and targets
- Train models for energy usage and emissions prediction
- Save the trained models and metrics

### 3. Monitoring Model Performance

Check the training metrics in the `models` directory:
- Model files: `models/{model_name}_{timestamp}.joblib`
- Metrics files: `models/{model_name}_{timestamp}_metrics.json`

## API Documentation

### Endpoints

1. GET `/api/metrics`
   - Returns current blockchain metrics
   - Query parameters:
     - `blockchain`: Blockchain name (e.g., "ethereum")
     - `timeframe`: Data timeframe (e.g., "24h", "7d", "30d")

2. GET `/api/predictions`
   - Returns sustainability predictions
   - Query parameters:
     - `blockchain`: Blockchain name
     - `horizon`: Prediction horizon in hours

3. GET `/api/recommendations`
   - Returns sustainability recommendations
   - Query parameters:
     - `current_blockchain`: Current blockchain name
     - `criteria`: Optimization criteria (e.g., "energy", "emissions", "both")

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run collect-data` - Run data collection
- `npm run test` - Run tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Etherscan API for blockchain data
- Next.js team for the amazing framework
- All contributors who help make this project better 