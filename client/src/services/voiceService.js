import API from './api';

export const detectDistressText = async (text, language = 'en') => {
  const { data } = await API.post('/voice/detect-distress-text', { text, language });
  return data; // { isDistress, confidence, triggerWord? }
};

export const analyzeAudioStress = async (audioBase64) => {
  const { data } = await API.post('/voice/detect-stress-audio', { audio: audioBase64 });
  return data; // { stressLevel, confidence }
};

export const voiceAssistantQuery = async (transcript, language = 'en') => {
  const { data } = await API.post('/voice/assistant', { text: transcript, language });
  return data; // { reply }
};