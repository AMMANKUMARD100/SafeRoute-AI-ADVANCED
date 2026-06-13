# 🛡️ SafeRoute AI – Complete Setup Guide

## Quick Setup (5 minutes)

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- MongoDB (local or Atlas)
- Git

### Step 1: Clone & Navigate
```bash
git clone https://github.com/yourusername/SafeRoute-AI.git
cd SafeRoute-AI
```

### Step 2: Install Dependencies
```bash
# Backend
cd server && npm install && cd ..

# Frontend
cd client && npm install && cd ..

# AI Services
cd ai-services
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
cd ..
```

### Step 3: Configure Environment
```bash
# Copy environment templates
cp .env.example .env
cp server/.env server/.env.local
cp client/.env client/.env.local

# Edit .env files with your credentials
# See DEPLOYMENT_GUIDE.md for details
```

### Step 4: Start Services
Open 5 terminals and run:

**Terminal 1: MongoDB**
```bash
mongod
# Or use MongoDB Atlas (no local setup needed)
```

**Terminal 2: Backend Server**
```bash
cd server
npm run dev
```

**Terminal 3: Frontend**
```bash
cd client
npm start
```

**Terminal 4: Route Scorer AI**
```bash
cd ai-services/route_scorer
python app.py
```

**Terminal 5: Voice Distress Detector AI**
```bash
cd ai-services/voice_stress
python app.py
```

✅ Navigate to `http://localhost:3000` and you're ready!

---

## Detailed Setup Guide

### 1. Database Configuration

#### Option A: MongoDB Atlas (Recommended for Production)
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a cluster
4. Add a database user with password
5. Whitelist your IP
6. Copy connection string
7. Paste into MONGODB_URI in server/.env
```

#### Option B: Local MongoDB
```bash
# Windows (using chocolatey)
choco install mongodb

# macOS (using brew)
brew tap mongodb/brew
brew install mongodb-community

# Linux (Ubuntu)
sudo apt-get install -y mongodb

# Start service
mongod
```

### 2. API Keys & Credentials

#### Map & Routing APIs (OpenRouteService, Geoapify, OpenWeather)
1. OpenRouteService (Routing): https://openrouteservice.org/
   - Create an account and generate an API key
   - Add to `ORS_API_KEY` in server/.env
2. Geoapify (Geocoding / Places): https://www.geoapify.com/
   - Create an account and generate an API key
   - Add to `GEOAPIFY_API_KEY` and `REACT_APP_GEOAPIFY_API_KEY` for the client
3. OpenWeather (Weather / Heat Index): https://openweathermap.org/
   - Create an account and generate an API key
   - Add to `OPENWEATHER_API_KEY` and `REACT_APP_OPENWEATHER_API_KEY` for the client

#### Twilio (SMS Notifications)
1. Sign up: https://www.twilio.com/
2. Verify phone number
3. Get SID and Auth Token
4. Get a Twilio phone number
5. Add to .env:
   ```
   TWILIO_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE=+1234567890
   ```

#### SendGrid (Email Notifications)
1. Sign up: https://sendgrid.com/
2. Create API key
3. Add to .env:
   ```
   SENDGRID_API_KEY=your_key
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   ```

### 3. Project Structure

```
SafeRoute-AI/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Context providers (Auth, Location, Socket)
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                    # Node.js Backend
│   ├── config/              # Configuration files
│   ├── controllers/         # Route handlers
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   ├── utils/               # Utility functions
│   ├── server.js            # Entry point
│   └── package.json
│
├── ai-services/             # Python AI Microservices
│   ├── route_scorer/        # Route safety scoring
│   │   ├── app.py          # Flask app
│   │   ├── model.py        # ML model
│   │   ├── train.py        # Training script
│   │   └── model.pkl       # Trained model
│   │
│   ├── voice_stress/        # Voice distress detection
│   │   ├── app.py          # Flask app
│   │   ├── feature_extraction.py
│   │   └── model.py
│   │
│   └── requirements.txt     # Python dependencies
│
├── data-generation/         # Synthetic data generators
│   ├── generate_users.py
│   ├── generate_route_data.py
│   └── mock_heatmap.py
│
├── .env.example            # Environment template
├── DEPLOYMENT_GUIDE.md     # Production deployment guide
├── README.md               # Project overview
└── package.json            # Root package config
```

### 4. Core Technologies

**Frontend**
- React 18 with Hooks
- Tailwind CSS for styling
- Framer Motion for animations
- Chart.js for data visualization
- Socket.io for real-time updates

**Backend**
- Express.js for REST API
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for real-time communication
- Twilio & SendGrid integrations

**AI/ML**
- Flask for API servers
- Scikit-learn for ML models
- Librosa for audio processing
- NumPy, Pandas for data processing

### 5. Key Features Implementation

#### Authentication
- User registration and login
- JWT token-based auth
- Protected routes
- Emergency contact management

#### Route Safety Scoring
- AI-based route analysis
- Multiple scoring factors
- Real-time recommendations
- Route comparison

#### Voice Distress Detection
- Audio file processing
- Keyword detection (multi-language)
- Stress analysis
- Automatic SOS triggering

#### Live Tracking
- Real-time location sharing
- Socket.io communication
- Route deviation alerts
- ETA updates

#### Emergency Response
- One-tap SOS button
- Fake call generation
- Emergency contact notifications
- Location + audio sharing

### 6. API Endpoints

#### Authentication
```
POST   /api/auth/register        - Create new user
POST   /api/auth/login           - User login
GET    /api/auth/me              - Get user profile
PUT    /api/auth/contacts        - Update emergency contacts
```

#### Routes & Trips
```
POST   /api/trips/create         - Start a trip
GET    /api/trips/:id            - Get trip details
POST   /api/trips/:id/end        - End a trip
GET    /api/routes/score         - Score a route
GET    /api/routes/compare       - Compare routes
```

#### Safety & Alerts
```
POST   /api/alerts/sos           - Trigger SOS
POST   /api/alerts/check-in      - Send check-in
GET    /api/safety/score         - Get safety score
GET    /api/admin/heatmap        - Get heatmap data
```

#### Voice Services
```
POST   /api/voice/detect-distress - Analyze audio
POST   /api/voice/fake-call       - Generate fake call
```

### 7. Testing

```bash
# Test backend
cd server
npm test

# Test frontend
cd client
npm test

# Test AI services
curl http://localhost:5001/health
curl http://localhost:5002/health
```

### 8. Database Seeding

```bash
cd data-generation
python generate_users.py
python generate_route_data.py
python mock_heatmap.py
```

### 9. Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `npx kill-port 3000` or `npm run dev -- --port 3001` |
| MongoDB connection error | Ensure mongod is running or check MONGODB_URI |
| AI services not found | Verify Flask apps running on correct ports |
| CORS errors | Check CLIENT_URL and REACT_APP_API_URL |
| Dependencies missing | Run `npm install` and `pip install -r requirements.txt` |

### 10. Development Workflow

```bash
# Create new branch
git checkout -b feature/new-feature

# Make changes and test
npm run dev  # Frontend
npm run dev  # Backend (in another terminal)

# Commit with meaningful message
git add .
git commit -m "feat: Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request
```

### 11. Performance Optimization

- Implement Redis caching
- Use database indexes
- Optimize bundle size
- Lazy load components
- Enable gzip compression
- Use CDN for static assets

### 12. Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure JWT secret
- [ ] Enable CORS properly
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Use helmet.js middleware
- [ ] Implement proper logging

---

## Next Steps

1. ✅ Complete initial setup
2. 📚 Read DEPLOYMENT_GUIDE.md
3. 🔧 Configure your API keys
4. 📊 Seed demo data
5. 🚀 Deploy to production

## Support

- Documentation: See `/docs` folder
- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Email: support@saferoute.ai

---

**Happy coding! 🚀**
