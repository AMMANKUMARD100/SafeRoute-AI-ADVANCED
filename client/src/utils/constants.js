// Route types and their display properties
export const ROUTE_TYPES = {
  safest: {
    label: 'Safest Route',
    color: '#22c55e',   // emerald-500
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
  },
  fastest: {
    label: 'Fastest Route',
    color: '#3b82f6',   // blue-500
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
  },
  balanced: {
    label: 'Balanced Route',
    color: '#f97316',   // orange-500
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
  },
};

// Emergency contact numbers (Indian)
export const EMERGENCY_NUMBERS = {
  police: '100',
  ambulance: '108',
  womenHelpline: '1091',
  nationalHelpline: '112',
};

// Voice distress keywords by language
export const DISTRESS_KEYWORDS = {
  en: ['help', 'save me', 'stop', 'police', 'emergency'],
  hi: ['बचाओ', 'मदद', 'पुलिस', 'रोको'],
  ta: ['காப்பாத்து', 'உதவி', 'போலீஸ்', 'நிறுத்து'],
};

// Map default center (Mumbai)
export const MAP_CENTER = { lat: 19.076, lng: 72.8777 };

// Safety score thresholds for colors
export const SCORE_COLORS = {
  high: { min: 80, color: '#22c55e', text: 'text-emerald-400' },
  medium: { min: 60, color: '#eab308', text: 'text-amber-400' },
  low: { min: 0, color: '#ef4444', text: 'text-red-400' },
};

// Languages supported by voice assistant
export const SUPPORTED_LANGUAGES = {
  en: { label: 'English', code: 'en-IN' },
  hi: { label: 'हिन्दी', code: 'hi-IN' },
  ta: { label: 'தமிழ்', code: 'ta-IN' },
};