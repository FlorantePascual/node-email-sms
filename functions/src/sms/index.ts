import * as functions from 'firebase-functions';
import { validateRequest } from '../helpers/validate-request';
import twilio from 'twilio';

const accountSid = functions.config().sms.twilio_account_sid;
const authToken = functions.config().sms.twilio_auth_token;
const senderPhoneNumber = functions.config().sms.sender_phone_number;

const client = twilio(accountSid, authToken);

export const sendText = functions.https.onRequest((req, res) => {
  return fetchHandler(req, res);
});

const fetchHandler = async (req: functions.https.Request, res: functions.Response) => {
  // Validate request
  if (!validateRequest(req, res)) {
    return;
  }

  // Validate payload
  const { smsMessage, phoneNumber } = req.body;
  if (!smsMessage || !phoneNumber) {
    res.status(400).send('Bad Request - Missing required fields');
    return;
  }

  let phone = phoneNumber;

  // check if rawPhoneNumber is E.164 format
  if (!phoneNumber.startsWith('+')) {
    phone = `+1${phoneNumber}`;
  }

  try {
    await client.messages
      .create({
        body: smsMessage,
        from: senderPhoneNumber, // E.164 format
        to: phone,
      });

    res.status(200).send('SMS sent successfully');
  } catch (error) {
    console.error('There was an error while sending the SMS:', error);
    res.status(500).send('Internal Server Error - Failed to send SMS');
  }
};
