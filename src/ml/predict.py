import os
from typing import Dict, List, Any
import pandas as pd
from datetime import datetime

from models.sustainability_predictor import SustainabilityPredictor
from models.blockchain_recommender import BlockchainRecommender

class BlockchainAIAgent:
    def __init__(self):
        self.predictor = SustainabilityPredictor()
        self.recommender = BlockchainRecommender()
        
        # Load trained models
        self.predictor.load('models')
        self.recommender.load('models')

    def predict_sustainability(self, blockchain_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict future sustainability metrics for a blockchain"""
        # Prepare features
        features = self.predictor.prepare_features(blockchain_data)
        
        # Make prediction with confidence intervals
        prediction, confidence_intervals = self.predictor.predict_with_confidence(features)
        
        # Generate explanation
        explanation = self.predictor.explain_prediction(
            features,
            prediction[0],
            confidence_intervals[:, 0]
        )
        
        return {
            'energy_usage_prediction': prediction[0],
            'confidence_interval': {
                'lower': confidence_intervals[0, 0],
                'upper': confidence_intervals[1, 0]
            },
            'explanation': explanation
        }

    def get_blockchain_recommendations(
        self,
        blockchains: List[Dict[str, Any]],
        preferences: Dict[str, float] = None
    ) -> List[Dict[str, Any]]:
        """Get blockchain recommendations based on sustainability and user preferences"""
        # Update recommender weights if preferences provided
        if preferences:
            self.recommender.update_weights(preferences)
        
        # Get recommendations with explanations
        recommendations = self.recommender.calculate_blockchain_scores(blockchains)
        
        return [
            {
                'blockchain': name,
                'sustainability_score': score,
                'explanation': explanation
            }
            for name, score, explanation in recommendations
        ]

    def get_optimization_suggestions(self, blockchain_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get optimization suggestions for a blockchain"""
        return self.recommender.get_optimization_suggestions(blockchain_data)

def main():
    # Example usage
    agent = BlockchainAIAgent()
    
    # Example blockchain data
    example_data = {
        'name': 'ethereum',
        'consensus_mechanism': 'proof-of-stake',
        'timestamp': datetime.now(),
        'transaction_count': 1000000,
        'block_time': 12,
        'active_validators': 500000,
        'network_usage': 0.75,
        'energy_usage_kwh': 2.5,
        'avg_block_space_used': 0.6,
        'peak_hour_usage': True
    }
    
    # Get sustainability prediction
    print("\nSustainability Prediction:")
    prediction = agent.predict_sustainability(example_data)
    print(prediction['explanation'])
    
    # Get blockchain recommendations
    example_blockchains = [
        example_data,
        {
            'name': 'solana',
            'consensus_mechanism': 'proof-of-stake',
            'timestamp': datetime.now(),
            'transaction_count': 2000000,
            'block_time': 0.4,
            'active_validators': 1000,
            'network_usage': 0.85,
            'energy_usage_kwh': 1.8
        }
    ]
    
    print("\nBlockchain Recommendations:")
    recommendations = agent.get_blockchain_recommendations(
        example_blockchains,
        preferences={
            'energy_efficiency': 0.5,
            'transaction_speed': 0.2,
            'decentralization': 0.2,
            'sustainability_score': 0.1
        }
    )
    for rec in recommendations:
        print(f"\n{rec['blockchain']} (Score: {rec['sustainability_score']:.2f})")
        print(rec['explanation'])
    
    # Get optimization suggestions
    print("\nOptimization Suggestions:")
    suggestions = agent.get_optimization_suggestions(example_data)
    for suggestion in suggestions:
        print(f"\n{suggestion['title']} (Priority: {suggestion['priority']})")
        print(f"Description: {suggestion['description']}")
        print(f"Potential Saving: {suggestion['potential_saving']}")

if __name__ == "__main__":
    main() 