const sgMail = require('@sendgrid/mail');
const config = require('../config/config');

if (config.sendgridApiKey) {
  sgMail.setApiKey(config.sendgridApiKey);
}

/**
 * Sends an email via SendGrid.
 * Falls back to logging if API key is missing.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} [html] - Optional HTML body
 */
const sendEmail = async (to, subject, text, html) => {
  if (!config.sendgridApiKey) {
    console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}\n${text}`);
    return { success: true, mock: true };
  }

  const msg = {
    to,
    from: config.sendgridFromEmail,
    subject,
    text,
    html: html || text,
  };

  try {
    const response = await sgMail.send(msg);
    console.log(`[EMAIL] Sent to ${to} – Status: ${response[0].statusCode}`);
    return { success: true };
  } catch (error) {
    console.error(`[EMAIL] Failed to ${to}:`, error.response?.body || error.message);
    throw new Error('Email sending failed');
  }
};

module.exports = { sendEmail };