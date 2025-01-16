import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from typing import List, Dict, Any
from .base_model import BlockchainMLModel

class SustainabilityPredictor(BlockchainMLModel):
    def __init__(self):
        super().__init__("sustainability_predictor")
        self.feature_columns = [
            'transaction_count',
            'block_time',
            'active_validators',
            'network_usage',
            'hour_of_day',
            'day_of_week',
            'is_pos'  # Proof of Stake flag
        ]
        self.target_columns = [
            'energy_usage_kwh',
            'emissions_kg_co2'
        ]
        self.build_model()

    def build_model(self) -> None:
        """Build the GradientBoostingRegressor model"""
        self.model = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        self.feature_scaler = StandardScaler()
        self.target_scaler = StandardScaler()

    def prepare_features(self, data: Dict[str, Any]) -> np.ndarray:
        """Prepare features from raw data"""
        # Extract timestamp features
        timestamp = np.datetime64(data['timestamp'])
        hour_of_day = timestamp.astype('datetime64[h]').astype(int) % 24
        day_of_week = timestamp.astype('datetime64[D]').astype(int) % 7

        # Create feature array
        features = np.array([
            data.get('transaction_count', 0),
            data.get('block_time', 0),
            data.get('active_validators', 0),
            data.get('network_usage', 0),
            hour_of_day,
            day_of_week,
            1 if data.get('consensus_mechanism') == 'proof-of-stake' else 0
        ]).reshape(1, -1)

        return features

    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance scores"""
        if self.model is None:
            raise ValueError("Model not trained yet")
        
        importance_scores = self.model.feature_importances_
        return dict(zip(self.feature_columns, importance_scores))

    def explain_prediction(self, features: np.ndarray, prediction: float, confidence_interval: np.ndarray) -> str:
        """Generate human-readable explanation for prediction"""
        feature_importance = self.get_feature_importance()
        top_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:3]
        
        explanation = f"Predicted energy usage: {prediction:.2f} kWh\n"
        explanation += f"Confidence interval: [{confidence_interval[0]:.2f}, {confidence_interval[1]:.2f}] kWh\n\n"
        explanation += "Key factors:\n"
        
        for feature, importance in top_features:
            explanation += f"- {feature.replace('_', ' ').title()}: {importance:.2%} importance\n"
        
        return explanation

    def get_sustainability_score(self, energy_usage: float, transaction_count: int) -> float:
        """Calculate sustainability score (0-100)"""
        # Example scoring logic
        energy_per_tx = energy_usage / max(transaction_count, 1)
        
        # Lower energy per transaction is better
        # Using a logarithmic scale to handle wide range of values
        base_score = 100 * (1 - np.log1p(energy_per_tx) / np.log1p(0.001))  # 0.001 kWh/tx as reference
        
        return max(0, min(100, base_score))  # Clamp between 0 and 100 