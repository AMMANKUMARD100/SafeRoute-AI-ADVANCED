import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, MapPinIcon, MicrophoneIcon, BoltIcon } from '@heroicons/react/24/outline';
import GlassCard from '../components/common/GlassCard';
import GlowButton from '../components/common/GlowButton';

const features = [
  { icon: MapPinIcon, title: 'AI Safe Routes', desc: 'Predict safest paths using real‑time crime, lighting & crowd data.' },
  { icon: MicrophoneIcon, title: 'Voice Distress', desc: 'Automatic alert when you say “help” in Hindi, English or Tamil.' },
  { icon: BoltIcon, title: 'One‑Tap SOS', desc: 'Send live location & audio to your emergency contacts instantly.' },
  { icon: ShieldCheckIcon, title: 'Night Protection', desc: 'Auto‑enables high alert mode after dark with frequent check‑ins.' },
];

const Landing = () => (
  <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
    {/* Hero */}
    <section className="relative pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent mb-6">
          Travel Fearlessly
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          India’s first AI‑powered commute assistant built to protect women. Predict, prevent, and respond — all in one app.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register">
            <GlowButton color="pink" size="lg">Get Started</GlowButton>
          </Link>
          <Link to="/dashboard">
            <GlowButton color="purple" size="lg">Live Demo</GlowButton>
          </Link>
        </div>
      </motion.div>
    </section>

    {/* Features */}
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-3xl font-bold text-center mb-14"
      >
        Why SafeRoute AI
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="text-center h-full">
              <f.icon className="h-10 w-10 mx-auto text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Footer */}
    <footer className="py-8 border-t border-white/10 text-center text-gray-500 text-sm">
      © 2026 SafeRoute AI. Built for women’s safety in India.
    </footer>
  </div>
);

export default Landing;