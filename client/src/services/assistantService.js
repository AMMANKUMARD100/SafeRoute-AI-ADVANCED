// client/src/services/assistantService.js
import API from './api';

export async function askAssistant(query) {
  if (!query || query.trim() === '') {
    console.warn('Assistant: Empty query provided');
    return 'Please provide a question or command.';
  }

  try {
    console.log('📤 Sending query to assistant:', query);
    const resp = await API.post('/assistant', { query });

    console.log('Assistant response:', resp.data);
    return resp.data.reply || 'No response from assistant.';
  } catch (err) {
    console.error("❌ Assistant service error:", err.message, err);
    
    // Provide actionable error message
    if (err.message.includes('Network') || err.code === 'ERR_NETWORK') {
      return 'Cannot reach the server. Make sure it is running on localhost:5000.';
    }
    
    if (err.response?.status === 400) {
      return 'Invalid request. Please try again.';
    }
    
    if (err.response?.status === 500) {
      return err.response.data?.error || 'The assistant service is having trouble. Please check your API configuration.';
    }
    
    return 'Sorry, the assistant could not respond. ' + (err.message || 'Please try again.');
  }
}
