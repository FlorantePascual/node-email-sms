# Node Email-SMS API
Scalable serverless solution for email and SMS integration using Node.js, Firebase Cloud Functions, SMTP, and Twilio. Use this for powering your AI Integration Tools or any messaging function via REST API.

## Use Cases
1. Acknowledge a Chat Bot conversation with a potential lead
2. Inform appropriate department of potential Sales Lead
3. 2FA Authentication / Verification via SMS or Email
4. Send a discount code for abandoned cart recovery
5. Appointment Reminders
6. Emergency Notification
7. Marketing Promotions and more

## Solution Advantage
### IT Dollar Economics
For majority of chatbot use-cases, this integration solution eliminates the need for costly integration subscriptions and messaging costs. It also reduces the number of moving parts improving reliability of your AI-powered solution.
### Automatic Scaling
When the number of requests increases, Firebase Cloud Functions automatically allocates more resources to handle the load. This means that as your app grows in popularity or experiences usage spikes, the functions will scale up to meet the demand without requiring manual intervention. Conversely, it scales down as the demand decreases.

## Introduction

This project contains a Firebase Cloud Function that has the following endpoints:
- **/sendEmail** - sends emails using `nodemailer` and SMTP. It's designed to receive a POST request with a payload containing `name`, `email`, and `message`, and then sends this data by email to a predefined email account.
- **/sendText** - sends SMS text messages using Twilio through a POST request with a payload containing `phoneNumber` and `smsMessage`

## Prerequisites

- Node.js
- A Firebase project
- SMTP server credentials (from your email provider)
- Twilio account and phone number
- Firebase CLI

## Getting Started

1. **Clone the Repository**

   Clone this repository to your local machine:

   ```bash
   git clone https://github.com/FlorantePascual/node-email-sms.git
   ```
   Go to the newly created folder e.g.`node-email-sms`. It should contain a `functions` folder.
   ```bash
   cd node-email-sms
   ls -l    # if running bash terminal
   dir      # if running windows terminal
   ```

2. **Install Dependencies**

    Navigate to the `functions` directory and install the required npm packages:

    ```bash
    cd functions
    npm install
    ```

3. **Set Up Firebase**
    
    Initialize Firebase:

    ```bash
    firebase login       # if not logged in yet
    firebase use --clear # clears any active project
    firebase init
    ```
    Follow the prompts to link your Firebase project and configure the Functions emulator and other Firebase services as needed.
    1. For features to setup, select **Functions** and **Emulators**
    2. Create new or select a project. When asked to Initialize or Overwrite codebase, select **Overwrite**
    3. Select **TypeScript** as the language
    4. Select **Yes** for ESLint
    5. For all prompts where a file already exists, select **No Overwrite**
    6. Include dependencies now? **Yes**
    7. For emulators, select **Function Emulator**

## Configuration

### Environment Variables

Set up your SMTP, SMS credentials and other sensitive information as environment variables in Firebase:

### API Key
Generate an API Key to secure your endpoint. You can generate one by asking ChatGPT to generate a random key for you.

```bash
    firebase functions:config:set api.key="YOUR_API_KEY"
```
Keep this value secure and DO NOT put in anywhere in the source code.

### SMTP Email
```bash
firebase functions:config:set smtp.user="YOUR_SMTP_USERNAME" smtp.pass="YOUR_SMTP_PASSWORD" smtp.host="YOUR_SMTP_HOST" smtp.port="YOUR_SMTP_PORT" email.cc="YOUR_EMAIL_RECIPIENT"
```

Replace values inside the double-quotes accordingly.

### Twilio SMS
```bash
firebase functions:config:set sms.twilio_account_sid="YOUR_TWILIO_ACCOUNT_SID" sms.twilio_auth_token="YOUR_TWILIO_AUTH_TOKEN" sms.sender_phone_number="YOUR_TWILIO_PHONE_NUMBER"
```

Replace YOUR_TWILIO_ACCOUNT_SID, YOUR_TWILIO_AUTH_TOKEN and YOUR_TWILIO_PHONE_NUMBER with your actual Twilio account details.

**NOTE** These credentials can only be read by functions.config() from the environment at runtime. To use the same values for testing, run the following command:

```bash
firebase functions:config:get > .runtimeconfig.json
```
Make sure you **DO NOT** check-in this file `.runtimeconfig.json` into your repo.

## Customization
1. Using your code editor, modify the entries in `functions/src/helpers/constants/email-constants.ts` to customize your email details:
    - Company Name
    - Team or Department Name
    - Email address that will receive the lead info
2. Modify `compose-emails.ts` to customize your email text contents.

## Testing
**Steps**

1. Make sure you are in the functions directory

2. Serve the function locally
    ```bash
    npm run serve
    ```
    This will display the local endpoints for testing similar to the console output below:

    ```bash
    functions: Loaded functions definitions from source: sendEmail, sendText.
    functions[us-central1-sendEmail]: http function initialized (http://127.0.0.1:5001/your-project/us-central1/sendEmail).
    functions[us-central1-sendText]: http function initialized (http://127.0.0.1:5001/your-project/us-central1/sendText).
    ```

3. Use Postman or equivalent tool. Make sure to use only dummy API keys when testing. Default value is **test123**. You can change this in `functions/src/helpers/validate-request.ts`. See the **Usage** section below for specifics on how to test the function.

    **DO NOT** test with production API keys!

## Deployment

Deploy your Cloud Function to Firebase using the Firebase CLI:

```bash
firebase deploy --only functions
```

## Usage
### API Key
Make sure to include in your Headers **x-api-key** with a value that corresponds to your Production or Test API Key as the case may be.

### Email
To invoke the function, send a **POST** request to the email function's URL with a JSON payload containing name, email, and message. The function will then send an email to a designated address with the provided information.

#### Payload
```json
    {
        "name": "John Doe",
        "email": "johndoe@example.com",
        "message": "This is an automated email ..."
    }
```

### SMS Text Message
To invoke the function, send a **POST** request to the SMS function's URL with a JSON payload below.
#### Notes
1. Do not exceed message character limit. Check Twilio policy for up-to-date details
2. Make sure phone number is valid E.164 format

#### Payload
```json
    {
        "smsMessage": "Hi John\nYour discount code is\nSUMMER20",
        "phoneNumber": "+15554443210",
    }
```
