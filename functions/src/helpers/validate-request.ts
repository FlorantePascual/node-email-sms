import * as functions from 'firebase-functions';

export function validateRequest(req: functions.https.Request, res: functions.Response): boolean {
  // Check for POST request
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return false;
  }

  // Get API key in headers
  const apiKey = req.headers['x-api-key'];

  // Check if testing mode
  const testApiKey = 'test123'; // Test API key for local testing

  // Allow test API key for local testing
  if (apiKey === testApiKey) {
    // check if hostnames match localhost on port 5001
    const host = req.headers.host;
    if (!host || !host.includes('127.0.0.1:5001')) {
      res.status(401).send('Unauthorized - Invalid host');
      return false;
    }
    return true;
  }

  // Get production API key from environment variables
  const configApiKey = functions.config().api.key;

  // Check if API key is valid
  if (!apiKey || apiKey !== configApiKey) {
    res.status(401).send('Unauthorized - Invalid API key');
    return false;
  }
  return true;
}
