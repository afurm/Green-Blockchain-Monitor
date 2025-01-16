import os
import glob
import joblib
from typing import Any, Optional
import logging

logger = logging.getLogger(__name__)

def load_model(model_name: str) -> Optional[Any]:
    """Load the latest trained model of the specified type."""
    try:
        # Find all model files for the given name
        model_files = glob.glob(f'models/{model_name}_*.joblib')
        
        if not model_files:
            logger.warning(f"No trained models found for {model_name}")
            return None
        
        # Get the most recent model file
        latest_model_file = max(model_files)
        
        # Load the model
        model_data = joblib.load(latest_model_file)
        
        logger.info(f"Loaded model from {latest_model_file}")
        
        return model_data['model']
        
    except Exception as e:
        logger.error(f"Error loading model {model_name}: {e}")
        return None

def load_model_with_metadata(model_name: str) -> Optional[dict]:
    """Load the latest trained model with its metadata."""
    try:
        # Find all model files for the given name
        model_files = glob.glob(f'models/{model_name}_*.joblib')
        
        if not model_files:
            logger.warning(f"No trained models found for {model_name}")
            return None
        
        # Get the most recent model file
        latest_model_file = max(model_files)
        
        # Load the model and metadata
        model_data = joblib.load(latest_model_file)
        
        logger.info(f"Loaded model and metadata from {latest_model_file}")
        
        return model_data
        
    except Exception as e:
        logger.error(f"Error loading model {model_name}: {e}")
        return None 