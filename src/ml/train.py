import os
import mysql.connector
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import json
import logging
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def get_db_connection():
    """Create a connection to the MySQL database."""
    return mysql.connector.connect(
        host="localhost",
        user="root",
        database="green_blockchain"
    )

def load_training_data():
    """Load and prepare training data from the database."""
    logging.info("Loading training data...")
    
    conn = get_db_connection()
    
    # SQL query to fetch training data
    metrics_query = """
    SELECT 
        b.name,
        b.consensusMechanism,
        e.timestamp,
        e.energyUsageKwh,
        e.transactionCount,
        e.emissionsKgCo2,
        r.content as blockchain_data
    FROM EnergyMetric e
    JOIN Blockchain b ON e.blockchainId = b.id
    LEFT JOIN RawData r ON e.blockchainId = r.blockchainId 
        AND DATE(e.timestamp) = DATE(r.timestamp)
        AND r.dataType = 'blockchain_stats'
    ORDER BY e.timestamp DESC
    """
    
    metrics_df = pd.read_sql(metrics_query, conn)
    conn.close()
    
    if metrics_df.empty:
        raise ValueError("No training data available")
    
    # Convert timestamp to datetime if it's not already
    metrics_df['timestamp'] = pd.to_datetime(metrics_df['timestamp'])
    
    # Parse blockchain_data JSON if it exists
    def parse_blockchain_data(data):
        if pd.isna(data):
            return {}
        try:
            return json.loads(data)
        except:
            return {}
    
    metrics_df['blockchain_data'] = metrics_df['blockchain_data'].apply(parse_blockchain_data)
    
    return metrics_df

def prepare_features(data_df):
    """Prepare features for model training."""
    logging.info("Preparing features...")
    
    # Extract features from blockchain_data
    features = pd.DataFrame({
        'transaction_count': data_df['transactionCount'],
        'energy_usage': data_df['energyUsageKwh'],
        'emissions': data_df['emissionsKgCo2'],
        'hour': data_df['timestamp'].dt.hour,
        'day_of_week': data_df['timestamp'].dt.dayofweek,
        'month': data_df['timestamp'].dt.month
    })
    
    # Add consensus mechanism as one-hot encoded feature
    consensus_dummies = pd.get_dummies(data_df['consensusMechanism'], prefix='consensus')
    features = pd.concat([features, consensus_dummies], axis=1)
    
    return features

def train_model(features, target, model_name):
    """Train and evaluate a model."""
    logging.info(f"Training {model_name} model...")
    
    if len(features) < 10:
        logging.warning(f"Insufficient data points ({len(features)}) for training {model_name} model. Need at least 10 data points.")
        return None, None, {'error': 'insufficient_data', 'data_points': len(features)}
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        features, target, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    logging.info(f"{model_name} - MSE: {mse:.4f}, R²: {r2:.4f}")
    
    return model, scaler, {'mse': mse, 'r2': r2}

def save_model(model, scaler, metrics, name):
    """Save the trained model and its metadata."""
    os.makedirs('models', exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    if model is None:
        logging.warning(f"No model to save for {name}. Saving metrics only.")
        # Save metrics only
        metrics_path = f'models/{name}_{timestamp}_metrics.json'
        with open(metrics_path, 'w') as f:
            json.dump(metrics, f)
        logging.info(f"Metrics saved to {metrics_path}")
        return
    
    # Save model
    model_path = f'models/{name}_{timestamp}.joblib'
    joblib.dump({
        'model': model,
        'scaler': scaler,
        'metrics': metrics,
        'timestamp': timestamp
    }, model_path)
    
    logging.info(f"Model saved to {model_path}")

def main():
    try:
        # Load and prepare data
        data = load_training_data()
        features = prepare_features(data)
        
        logging.info(f"Loaded {len(features)} data points")
        
        # Train energy usage model
        energy_model, energy_scaler, energy_metrics = train_model(
            features.drop(['energy_usage', 'emissions'], axis=1),
            features['energy_usage'],
            'energy_usage'
        )
        save_model(energy_model, energy_scaler, energy_metrics, 'energy_usage')
        
        # Train emissions model
        emissions_model, emissions_scaler, emissions_metrics = train_model(
            features.drop(['energy_usage', 'emissions'], axis=1),
            features['emissions'],
            'emissions'
        )
        save_model(emissions_model, emissions_scaler, emissions_metrics, 'emissions')
        
        if energy_model is None and emissions_model is None:
            logging.warning("No models were trained due to insufficient data")
        else:
            logging.info("Training completed successfully")
        
    except Exception as e:
        logging.error(f"Error in training: {str(e)}")
        raise

if __name__ == "__main__":
    main() 