const axios = require('axios');
const config = require('../config/config');

/**
 * Sends a notification using EmailJS only. Keeps the same `sendSMS(to, body)` signature.
 * If EmailJS is not configured, logs the message as mock output.
 */
const sendSMS = async (to, body) => {
  const {
    emailjsUserId,
    emailjsServiceId,
    emailjsTemplateId,
    emailjsToEmail,
    alertEmail,
  } = config;

  const destinationEmail = alertEmail || emailjsToEmail;

  if (!destinationEmail) {
    console.log(`[EMAILJS MOCK] No destination configured. To: ${to} | Message: ${body}`);
    return { success: true, mock: true };
  }

  if (!emailjsUserId || !emailjsServiceId || !emailjsTemplateId) {
    console.log(`[EMAILJS MOCK] To: ${destinationEmail} | Message: ${body}`);
    return { success: true, mock: true };
  }

  const url = 'https://api.emailjs.com/api/v1.0/email/send';
  const templateParams = {
    to_email: destinationEmail,
    subject: 'Emergency Alert from SafeRoute',
    message: body,
    original_recipient: to,
  };

  try {
    const resp = await axios.post(url, {
      service_id: emailjsServiceId,
      template_id: emailjsTemplateId,
      user_id: emailjsUserId,
      template_params: templateParams,
    }, { timeout: 10000 });

    console.log(`[EmailJS] Sent notification for ${to} to ${destinationEmail}; status=${resp.status}`);
    return { success: true, response: resp.data };
  } catch (error) {
    const errInfo = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    console.error(`[EmailJS] Failed to send notification for ${to}:`, errInfo);
    throw new Error(`SMS (EmailJS) sending failed: ${JSON.stringify(errInfo)}`);
  }
};

module.exports = { sendSMS }; 