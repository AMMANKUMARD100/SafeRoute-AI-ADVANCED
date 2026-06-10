import { motion } from 'framer-motion';
import { SOSButton, FakeCall, DistressVoiceButton, CheckInButton } from '../components/safety';
import { VoiceAssistant } from '../components/voice';
import GlassCard from '../components/common/GlassCard';

const Emergency = () => {
  const features = [
    { title: 'One‑Tap SOS', component: SOSButton, desc: 'Instant alert to emergency contacts' },
    { title: 'Fake Call', component: FakeCall, desc: 'Distraction & de-escalation' },
    { title: 'Voice Monitoring', component: DistressVoiceButton, desc: 'Real-time stress detection' },
    { title: 'Check‑In', component: CheckInButton, desc: 'Verify your safety status' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 pt-20 px-4 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent mb-3">
          Emergency Assistance
        </h1>
        <p className="text-gray-300 text-lg">Multiple ways to get help when you need it most</p>
      </motion.div>

      {/* Emergency Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {features.map((feature, i) => {
          const Component = feature.component;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="mb-6">
                  <Component />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Voice Assistant Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12"
      >
        <VoiceAssistant />
      </motion.div>
    </div>
  );
};

export default Emergency;