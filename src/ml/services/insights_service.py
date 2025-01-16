import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class BlockchainInsightsService:
    def __init__(self, user_preferences=None):
        self.user_preferences = user_preferences or {
            'focusAreas': ['emissions', 'energy', 'transactions'],
            'alertThresholds': {
                'energy': 0,
                'emissions': 0,
                'transactions': 0
            }
        }
        self.learning_goals = None

    def set_learning_goals(self, goals):
        """Update learning goals for personalized insights."""
        self.learning_goals = goals

    def detect_anomalies(self, df: pd.DataFrame) -> pd.DataFrame:
        """Detect anomalies in blockchain metrics using Isolation Forest."""
        try:
            # Prepare features for anomaly detection
            features = ['energyUsageKwh', 'transactionCount', 'emissionsKgCo2']
            X = df[features].values

            # Initialize and fit the isolation forest
            iso_forest = IsolationForest(contamination=0.1, random_state=42)
            anomalies = iso_forest.fit_predict(X)

            # Add anomaly predictions to the dataframe
            df['is_anomaly'] = anomalies == -1

            # Calculate expected ranges for anomalous points
            for feature in features:
                mean = df[feature].mean()
                std = df[feature].std()
                df[f'{feature}_expected_low'] = mean - 2 * std
                df[f'{feature}_expected_high'] = mean + 2 * std

            return df
        except Exception as e:
            logger.error(f"Error detecting anomalies: {e}")
            return df.assign(is_anomaly=False)

    def generate_insights(self, df: pd.DataFrame) -> list:
        """Generate insights based on blockchain data and user preferences."""
        insights = []
        try:
            # Focus on user-selected areas
            focus_areas = self.user_preferences.get('focusAreas', [])

            if 'energy' in focus_areas:
                # Energy usage insights
                avg_energy = df['energyUsageKwh'].mean()
                energy_trend = df['energyUsageKwh'].diff().mean()
                
                if abs(energy_trend) > 0.1:
                    trend_direction = "increasing" if energy_trend > 0 else "decreasing"
                    insights.append({
                        "message": f"Energy usage is {trend_direction} ({abs(energy_trend):.2f} kWh/period)",
                        "type": "energy",
                        "timestamp": datetime.now().isoformat()
                    })

            if 'emissions' in focus_areas:
                # Emissions insights
                avg_emissions = df['emissionsKgCo2'].mean()
                emissions_trend = df['emissionsKgCo2'].diff().mean()
                
                if abs(emissions_trend) > 0.1:
                    trend_direction = "increasing" if emissions_trend > 0 else "decreasing"
                    insights.append({
                        "message": f"CO2 emissions are {trend_direction} ({abs(emissions_trend):.2f} kg/period)",
                        "type": "emissions",
                        "timestamp": datetime.now().isoformat()
                    })

            if 'transactions' in focus_areas:
                # Transaction efficiency insights
                energy_per_tx = df['energyUsageKwh'] / df['transactionCount']
                avg_energy_per_tx = energy_per_tx.mean()
                
                insights.append({
                    "message": f"Average energy usage per transaction: {avg_energy_per_tx:.4f} kWh",
                    "type": "efficiency",
                    "timestamp": datetime.now().isoformat()
                })

            # Add learning goal-based insights
            if self.learning_goals:
                if self.learning_goals.get('energyEfficiency', 0) >= 4:
                    # High priority on energy efficiency
                    peak_usage = df['energyUsageKwh'].max()
                    peak_time = df.loc[df['energyUsageKwh'].idxmax(), 'timestamp']
                    insights.append({
                        "message": f"Peak energy usage of {peak_usage:.2f} kWh detected at {peak_time}",
                        "type": "energy_efficiency",
                        "timestamp": datetime.now().isoformat()
                    })

                if self.learning_goals.get('emissions', 0) >= 4:
                    # High priority on emissions
                    total_emissions = df['emissionsKgCo2'].sum()
                    insights.append({
                        "message": f"Total CO2 emissions for the period: {total_emissions:.2f} kg",
                        "type": "emissions_total",
                        "timestamp": datetime.now().isoformat()
                    })

        except Exception as e:
            logger.error(f"Error generating insights: {e}")

        return insights

    def generate_alerts(self, df: pd.DataFrame, predictions: pd.DataFrame) -> list:
        """Generate alerts based on thresholds and predictions."""
        alerts = []
        try:
            thresholds = self.user_preferences.get('alertThresholds', {})

            # Current metrics
            latest = df.iloc[0]
            
            # Check energy usage threshold
            if thresholds.get('energy', 0) > 0 and latest['energyUsageKwh'] > thresholds['energy']:
                alerts.append({
                    "message": f"Energy usage ({latest['energyUsageKwh']:.2f} kWh) exceeds threshold ({thresholds['energy']} kWh)",
                    "severity": "high",
                    "timestamp": datetime.now().isoformat()
                })

            # Check emissions threshold
            if thresholds.get('emissions', 0) > 0 and latest['emissionsKgCo2'] > thresholds['emissions']:
                alerts.append({
                    "message": f"CO2 emissions ({latest['emissionsKgCo2']:.2f} kg) exceeds threshold ({thresholds['emissions']} kg)",
                    "severity": "high",
                    "timestamp": datetime.now().isoformat()
                })

            # Check transaction threshold
            if thresholds.get('transactions', 0) > 0 and latest['transactionCount'] > thresholds['transactions']:
                alerts.append({
                    "message": f"Transaction count ({latest['transactionCount']}) exceeds threshold ({thresholds['transactions']})",
                    "severity": "medium",
                    "timestamp": datetime.now().isoformat()
                })

            # Add predicted alerts if available
            if not predictions.empty:
                predicted_energy = predictions['energy_usage'].iloc[0]
                predicted_emissions = predictions['emissions'].iloc[0]

                if predicted_energy > thresholds.get('energy', float('inf')):
                    alerts.append({
                        "message": f"Predicted energy usage ({predicted_energy:.2f} kWh) may exceed threshold",
                        "severity": "medium",
                        "timestamp": datetime.now().isoformat()
                    })

                if predicted_emissions > thresholds.get('emissions', float('inf')):
                    alerts.append({
                        "message": f"Predicted CO2 emissions ({predicted_emissions:.2f} kg) may exceed threshold",
                        "severity": "medium",
                        "timestamp": datetime.now().isoformat()
                    })

        except Exception as e:
            logger.error(f"Error generating alerts: {e}")

        return alerts 