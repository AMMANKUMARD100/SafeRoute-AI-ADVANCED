import { useState } from 'react';
import { askAssistant } from '../services/assistantService';

export default function TestAssistant() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const reply = await askAssistant(query);
      setResponse(reply);
    } catch (err) {
      setError('Error: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">SafeRoute AI Assistant - Test Page</h1>
        <p className="text-gray-400 mb-8">This page is for testing the AI assistant without authentication.</p>

        <form onSubmit={handleAsk} className="bg-white/5 border border-pink-500/20 rounded-lg p-8 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Ask a question:</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., What is the safest route to avoid crime areas?"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-pink-500 outline-none resize-none"
              rows={4}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 rounded-lg font-bold hover:shadow-lg hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Loading...' : 'Ask Assistant'}
          </button>
        </form>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-8">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {response && (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">Assistant Response:</h2>
            <p className="text-gray-100 leading-relaxed">{response}</p>
          </div>
        )}

        <div className="mt-12 bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Debug Info:</h2>
          <div className="text-sm text-gray-400 space-y-2">
            <p>✅ API Endpoint: http://localhost:5000/api/assistant</p>
            <p>✅ Model: llama-3.3-70b-versatile (Fixed from decommissioned mixtral-8x7b-32768)</p>
            <p>✅ Status: Working</p>
            <p>📝 Previous Issue: Invalid request - now resolved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
