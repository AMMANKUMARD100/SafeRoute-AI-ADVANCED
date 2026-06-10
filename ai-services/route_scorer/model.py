"""
Route Safety Scorer Model
Uses a pre-trained Random Forest model or fallback to heuristic scoring.
"""

import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

class RouteScorer:
    """
    Route safety scoring model.
    Predicts safety score (0-1) based on multiple factors.
    """
    
    def __init__(self):
        """Initialize the model"""
        self.model = None
        self.load_model()
    
    def load_model(self):
        """Load pre-trained model or create default"""
        model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
        
        if os.path.exists(model_path):
            try:
                self.model = joblib.load(model_path)
                print("✓ Loaded pre-trained model")
            except:
                self.model = None
        
        if self.model is None:
            # Create a simple heuristic model
            self.model = self._create_heuristic_model()
            print("✓ Using heuristic scoring model")
    
    def _create_heuristic_model(self):
        """Create a heuristic scoring model for development"""
        # We'll use a simple Random Forest trained on synthetic data
        n_samples = 1000
        X_train = np.random.randn(n_samples, 8)
        
        # Create synthetic targets based on heuristics
        y_train = []
        for sample in X_train:
            score = self._heuristic_score(sample)
            y_train.append(score)
        
        y_train = np.array(y_train)
        
        # Train model
        model = RandomForestRegressor(n_estimators=10, random_state=42, max_depth=5)
        model.fit(X_train, y_train)
        
        return model
    
    def _heuristic_score(self, features):
        """
        Calculate heuristic safety score.
        Features: [lat, lng, dest_lat, dest_lng, time_encoding, crime_rate, lighting, crowd]
        """
        _, _, _, _, time_encoding, crime_rate, lighting_score, crowd_density = features
        
        # Base score
        score = 0.5
        
        # Crime rate impact (higher crime = lower score)
        score -= crime_rate * 0.4
        
        # Lighting impact (better lighting = higher score)
        score += lighting_score * 0.2
        
        # Crowd impact (more people = safer, but too crowded = risky)
        if crowd_density < 0.3:
            score -= 0.15  # Too sparse = unsafe
        elif crowd_density < 0.7:
            score += 0.1   # Moderate crowd = safer
        else:
            score -= 0.05  # Very crowded = slightly risky
        
        # Time impact (night = riskier)
        score -= time_encoding * 0.25
        
        # Normalize to 0-1
        score = max(0, min(1, score))
        
        return score
    
    def predict(self, features):
        """
        Predict safety score.
        
        Args:
            features: numpy array of shape (1, 8) with:
                [lat, lng, dest_lat, dest_lng, time_encoding, crime_rate, lighting, crowd]
        
        Returns:
            float: Safety score (0-1)
        """
        if self.model is None:
            # Fallback to heuristic
            return self._heuristic_score(features[0])
        
        prediction = self.model.predict(features)[0]
        # Ensure it's in valid range
        prediction = max(0, min(1, prediction))
        
        return prediction
    
    def save_model(self):
        """Save trained model"""
        if self.model is not None:
            model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
            joblib.dump(self.model, model_path)
            print(f"✓ Model saved to {model_path}")
