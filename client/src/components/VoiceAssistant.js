import React, { useState } from "react";
import { askAssistant } from "../services/assistantService"; // ✅ import service

function VoiceAssistant() {
  const [language, setLanguage] = useState("en-US");
  const [response, setResponse] = useState("");

  // 🎙 Voice input
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.start();

    recognition.onresult = async (event) => {
      const spokenQuery = event.results[0][0].transcript;
      await handleQuery(spokenQuery);
    };
  };

  const handleQuery = async (userQuery) => {
    if (!userQuery) return;

    const reply = await askAssistant(userQuery);
    setResponse(reply);

    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = language;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="voice-assistant p-4 bg-gray-800 text-white rounded">
      <h2 className="text-lg font-bold">SafeRoute Voice Assistant</h2>

      {/* Language Selector */}
      <select value={language} onChange={(e) => setLanguage(e.target.value)} className="mb-2">
        <option value="en-US">English</option>
        <option value="hi-IN">Hindi</option>
        <option value="ta-IN">Tamil</option>
      </select>

      {/* Voice Input */}
      <button onClick={startListening} className="p-2 bg-green-600">🎙 Speak</button>

      {/* Response */}
      <p className="mt-2">Assistant: {response}</p>
    </div>
  );
}

export default VoiceAssistant;
