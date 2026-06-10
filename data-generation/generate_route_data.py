#!/usr/bin/env python3
"""
generate_route_data.py – Generate synthetic training data for SafeRoute AI route scoring.

This script creates a dataset of route segments with features:
  - crime_rate        (0 to 1, higher = more dangerous)
  - avg_lighting      (0 to 1, higher = better lit)
  - crowd_density     (0 to 1, higher = more crowded)
  - hour              (0 to 23, departure time)
  - police_nearby     (0 = no station nearby, 1 = station within 200m)
  - safety_score      (0 to 100, target variable)

The safety_score is calculated using a realistic heuristic:
  - Base score = 100
  - Penalty for crime (up to 50 points)
  - Penalty for poor lighting (up to 30 points)
  - Penalty for low crowd density (up to 10 points, because some crowd is good for safety)
  - Bonus for police station (+15)
  - Night penalty between 22:00 and 05:00 (-20)
  - Added Gaussian noise to simulate real-world variance.

Usage:
  python generate_route_data.py [--samples 5000] [--output data/route_data.json]
"""

import argparse
import json
import os
import numpy as np


def generate_samples(num_samples: int = 5000) -> list:
    """
    Generate a list of synthetic route safety records.
    """
    records = []

    for _ in range(num_samples):
        # Feature distributions (mimicking real-world patterns)
        # Crime rate: mostly low, but some high-risk spots
        crime = np.random.beta(2, 8)  # skewed low

        # Lighting: usually decent, but can be very low
        lighting = np.random.beta(5, 2)  # skewed high

        # Crowd density: varied, but often moderate
        crowd = np.random.triangular(0.2, 0.6, 1.0)

        # Hour: uniform over 24 hours
        hour = np.random.randint(0, 24)

        # Police station nearby (about 20% of the time)
        police = np.random.choice([0, 1], p=[0.8, 0.2])

        # ---- Heuristic safety score ----
        score = 100.0
        # Crime penalty (more crime = more penalty)
        score -= crime * 50
        # Lighting penalty (less light = more penalty)
        score -= (1 - lighting) * 30
        # Crowd penalty: extremely low crowd is risky, but also extremely high can be (so we penalise deviation from ideal 0.6)
        # Simpler: low crowd reduces safety (deserted areas)
        if crowd < 0.4:
            score -= (0.4 - crowd) * 25  # up to 10 points

        # Police bonus
        if police == 1:
            score += 15

        # Night penalty
        if 22 <= hour or hour < 5:
            score -= 20

        # Add Gaussian noise (std = 3 points)
        noise = np.random.normal(0, 3)
        score += noise

        # Clamp between 0 and 100
        score = max(0.0, min(100.0, score))

        records.append({
            "crime_rate": round(crime, 4),
            "avg_lighting": round(lighting, 4),
            "crowd_density": round(crowd, 4),
            "hour": hour,
            "police_nearby": police,
            "safety_score": round(score, 2)
        })

    return records


def main():
    parser = argparse.ArgumentParser(
        description="Generate synthetic route safety data for SafeRoute AI"
    )
    parser.add_argument(
        "--samples",
        type=int,
        default=5000,
        help="Number of samples to generate (default: 5000)"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="data/route_data.json",
        help="Output file path (default: data/route_data.json)"
    )
    args = parser.parse_args()

    # Create output directory if it doesn't exist
    output_dir = os.path.dirname(args.output)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)

    print(f"Generating {args.samples} samples...")
    data = generate_samples(args.samples)

    print(f"Writing to {args.output}")
    with open(args.output, "w") as f:
        json.dump(data, f, indent=2)

    print("Done.")


if __name__ == "__main__":
    main()