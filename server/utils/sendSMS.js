const twilio = require('twilio');
const config = require('../config/config');

/**
 * Sends an SMS using Twilio.
 * If Twilio credentials are missing (development), the message is logged instead.
 * @param {string} to - Recipient phone number (e.g., +919876543210)
 * @param {string} body - Message body
 */
const sendSMS = async (to, body) => {
  if (!config.twilioSid || !config.twilioAuthToken || !config.twilioPhone) {
    console.log(`[SMS MOCK] To: ${to} | Message: ${body}`);
    return { success: true, mock: true };
  }

  const client = twilio(config.twilioSid, config.twilioAuthToken);
  try {
    const message = await client.messages.create({
      body,
      from: config.twilioPhone,
      to,
    });
    console.log(`[SMS] Sent to ${to} – SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error(`[SMS] Failed to ${to}:`, error.code || error.message, error.moreInfo || '');
    if (error.code === 20003) {
      throw new Error(
        `SMS sending failed: ${error.message}. Twilio authentication failed. Check TWILIO_SID and TWILIO_AUTH_TOKEN in server/.env, and verify the Twilio account is active.`
      );
    }
    throw new Error(`SMS sending failed: ${error.message}`);
  }
};

module.exports = { sendSMS };