#!/usr/bin/env python3
"""
generate_users.py – Generate realistic dummy user profiles for SafeRoute AI.

Features:
  - Works with or without the 'faker' library.
  - Generates Indian-style names, emails, phones.
  - Each user gets 2–4 emergency contacts.
  - Output JSON ready for MongoDB seeding.

Usage:
  python generate_users.py [--count 100] [--output data/users.json]
"""

import argparse
import json
import os
import random

# ----------------------------------------------------------------------
# Attempt to import faker (optional)
# ----------------------------------------------------------------------
try:
    from faker import Faker
    FAKER_AVAILABLE = True
except ImportError:
    FAKER_AVAILABLE = False


# ----------------------------------------------------------------------
# Fallback data pools (used when faker is absent)
# ----------------------------------------------------------------------
FIRST_NAMES_F = [
    "Aaradhya", "Bhavna", "Chitra", "Deepika", "Esha", "Fatima", "Gayatri",
    "Hema", "Isha", "Jaya", "Kavita", "Lakshmi", "Meera", "Neha", "Oviya",
    "Priya", "Qamar", "Riya", "Sneha", "Tara", "Uma", "Vani", "Wafa", "Zara"
]
FIRST_NAMES_M = [
    "Amit", "Bharat", "Chirag", "Deepak", "Eshaan", "Farhan", "Gaurav", "Harsh",
    "Ishan", "Jay", "Karan", "Lalit", "Manish", "Naveen", "Om", "Pranav",
    "Rahul", "Sahil", "Tushar", "Uday", "Vikram", "Yash", "Zubair"
]
LAST_NAMES = [
    "Sharma", "Patel", "Singh", "Kumar", "Verma", "Reddy", "Menon", "Nair",
    "Joshi", "Deshmukh", "Chowdhury", "Sen", "Das", "Mishra", "Iyer", "Naidu"
]
DOMAINS = ["gmail.com", "yahoo.in", "outlook.com", "example.org"]

# Indian mobile prefix (7/8/9) and random suffix
def random_phone():
    prefix = random.choice(["6", "7", "8", "9"])
    suffix = ''.join(random.choices("0123456789", k=9))
    return f"+91{prefix}{suffix}"


# ----------------------------------------------------------------------
# Name / email / phone generators (fallback + faker)
# ----------------------------------------------------------------------
def generate_name(faker=None):
    """Return a full name, using faker if available, else fallback pools."""
    if faker:
        return faker.name()
    # Fallback
    first = random.choice(FIRST_NAMES_F + FIRST_NAMES_M)
    last = random.choice(LAST_NAMES)
    return f"{first} {last}"

def generate_email(name, faker=None):
    """Unique email from name."""
    if faker:
        return faker.email()
    local = name.lower().replace(" ", ".") + str(random.randint(1, 9999))
    return f"{local}@{random.choice(DOMAINS)}"

def generate_phone(faker=None):
    """Indian mobile number."""
    if faker and hasattr(faker, 'phone_number'):
        # Faker's Indian locale often generates landlines; force a mobile-like number
        return f"+91{random.randint(6000000000, 9999999999)}"
    return random_phone()


# ----------------------------------------------------------------------
# Main generation
# ----------------------------------------------------------------------
def generate_users(count: int, faker=None) -> list:
    """Produce a list of user dicts with emergency contacts."""
    users = []
    relationships = ["Mother", "Father", "Brother", "Sister", "Friend", "Spouse", "Cousin"]

    for _ in range(count):
        # Primary user
        name = generate_name(faker)
        email = generate_email(name, faker)
        phone = generate_phone(faker)
        password = "password123"   # plain text – hash before DB insertion

        # Emergency contacts (2–4)
        num_contacts = random.randint(2, 4)
        contacts = []
        for _ in range(num_contacts):
            cname = generate_name(faker)
            cphone = generate_phone(faker)
            cemail = generate_email(cname, faker)
            relationship = random.choice(relationships)
            contacts.append({
                "name": cname,
                "phone": cphone,
                "email": cemail,
                "relationship": relationship
            })

        users.append({
            "name": name,
            "email": email,
            "password": password,
            "phone": phone,
            "emergencyContacts": contacts
        })

    return users


# ----------------------------------------------------------------------
# CLI entry point
# ----------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Generate mock SafeRoute AI user data")
    parser.add_argument("--count", type=int, default=100, help="Number of users (default: 100)")
    parser.add_argument("--output", type=str, default="data/users.json", help="Output file")
    args = parser.parse_args()

    # Ensure output directory exists
    out_dir = os.path.dirname(args.output)
    if out_dir and not os.path.exists(out_dir):
        os.makedirs(out_dir)

    # Initialize faker if available
    faker = None
    if FAKER_AVAILABLE:
        try:
            faker = Faker('en_IN')
            print("✓ Using Faker (Indian locale) for realistic data.")
        except Exception:
            print("⚠ Faker imported but failed to initialise; falling back to basic data.")
    else:
        print("ℹ Faker not installed – using built-in name lists.")
        print("  For more variety, run: pip install faker")

    # Generate and save
    print(f"Generating {args.count} users...")
    users = generate_users(args.count, faker)
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

    print(f"✓ Done – {len(users)} users written to {args.output}")


if __name__ == "__main__":
    main()