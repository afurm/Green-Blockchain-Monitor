import sys
import json
import pandas as pd
from datetime import datetime
import logging
from pathlib import Path

# Configure logging to write to a file
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('insights.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from ml.services.insights_service import BlockchainInsightsService
from ml.utils.data_loader import load_model

def main():
    try:
        logger.info("Starting insights generation script")
        
        # Read input data from command line argument
        if len(sys.argv) < 2:
            raise ValueError("No data provided")
        
        logger.info(f"Received data argument: {sys.argv[1][:100]}...")
        
        # Parse input data
        data = json.loads(sys.argv[1])
        df = pd.DataFrame(data)
        
        logger.info(f"Parsed data into DataFrame with {len(df)} rows")
        
        # Convert timestamp strings to datetime
        df['timestamp'] = pd.to_datetime(df['timestamp'])

        # Get user preferences from command line if provided
        user_preferences = None
        learning_goals = None
        if len(sys.argv) > 2:
            try:
                preferences_data = json.loads(sys.argv[2])
                user_preferences = preferences_data.get('preferences')
                learning_goals = preferences_data.get('learningGoals')
                logger.info("Loaded user preferences and learning goals")
            except Exception as e:
                logger.warning(f"Failed to parse user preferences: {e}")
        
        # Initialize insights service with user preferences
        insights_service = BlockchainInsightsService(user_preferences)
        if learning_goals:
            insights_service.set_learning_goals(learning_goals)
        logger.info("Initialized insights service")
        
        # Load the latest trained models
        try:
            energy_model = load_model('energy_usage')
            emissions_model = load_model('emissions')
            logger.info("Loaded ML models")
        except Exception as e:
            logger.warning(f"Failed to load models: {e}")
            energy_model = None
            emissions_model = None
        
        # Generate predictions if models are available
        predictions = pd.DataFrame()
        if energy_model and emissions_model:
            # Prepare features for prediction
            latest_data = df.iloc[0]
            prediction_features = pd.DataFrame({
                'transaction_count': [latest_data['transactionCount']],
                'energy_usage_kwh': [latest_data['energyUsageKwh']],
                'hour': [latest_data['timestamp'].hour],
                'day_of_week': [latest_data['timestamp'].dayofweek],
                'month': [latest_data['timestamp'].month]
            })
            
            # Make predictions
            energy_pred = energy_model.predict(prediction_features)
            emissions_pred = emissions_model.predict(prediction_features)
            
            predictions = pd.DataFrame({
                'energy_usage': energy_pred,
                'emissions': emissions_pred
            })
            logger.info("Generated predictions")
        
        # Detect anomalies
        anomalies_df = insights_service.detect_anomalies(df)
        anomalies = anomalies_df[anomalies_df['is_anomaly']].to_dict('records')
        logger.info(f"Detected {len(anomalies)} anomalies")
        
        # Generate insights
        insights = insights_service.generate_insights(df)
        logger.info(f"Generated {len(insights)} insights")
        
        # Generate alerts
        alerts = insights_service.generate_alerts(df, predictions)
        logger.info(f"Generated {len(alerts)} alerts")
        
        # Prepare response
        response = {
            'insights': insights,
            'alerts': alerts,
            'anomalies': anomalies,
            'timestamp': datetime.now().isoformat()
        }
        
        # Print response as JSON (will be captured by Node.js)
        print(json.dumps(response))
        logger.info("Successfully generated and returned insights")
        
    except Exception as e:
        logger.error(f"Error generating insights: {e}", exc_info=True)
        # Return error response
        error_response = {
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }
        print(json.dumps(error_response))
        sys.exit(1)

if __name__ == "__main__":
    main() 