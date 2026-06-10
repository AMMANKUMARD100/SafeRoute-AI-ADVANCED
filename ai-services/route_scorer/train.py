"""
Training script for Route Safety Scorer Model
Generates synthetic training data and trains the model
"""

import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

class RouteDataGenerator:
    """Generate synthetic training data for route safety scoring"""
    
    @staticmethod
    def generate_training_data(n_samples=5000):
        """
        Generate synthetic training data for route safety scoring.
        
        Features:
        - lat, lng: Starting location
        - dest_lat, dest_lng: Destination location
        - time_encoding: Time of day (0.0-1.0)
        - crime_rate: Crime density in area (0.0-1.0)
        - lighting_score: Lighting conditions (0.0-1.0)
        - crowd_density: Expected crowd level (0.0-1.0)
        """
        
        np.random.seed(42)
        
        # Generate features
        X = np.random.randn(n_samples, 8)
        
        # Generate targets based on realistic heuristics
        y = []
        for sample in X:
            lat, lng, dest_lat, dest_lng, time_enc, crime, lighting, crowd = sample
            
            # Normalize features to reasonable ranges
            time_enc = (time_enc + 3) / 6  # 0-1
            crime = (crime + 3) / 6  # 0-1
            lighting = (lighting + 3) / 6  # 0-1
            crowd = (crowd + 3) / 6  # 0-1
            
            # Calculate safety score based on factors
            score = 0.5
            
            # Crime impact (biggest factor)
            score -= crime * 0.4
            
            # Lighting impact
            score += lighting * 0.2
            
            # Crowd impact
            if crowd < 0.3:
                score -= 0.15  # Too sparse
            elif crowd < 0.7:
                score += 0.1   # Moderate crowd
            else:
                score -= 0.05  # Very crowded
            
            # Time impact
            score -= time_enc * 0.25
            
            # Add some noise
            noise = np.random.normal(0, 0.05)
            score += noise
            
            # Normalize to 0-1
            score = max(0, min(1, score))
            y.append(score)
        
        return X, np.array(y)

def train_model():
    """Train the route safety scorer model"""
    
    print("📊 Generating synthetic training data...")
    generator = RouteDataGenerator()
    X, y = generator.generate_training_data(n_samples=5000)
    
    print(f"✓ Generated {len(X)} training samples")
    print(f"  - Features shape: {X.shape}")
    print(f"  - Target range: [{y.min():.3f}, {y.max():.3f}]")
    
    # Scale features
    print("\n📏 Scaling features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train model
    print("\n🤖 Training Random Forest model...")
    model = RandomForestRegressor(
        n_estimators=50,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_scaled, y)
    
    # Evaluate
    train_score = model.score(X_scaled, y)
    print(f"✓ Model trained with R² score: {train_score:.4f}")
    
    # Feature importance
    print("\n📈 Feature Importance:")
    feature_names = ['Latitude', 'Longitude', 'Dest Lat', 'Dest Lng', 
                     'Time', 'Crime Rate', 'Lighting', 'Crowd']
    for name, importance in zip(feature_names, model.feature_importances_):
        print(f"  - {name}: {importance:.4f}")
    
    # Save model
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    print(f"\n💾 Saving model to {model_path}...")
    joblib.dump(model, model_path)
    
    # Save scaler for later use
    scaler_path = os.path.join(os.path.dirname(__file__), 'scaler.pkl')
    joblib.dump(scaler, scaler_path)
    
    print("✅ Model training complete!")
    
    return model

if __name__ == '__main__':
    train_model()
