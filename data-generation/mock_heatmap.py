#!/usr/bin/env python3
"""
mock_heatmap.py – Generate realistic safety heatmap data for SafeRoute AI.

Creates a grid of geographical points over a city (default: Mumbai) with
synthetic safety scores that reflect realistic patterns:
  - Higher crime near certain zones (simulated slums/dark areas).
  - Better lighting along main roads.
  - Crowd density variance (markets vs residential).
  - Emergency services accessibility.
  - Overall safety score derived from these features.

Data can be written to MongoDB or exported as JSON.

Usage:
  python mock_heatmap.py
  python mock_heatmap.py --city delhi
  python mock_heatmap.py --output data/heatmap.json --format json
  python mock_heatmap.py --count 1000 --mongo mongodb://localhost:27017/saferoute

Environment variables (optional):
  MONGODB_URI   – default MongoDB connection string
"""

import argparse
import json
import os
import random
import sys

try:
    from pymongo import MongoClient, errors, GEOSPHERE
    PYMONGO_AVAILABLE = True
except ImportError:
    PYMONGO_AVAILABLE = False


# ======================================================================
# City bounding boxes (south-west, north-east)
# ======================================================================
CITY_BOUNDS = {
    "mumbai": {
        "sw": [19.0, 72.8],
        "ne": [19.2, 73.0],
        "high_risk_zones": [
            # Simulated dangerous pockets (lat, lng, radius_km)
            (19.06, 72.87, 0.8),   # Dharavi-like area
            (19.08, 72.89, 0.5),
            (19.04, 72.86, 0.6),
        ]
    },
    "delhi": {
        "sw": [28.4, 77.0],
        "ne": [28.8, 77.4],
        "high_risk_zones": [
            (28.6, 77.2, 1.0),
            (28.55, 77.15, 0.7),
        ]
    },
    "bangalore": {
        "sw": [12.8, 77.4],
        "ne": [13.1, 77.8],
        "high_risk_zones": [
            (12.95, 77.6, 0.6),
            (12.92, 77.58, 0.4),
        ]
    }
}

DEFAULT_CITY = "mumbai"
DEFAULT_COUNT = 500
DEFAULT_OUTPUT = "data/heatmap.json"


def haversine_km(lat1, lon1, lat2, lon2):
    """Rough distance in km between two lat/lon points."""
    from math import radians, cos, sin, sqrt, atan2
    R = 6371.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    return R * 2 * atan2(sqrt(a), sqrt(1-a))


def generate_heatmap_points(city, count):
    """Generate list of point documents with safety scores."""
    bounds = CITY_BOUNDS.get(city.lower(), CITY_BOUNDS[DEFAULT_CITY])
    sw = bounds["sw"]
    ne = bounds["ne"]
    high_risk = bounds["high_risk_zones"]

    points = []
    for _ in range(count):
        lat = random.uniform(sw[0], ne[0])
        lng = random.uniform(sw[1], ne[1])

        # Distance to nearest high-risk zone (0 = inside, else distance in km)
        min_dist = min(
            haversine_km(lat, lng, zone[0], zone[1])
            for zone in high_risk
        )

        # Normalised risk factor: 1 at zone centre, decays linearly to 0 at radius
        risk_factor = 0.0
        for zone in high_risk:
            dist = haversine_km(lat, lng, zone[0], zone[1])
            radius = zone[2]
            if dist <= radius:
                risk_factor = max(risk_factor, 1 - (dist / radius))

        # Base crime score (0-100) influenced by risk factor
        base_crime = random.uniform(10, 30) + risk_factor * random.uniform(40, 70)
        crime = min(100, max(0, base_crime))

        # Lighting score: inversely correlated with crime, but not too extreme
        lighting = 100 - (crime * 0.3) + random.uniform(-10, 10)
        lighting = max(20, min(100, lighting))

        # Crowd density: correlated with risk (dangerous areas may be deserted or overcrowded)
        # We'll just randomise with some dependency
        crowd = 50 + random.uniform(-20, 30) - (risk_factor * 10)
        crowd = max(10, min(100, crowd))

        # Emergency access: nearby hospitals/police – inversely related to risk factor
        emergency = 80 - (risk_factor * 50) + random.uniform(-10, 10)
        emergency = max(10, min(100, emergency))

        # Overall score: weighted combination
        overall = (
            (100 - crime) * 0.5 +
            lighting * 0.2 +
            crowd * 0.15 +
            emergency * 0.15
        )
        overall = max(0, min(100, round(overall, 2)))

        point = {
            "location": {
                "type": "Point",
                "coordinates": [lng, lat]   # GeoJSON [longitude, latitude]
            },
            "gridId": f"{lat:.3f}_{lng:.3f}",
            "overallScore": round(overall),
            "crimeScore": round(crime),
            "lightingScore": round(lighting),
            "crowdScore": round(crowd),
            "emergencyAccessScore": round(emergency),
            "updatedAt": "2026-06-09T12:00:00Z"
        }
        points.append(point)

    return points


def insert_into_mongodb(points, uri, db_name="saferoute", coll_name="safetyscores"):
    """Insert points into MongoDB, create 2dsphere index if missing."""
    if not PYMONGO_AVAILABLE:
        raise RuntimeError("pymongo not installed. Run: pip install pymongo")

    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    # Test connection
    try:
        client.admin.command('ping')
    except errors.ConnectionFailure as e:
        raise ConnectionError(f"Could not connect to MongoDB: {e}")

    db = client[db_name]
    coll = db[coll_name]

    # Ensure 2dsphere index
    try:
        coll.create_index([("location", GEOSPHERE)])
    except Exception as e:
        print(f"Warning: could not create index: {e}")

    # Insert in batches (avoid huge payload)
    batch_size = 100
    for i in range(0, len(points), batch_size):
        batch = points[i:i+batch_size]
        coll.insert_many(batch)

    print(f"Inserted {len(points)} documents into MongoDB collection '{coll_name}'")


def main():
    parser = argparse.ArgumentParser(description="Generate mock heatmap data for SafeRoute AI")
    parser.add_argument("--city", type=str, default=DEFAULT_CITY,
                        help=f"City name (available: {', '.join(CITY_BOUNDS.keys())})")
    parser.add_argument("--count", type=int, default=DEFAULT_COUNT,
                        help="Number of grid points (default: 500)")
    parser.add_argument("--output", type=str, default=DEFAULT_OUTPUT,
                        help="Output JSON file (default: data/heatmap.json)")
    parser.add_argument("--format", choices=["json", "mongo"], default="json",
                        help="Output format: json (file) or mongo (database)")
    parser.add_argument("--mongo", type=str, default=os.getenv("MONGODB_URI", "mongodb://localhost:27017"),
                        help="MongoDB connection string (only for --format mongo)")
    args = parser.parse_args()

    print(f"Generating {args.count} heatmap points for {args.city.title()}...")
    points = generate_heatmap_points(args.city, args.count)

    if args.format == "json":
        out_dir = os.path.dirname(args.output)
        if out_dir and not os.path.exists(out_dir):
            os.makedirs(out_dir)
        with open(args.output, "w") as f:
            json.dump(points, f, indent=2)
        print(f"Written {len(points)} points to {args.output}")

    elif args.format == "mongo":
        if not PYMONGO_AVAILABLE:
            print("Error: pymongo is not installed. Please install it (pip install pymongo) or use --format json.")
            sys.exit(1)
        try:
            insert_into_mongodb(points, args.mongo)
        except Exception as e:
            print(f"Failed to insert into MongoDB: {e}")
            sys.exit(1)


if __name__ == "__main__":
    main()