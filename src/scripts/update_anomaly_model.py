import sys
import json
import logging
from pathlib import Path

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from ml.services.insights_service import BlockchainInsightsService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    try:
        # Read feedback data from command line argument
        if len(sys.argv) < 2:
            raise ValueError("No feedback data provided")
        
        # Parse feedback data
        feedback_data = json.loads(sys.argv[1])
        anomaly_id = feedback_data.get('anomaly_id')
        is_valid = feedback_data.get('is_valid')
        
        if not anomaly_id or is_valid is None:
            raise ValueError("Invalid feedback data format")
        
        # Initialize insights service
        insights_service = BlockchainInsightsService()
        
        # Log the feedback
        insights_service.log_anomaly_feedback(anomaly_id, is_valid)
        
        # TODO: Implement model updating based on feedback
        # This would involve:
        # 1. Loading historical anomaly data
        # 2. Updating the anomaly detection thresholds
        # 3. Retraining the model if necessary
        
        logger.info(f"Successfully processed feedback for anomaly {anomaly_id}")
        
    except Exception as e:
        logger.error(f"Error updating anomaly model: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 