from abc import ABC, abstractmethod
import numpy as np
from sklearn.base import BaseEstimator
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
from typing import Tuple, Dict, Any
import os

class BlockchainMLModel(ABC, BaseEstimator):
    def __init__(self, model_name: str):
        self.model_name = model_name
        self.model = None
        self.feature_scaler = None
        self.target_scaler = None
        self.feature_columns = None
        self.metrics = {}

    @abstractmethod
    def build_model(self) -> None:
        """Build the specific model architecture"""
        pass

    def preprocess_data(self, X: np.ndarray, y: np.ndarray = None) -> Tuple[np.ndarray, np.ndarray]:
        """Preprocess the data using scalers"""
        if self.feature_scaler and X is not None:
            X = self.feature_scaler.transform(X)
        if self.target_scaler and y is not None:
            y = self.target_scaler.transform(y.reshape(-1, 1)).ravel()
        return X, y if y is not None else None

    def train(self, X: np.ndarray, y: np.ndarray, validation_split: float = 0.2) -> Dict[str, float]:
        """Train the model and return metrics"""
        # Split the data
        X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=validation_split, random_state=42)
        
        # Preprocess
        X_train, y_train = self.preprocess_data(X_train, y_train)
        X_val, y_val = self.preprocess_data(X_val, y_val)

        # Train
        self.model.fit(X_train, y_train)

        # Evaluate
        train_pred = self.model.predict(X_train)
        val_pred = self.model.predict(X_val)

        self.metrics = {
            'train_mse': mean_squared_error(y_train, train_pred),
            'val_mse': mean_squared_error(y_val, val_pred),
            'train_r2': r2_score(y_train, train_pred),
            'val_r2': r2_score(y_val, val_pred)
        }

        return self.metrics

    def predict_with_confidence(self, X: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """Make predictions with confidence intervals"""
        X_processed, _ = self.preprocess_data(X)
        predictions = self.model.predict(X_processed)
        
        # Calculate confidence intervals (example using bootstrap)
        n_bootstraps = 100
        bootstrap_predictions = np.zeros((n_bootstraps, len(predictions)))
        
        for i in range(n_bootstraps):
            # Bootstrap sample indices
            indices = np.random.randint(0, len(X_processed), len(X_processed))
            bootstrap_sample = X_processed[indices]
            bootstrap_predictions[i] = self.model.predict(bootstrap_sample)
        
        confidence_intervals = np.percentile(bootstrap_predictions, [2.5, 97.5], axis=0)
        
        if self.target_scaler:
            predictions = self.target_scaler.inverse_transform(predictions.reshape(-1, 1)).ravel()
            confidence_intervals = self.target_scaler.inverse_transform(confidence_intervals.reshape(-1, 1)).reshape(2, -1)
        
        return predictions, confidence_intervals

    def save(self, path: str) -> None:
        """Save the model and its components"""
        os.makedirs(path, exist_ok=True)
        model_path = os.path.join(path, f"{self.model_name}.joblib")
        metadata = {
            'feature_scaler': self.feature_scaler,
            'target_scaler': self.target_scaler,
            'feature_columns': self.feature_columns,
            'metrics': self.metrics
        }
        joblib.dump({'model': self.model, 'metadata': metadata}, model_path)

    def load(self, path: str) -> None:
        """Load the model and its components"""
        model_path = os.path.join(path, f"{self.model_name}.joblib")
        saved_data = joblib.load(model_path)
        self.model = saved_data['model']
        metadata = saved_data['metadata']
        self.feature_scaler = metadata['feature_scaler']
        self.target_scaler = metadata['target_scaler']
        self.feature_columns = metadata['feature_columns']
        self.metrics = metadata['metrics'] 