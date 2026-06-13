import { motion } from 'framer-motion';
import { useState } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { sendCheckIn } from '../../services/alertService';

const CheckInButton = () => {
  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckIn = async () => {
    setChecking(true);
    setDone(false);
    setError(null);

    try {
      const pos = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is unavailable.'));
        } else {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      });

      const resp = await sendCheckIn({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        message: '✅ I am safe and on my way.',
      });

      if (resp?.smsErrors?.length) {
        setError('Check-in sent, but some contacts did not receive SMS.');
      } else {
        setDone(true);
        if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Unable to send check-in right now.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCheckIn}
        disabled={checking}
        className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-all ${
          done
            ? 'bg-emerald-600/30 border border-emerald-500/30'
            : 'bg-white/10 border border-white/10 hover:bg-emerald-600/20 disabled:opacity-70 disabled:cursor-wait'
        }`}
      >
        <ShieldCheckIcon className="h-5 w-5" />
        <span>{done ? 'Check‑in Sent!' : checking ? 'Sending...' : 'I’m Safe'}</span>
      </motion.button>

      {done && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-emerald-300 text-sm"
        >
          Check-in sent. Your contacts have been notified.
        </motion.p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default CheckInButton;
