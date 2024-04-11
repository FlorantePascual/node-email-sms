// Import email, SMS plus other functions
import * as email from './email';
import * as sms from './sms';
import * as openAi from './openai-proxy';

// Export all functions
export const sendEmail = email.sendEmail;
export const sendText = sms.sendText;
export const openaiProxy = openAi.openaiProxy;
