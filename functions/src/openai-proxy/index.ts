import * as functions from 'firebase-functions';
// import * as cors from 'cors';
const cors = require('cors'); // workaround for CORS issue

export const openaiProxy = functions.https.onRequest((req, res) => {
  cors({ origin: true })(req, res, main);
  function main() {
    return openaiProxyHandler(req, res);
  }
});

// listen to the request and response with the result from OpenAI API
export const openaiProxyHandler = async (req: functions.Request, res: functions.Response) => {
  // Check for POST request and API key
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { domainOverride } = req.body;

  // check if running locally
  if (process.env.FUNCTIONS_EMULATOR) {
    // Allow test override, do nothing. Or uncomment below to simulate an error
    // res.status(403).send('Test Failure Simulated, not a real error.');
    // return;
  } else if (domainOverride) {
    if (domainOverride !== 'GODisGood!') {
      res.status(403).send('Forbidden - Invalid domain override');
      return;
    }
  } else {
    // check valid domains of request. Change this to your own domain
    const origin = req.get('Origin') || '';
    console.log({ origin, headers: req.headers});
    const validOrigins = ['https://florantepascual.com', 'https://www.florantepascual.com'];
    if (!validOrigins.includes(origin)) {
      res.status(403).send('Forbidden - Invalid origin');
      return;
    }
  }

  // Validate payload
  const { message } = req.body;
  if (!message) {
    res.status(400).send('Bad Request - Missing required fields');
    return;
  }

  // Call OpenAI API
  const OPENAI_API_KEY = functions.config().openai.key;
  try {
    const responseMessage = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // actual message is in data.choices[0].message.content;
        return data; 
      })
      ;
    res.status(200).json(responseMessage);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};
