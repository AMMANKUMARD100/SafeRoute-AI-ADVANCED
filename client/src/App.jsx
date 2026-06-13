// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, LocationProvider, useAuth } from './context';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RouteAnalysis from './pages/RouteAnalysis';
import LiveTracking from './pages/LiveTracking';
import Emergency from './pages/Emergency';
import AdminAnalytics from './pages/AdminAnalytics';
import TestAssistant from './pages/TestAssistant'; // ✅ Test page for AI assistant
import NotFound from './pages/NotFound';
import AssistantButton from './components/Assistant/AssistantButton';

// ✅ Import SOS service
import { sendSOS } from "./sosService";
import { detectStress } from "./voiceStressDetector";

// ✅ NEW IMPORTS for voice stress detection
import Meyda from "meyda";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  useEffect(() => {
    async function startVoiceMonitoring() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);

        const analyser = Meyda.createAnalyzer({
          audioContext: audioContext,
          source: source,
          bufferSize: 512,
          featureExtractors: ["rms", "spectralCentroid", "spectralFlatness"],
          callback: (features) => {
            const stressDetected = detectStress(features);

            if (stressDetected) {
              console.log("Stress detected!", features);
              sendSOS(); // ✅ now triggers the sosService.js function
            }
          },
        });

        analyser.start();
      } catch (err) {
        console.error("Microphone access error:", err);
      }
    }

    startVoiceMonitoring();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <LocationProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-950">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/test-assistant" element={<TestAssistant />} /> {/* ✅ Test page (no auth required) */}
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/route-analysis" element={<PrivateRoute><RouteAnalysis /></PrivateRoute>} />
                  <Route path="/live-tracking" element={<PrivateRoute><LiveTracking /></PrivateRoute>} />
                  <Route path="/emergency" element={<PrivateRoute><Emergency /></PrivateRoute>} />
                  <Route path="/admin" element={<PrivateRoute><AdminAnalytics /></PrivateRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <AssistantButton />
              <Footer />
            </div>
          </Router>
        </LocationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
