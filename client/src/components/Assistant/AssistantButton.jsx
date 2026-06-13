import React, { useState } from 'react';
import AssistantChat from './AssistantChat';
import './assistant.css';

export default function AssistantButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AssistantChat open={open} onClose={() => setOpen(false)} />

      <button
        aria-label="Open AI Assistant"
        className="sr-assistant-button"
        onClick={() => setOpen((s) => !s)}
        title="Ask the AI assistant"
      >
        <div className="sr-assistant-icon">🤖</div>
        <div className="sr-assistant-pulse" />
      </button>
    </>
  );
}
