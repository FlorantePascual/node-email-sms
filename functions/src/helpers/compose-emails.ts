import * as functions from 'firebase-functions';
import * as emailConstants from '../helpers/constants/email-constants';

export function composeEmails(name: string, email: string, message: string, authUser: string) {
  // Email constants
  const { companyEmailTo, companyName, teamName, botName } = emailConstants;

  // Compose email for concerned department
  const leadCaptureEmail = {
    from: `"${botName}" <${authUser}>`,
    to: companyEmailTo,
    cc: functions.config().email.cc,
    subject: `ChatBot inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  const randomId = Math.floor(Math.random() * 90000) + 10000;

  let emailText = `Hi ${name},\n\n`;
  emailText += `This is an automatic acknowledgement of your recent ChatBot conversation as follows:\n\n"${message}"\n\n`;
  emailText += `We appreciate your interest!\n\n`;
  emailText += `One of our team members will get in touch with you shortly.\n\n`;
  emailText += `Thank you for considering ${companyName}. We look forward to serving you.\n\n`;
  emailText += `Best regards,\n`;
  emailText += `${teamName}`;

  // Compose acknowledgement email for customer
  const acknowledgementEmail = {
    from: `"${companyName}" <${authUser}>`,
    to: email,
    bcc: functions.config().email.cc,
    subject: `Acknowledgment of Chat Inquiry (${randomId})`,
    text: emailText,
  };

  return {
    leadCaptureEmail,
    acknowledgementEmail,
  };
}
