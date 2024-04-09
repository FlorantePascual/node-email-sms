// Import email and SMS functions
import * as email from './email';
import * as sms from './sms';

// Export email and SMS functions
export const sendEmail = email.sendEmail;
export const sendText = sms.sendText;
