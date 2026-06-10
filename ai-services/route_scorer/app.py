"""
Route Scorer AI Microservice
Predicts route safety score based on multiple factors:
- Crime density
- Lighting conditions
- Crowd density
- Traffic conditions
- Time of day
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from model import RouteScorer
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load pre-trained model
route_scorer = RouteScorer()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'route-scorer'}), 200

@app.route('/score-route', methods=['POST'])
def score_route():
    """
    Score a route based on multiple safety factors.
    
    Request body:
    {
        "source": {"lat": 28.6139, "lng": 77.2090},
        "destination": {"lat": 28.5355, "lng": 77.3910},
        "time_of_day": "night",  # morning, afternoon, evening, night
        "crime_rate": 0.7,        # 0-1 scale
        "lighting_score": 0.6,    # 0-1 scale (0 = dark, 1 = well-lit)
        "crowd_density": 0.4,     # 0-1 scale (0 = sparse, 1 = crowded)
        "user_profile": "woman"   # woman, man, etc.
    }
    """
    try:
        data = request.get_json()
        
        # Validate input
        if not all(k in data for k in ['source', 'destination', 'time_of_day']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Extract features
        source = data['source']
        destination = data['destination']
        time_of_day = data['time_of_day']
        crime_rate = data.get('crime_rate', 0.5)
        lighting_score = data.get('lighting_score', 0.5)
        crowd_density = data.get('crowd_density', 0.5)
        
        # Create feature vector
        features = np.array([[
            source['lat'],
            source['lng'],
            destination['lat'],
            destination['lng'],
            encode_time_of_day(time_of_day),
            crime_rate,
            lighting_score,
            crowd_density
        ]])
        
        # Get prediction
        safety_score = route_scorer.predict(features)
        
        # Generate recommendation
        if safety_score >= 0.8:
            recommendation = "Very Safe - Take this route"
            color = "green"
        elif safety_score >= 0.6:
            recommendation = "Safe - Recommended route"
            color = "yellow"
        elif safety_score >= 0.4:
            recommendation = "Moderate Risk - Use with caution"
            color = "orange"
        else:
            recommendation = "High Risk - Avoid if possible"
            color = "red"
        
        logger.info(f"Route scored: {safety_score:.2f}")
        
        return jsonify({
            'safety_score': float(safety_score),
            'recommendation': recommendation,
            'color': color,
            'factors': {
                'crime_rate': crime_rate,
                'lighting_score': lighting_score,
                'crowd_density': crowd_density,
                'time_of_day': time_of_day
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error scoring route: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/compare-routes', methods=['POST'])
def compare_routes():
    """
    Compare multiple routes and return ranked by safety.
    
    Request body:
    {
        "routes": [
            {"source": {...}, "destination": {...}, ...},
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        routes = data.get('routes', [])
        
        if not routes:
            return jsonify({'error': 'No routes provided'}), 400
        
        scored_routes = []
        for route in routes:
            features = np.array([[
                route['source']['lat'],
                route['source']['lng'],
                route['destination']['lat'],
                route['destination']['lng'],
                encode_time_of_day(route.get('time_of_day', 'day')),
                route.get('crime_rate', 0.5),
                route.get('lighting_score', 0.5),
                route.get('crowd_density', 0.5)
            ]])
            score = route_scorer.predict(features)
            scored_routes.append({
                'route': route,
                'score': float(score)
            })
        
        # Sort by safety score (descending)
        scored_routes.sort(key=lambda x: x['score'], reverse=True)
        
        return jsonify({
            'routes': scored_routes,
            'best_route': scored_routes[0] if scored_routes else None
        }), 200
        
    except Exception as e:
        logger.error(f"Error comparing routes: {str(e)}")
        return jsonify({'error': str(e)}), 500

def encode_time_of_day(time_str):
    """Encode time of day to numerical value"""
    time_map = {
        'morning': 0.3,    # 6am-12pm (generally safer)
        'afternoon': 0.5,  # 12pm-6pm
        'evening': 0.7,    # 6pm-9pm (higher risk)
        'night': 0.9       # 9pm-6am (highest risk)
    }
    return time_map.get(time_str.lower(), 0.5)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
