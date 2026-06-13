import React, { useEffect, useRef, useState } from 'react';
import { askAssistant } from '../../services/assistantService';

const STORAGE_KEY = 'sr_assistant_messages';

export default function AssistantChat({ open, onClose }) {
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return [{ from: 'bot', text: 'Hi — I am your AI assistant. How can I help?', ts: new Date().toISOString() }];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const boxRef = useRef();

  useEffect(() => {
    if (open) boxRef.current?.focus();
  }, [open]);

  useEffect(() => {
    // scroll to bottom when messages change and persist
    const el = document.getElementById('sr-assistant-messages');
    if (el) el.scrollTop = el.scrollHeight;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      // ignore storage errors
    }
  }, [messages]);

  if (!open) return null;

  async function handleSend() {
    const text = input.trim();
    if (!text) return;

    const userMsg = { from: 'user', text, ts: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await askAssistant(text);
      setMessages((m) => [...m, { from: 'bot', text: reply, ts: new Date().toISOString() }]);
    } catch (err) {
      setMessages((m) => [...m, { from: 'bot', text: 'Sorry, something went wrong.', ts: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sr-assistant-modal" role="dialog" aria-modal="true">
      <div className="sr-assistant-panel">
        <div className="sr-assistant-header">
          <div className="sr-assistant-title">AI Assistant</div>
          <button className="sr-assistant-close" onClick={onClose} aria-label="Close chat">✕</button>
        </div>

        <div id="sr-assistant-messages" className="sr-assistant-messages">
          {messages.map((m, i) => (
            <div key={i} className={`sr-msg sr-msg-${m.from}`}>
              <div className="sr-msg-text">
                <div>{m.text}</div>
                <div className="sr-msg-time">{m.ts ? new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="sr-assistant-input">
          <input
            ref={boxRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Type a question..."
            aria-label="Message"
          />
          <button onClick={handleSend} disabled={loading} className="sr-send-btn">
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
