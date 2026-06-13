# SafeRoute AI – Complete Environment Configuration Guide

## Quick Start (Development)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/SafeRoute-AI.git
cd SafeRoute-AI

# 2. Install server dependencies
cd server
npm install
cd ..

# 3. Install client dependencies
cd client
npm install
cd ..

# 4. Install AI services dependencies
cd ai-services
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt

# 5. Start MongoDB (if local)
# Windows: 
mongod
# or use MongoDB Atlas

# 6. Configure environment variables (create .env files)
# Copy and modify:
# - server/.env
# - client/.env

# 7. Start services
# Terminal 1: MongoDB (if local)
mongod

# Terminal 2: Backend Server
cd server
npm run dev

# Terminal 3: Frontend
cd client
npm start

# Terminal 4: Route Scorer AI
cd ai-services/route_scorer
python app.py

# Terminal 5: Voice Stress Detector AI
cd ai-services/voice_stress
python app.py
```

## Environment Variables

### Server (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/saferoute
JWT_SECRET=your_very_secure_secret_key_here
JWT_EXPIRE=30d
ORS_API_KEY=your_openrouteservice_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
GEOAPIFY_API_KEY=your_geoapify_api_key
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=+1234567890
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@saferoute.ai
AI_ROUTE_SCORER_URL=http://localhost:5001
AI_VOICE_DISTRESS_URL=http://localhost:5002
CLIENT_URL=http://localhost:3000
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GEOAPIFY_API_KEY=your_geoapify_api_key
REACT_APP_ORS_API_KEY=your_openrouteservice_api_key
REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key
```

## API Services & Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend (React) | 3000 | http://localhost:3000 |
| Backend (Node/Express) | 5000 | http://localhost:5000 |
| Route Scorer AI | 5001 | http://localhost:5001 |
| Voice Distress AI | 5002 | http://localhost:5002 |
| MongoDB | 27017 | mongodb://localhost:27017 |

## Database Setup (MongoDB)

### Local MongoDB
```bash
# Windows
mongod --dbpath "C:\data\db"

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Add database user
4. Get connection string
5. Add to MONGODB_URI in .env

## Third-Party Services Setup

### OpenRouteService / Geoapify / OpenWeather
1. OpenRouteService (routing): https://openrouteservice.org/ — sign up and add `ORS_API_KEY` to server/.env
2. Geoapify (geocoding/places): https://www.geoapify.com/ — sign up and add `GEOAPIFY_API_KEY` to server/.env and `REACT_APP_GEOAPIFY_API_KEY` to client/.env
3. OpenWeather (weather): https://openweathermap.org/ — sign up and add `OPENWEATHER_API_KEY` to server/.env and `REACT_APP_OPENWEATHER_API_KEY` to client/.env

### Twilio (SMS)
1. Sign up at https://www.twilio.com/
2. Get SID, Auth Token, and Phone number
3. Add to .env

### SendGrid (Email)
1. Sign up at https://sendgrid.com/
2. Create API key
3. Add to .env

## Testing

### Test Server
```bash
cd server
npm test
```

### Test Client
```bash
cd client
npm test
```

### Test AI Services
```bash
# Route Scorer
curl http://localhost:5001/health

# Voice Distress
curl http://localhost:5002/health
```

## Building for Production

### Backend
```bash
cd server
npm run build  # if applicable
npm start
```

### Frontend
```bash
cd client
npm run build
# Serve 'build' folder with nginx or express
```

### Docker (Optional)
```bash
docker-compose up
```

## Deployment

### Heroku
```bash
heroku create saferoute-ai-server
heroku addons:create mongolab
git push heroku main
```

### AWS / GCP / Azure
See deployment guides in `/docs/deployment`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

### AI Services Not Found
- Ensure Flask apps are running on correct ports
- Check AI_ROUTE_SCORER_URL and AI_VOICE_DISTRESS_URL in .env
- Verify Python dependencies are installed

### CORS Errors
- Check CLIENT_URL in server .env
- Verify REACT_APP_API_URL in client .env
- Ensure both URLs are correct

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill <PID>
```

## Performance Tips

1. **Use MongoDB indexes** for frequently queried fields
2. **Enable Redis caching** for route scores
3. **Implement rate limiting** on API endpoints
4. **Optimize images** before deployment
5. **Use CDN** for static assets
6. **Enable GZIP compression** on server

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Implement proper authentication
- [ ] Add CSRF protection
- [ ] Enable CORS properly
- [ ] Use helmet.js middleware
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Support & Documentation

- Documentation: `/docs`
- Issue Tracker: GitHub Issues
- Discussions: GitHub Discussions

---

**Last Updated:** 2026-06-09
**Version:** 1.0.0
