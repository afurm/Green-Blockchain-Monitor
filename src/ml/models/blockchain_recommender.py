import numpy as np
from sklearn.preprocessing import MinMaxScaler
from typing import List, Dict, Tuple, Any
from .base_model import BlockchainMLModel

class BlockchainRecommender(BlockchainMLModel):
    def __init__(self):
        super().__init__("blockchain_recommender")
        self.feature_weights = {
            'energy_efficiency': 0.4,
            'transaction_speed': 0.2,
            'decentralization': 0.2,
            'sustainability_score': 0.2
        }
        self.build_model()

    def build_model(self) -> None:
        """Initialize the recommendation model"""
        self.feature_scaler = MinMaxScaler()

    def calculate_blockchain_scores(self, blockchains: List[Dict]) -> List[Tuple[str, float, str]]:
        """Calculate sustainability scores for each blockchain"""
        features = []
        for blockchain in blockchains:
            # Extract features
            energy_per_tx = blockchain['energy_usage_kwh'] / max(blockchain['transaction_count'], 1)
            tx_speed = 1 / max(blockchain['block_time'], 0.1)  # Transactions per second
            decentralization = min(blockchain.get('active_validators', 0) / 1000, 1)  # Normalized by 1000 validators
            
            features.append([
                1 - energy_per_tx,  # Lower energy usage is better
                tx_speed,
                decentralization,
                blockchain.get('sustainability_score', 0) / 100  # Normalized to 0-1
            ])

        # Normalize features
        if not features:
            return []

        normalized_features = self.feature_scaler.fit_transform(features)

        # Calculate weighted scores
        scores = []
        for i, blockchain in enumerate(blockchains):
            weighted_score = sum(
                normalized_features[i, j] * weight
                for j, weight in enumerate(self.feature_weights.values())
            )
            
            explanation = self._generate_recommendation_explanation(
                blockchain,
                normalized_features[i],
                list(self.feature_weights.keys())
            )
            
            scores.append((blockchain['name'], weighted_score * 100, explanation))

        # Sort by score in descending order
        return sorted(scores, key=lambda x: x[1], reverse=True)

    def _generate_recommendation_explanation(
        self,
        blockchain: Dict,
        normalized_features: np.ndarray,
        feature_names: List[str]
    ) -> str:
        """Generate explanation for blockchain recommendation"""
        # Find top contributing factors
        contributions = [
            (name, norm_value * self.feature_weights[name])
            for name, norm_value in zip(feature_names, normalized_features)
        ]
        top_factors = sorted(contributions, key=lambda x: x[1], reverse=True)[:2]

        # Generate explanation
        explanation = f"{blockchain['name']} is recommended because:\n"
        
        if blockchain.get('consensus_mechanism') == 'proof-of-stake':
            explanation += "- Uses energy-efficient Proof of Stake consensus\n"
        
        for factor, contribution in top_factors:
            factor_name = factor.replace('_', ' ').title()
            explanation += f"- Strong {factor_name} (contributing {contribution:.1%} to score)\n"
        
        # Add specific metrics
        energy_per_tx = blockchain['energy_usage_kwh'] / max(blockchain['transaction_count'], 1)
        explanation += f"- Energy usage: {energy_per_tx:.6f} kWh per transaction\n"
        
        return explanation

    def update_weights(self, new_weights: Dict[str, float]) -> None:
        """Update feature weights based on user preferences"""
        total = sum(new_weights.values())
        self.feature_weights = {
            k: v / total for k, v in new_weights.items()
        }

    def get_optimization_suggestions(self, blockchain_data: Dict) -> List[Dict[str, Any]]:
        """Generate optimization suggestions based on blockchain data"""
        suggestions = []
        
        # Check transaction batching potential
        avg_block_space = blockchain_data.get('avg_block_space_used', 0)
        if avg_block_space < 0.8:  # Less than 80% block space utilization
            suggestions.append({
                'type': 'batching',
                'title': 'Implement Transaction Batching',
                'description': 'Combine multiple transactions to reduce overall energy usage',
                'potential_saving': f"{(1 - avg_block_space) * 100:.1f}% energy reduction per transaction",
                'priority': 'high' if avg_block_space < 0.5 else 'medium'
            })

        # Check for peak usage optimization
        if blockchain_data.get('peak_hour_usage', False):
            suggestions.append({
                'type': 'timing',
                'title': 'Optimize Transaction Timing',
                'description': 'Schedule non-urgent transactions during off-peak hours',
                'potential_saving': 'Up to 20% energy cost reduction',
                'priority': 'medium'
            })

        # Suggest validator optimization for PoS chains
        if blockchain_data.get('consensus_mechanism') == 'proof-of-stake':
            validator_count = blockchain_data.get('active_validators', 0)
            if validator_count > 1000:  # Example threshold
                suggestions.append({
                    'type': 'validation',
                    'title': 'Optimize Validator Setup',
                    'description': 'Consider reducing validator redundancy while maintaining security',
                    'potential_saving': 'Up to 15% energy reduction',
                    'priority': 'low'
                })

        return suggestions 