import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import { validateRequest } from '../helpers/validate-request';
import { composeEmails } from '../helpers/compose-emails';

// Initialize nodemailer with SMTP server settings from environment variables
const portNumber = functions.config().smtp.port * 1;
const authUser = functions.config().smtp.user;
const mailTransport = nodemailer.createTransport({
  host: functions.config().smtp.host,
  port: portNumber,
  // true for 465, false for other ports
  secure: portNumber === 465 ? true : false,
  auth: {
    user: authUser,
    pass: functions.config().smtp.pass,
  },
});

/* eslint-disable max-len */
export const sendEmail = functions.https.onRequest(async (req, res) => {
  // Validate request
  if (!validateRequest(req, res)) {
    return;
  }

  // Validate payload
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).send('Bad Request - Missing required fields');
    return;
  }

  // Compose email content
  const { leadCaptureEmail, acknowledgementEmail } = composeEmails(name, email, message, authUser);

  // Send emails
  try {
    await Promise.all(
      [
        mailTransport.sendMail(leadCaptureEmail),
        mailTransport.sendMail(acknowledgementEmail),
      ]
    );
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('There was an error while sending the email:', error);
    res.status(500).send('Internal Server Error - Failed to send email');
  }
});
