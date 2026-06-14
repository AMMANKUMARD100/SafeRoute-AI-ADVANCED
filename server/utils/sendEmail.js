const axios = require('axios');
const config = require('../config/config');

/**
 * Sends an email via EmailJS.
 * If EmailJS is not configured, logs the message as mock output.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} [html] - Optional HTML body
 */
const sendEmail = async (to, subject, text, html) => {
  const {
    emailjsUserId,
    emailjsServiceId,
    emailjsTemplateId,
  } = config;

  if (!emailjsUserId || !emailjsServiceId || !emailjsTemplateId) {
    console.log(`[EMAILJS MOCK] To: ${to} | Subject: ${subject}\n${text}`);
    return { success: true, mock: true };
  }

  const url = 'https://api.emailjs.com/api/v1.0/email/send';
  const templateParams = {
    to_email: to,
    subject,
    message: text,
  };

  if (html) {
    templateParams.html = html;
  }

  try {
    const resp = await axios.post(url, {
      service_id: emailjsServiceId,
      template_id: emailjsTemplateId,
      user_id: emailjsUserId,
      template_params: templateParams,
    }, { timeout: 10000 });

    console.log(`[EmailJS] Sent email to ${to}; status=${resp.status}`);
    return { success: true, response: resp.data };
  } catch (error) {
    console.error(`[EmailJS] Failed to send email to ${to}:`, error.response?.data || error.message);
    throw new Error('Email sending failed');
  }
};

module.exports = { sendEmail }; 