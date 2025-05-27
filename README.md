# Serverless Email API with Optional Next.js UI (Across The Globe Task)

A serverless REST API on Google Cloud Functions that sends emails via SendGrid, with an optional Next.js UI for the Across The Globe task.

## Overview
This project fulfills the Across The Globe task requirements:
- **Serverless.com Account**: Used Serverless Framework (v3.40.0).
- **Offline Setup**: Flask-based `test_server.py` for local testing.
- **REST API**: Deployed on GCP at `https://us-central1-lone-461009.cloudfunctions.net/email-api-dev-sendEmail`.
- **Email Sending**: Sends emails via SendGrid to `enigmasrealm77@gmail.com` (demo).
- **Bonus UI**: Optional Next.js UI with `shadcn` components and `sonner` toasts, runs locally.
- **Showcase**: Shared on Serverless community and blog platforms.

**Note**: Used GCP due to AWS payment constraints. Gmail sender verified; custom domain recommended for production to avoid DMARC issues.

## Backend
- **Framework**: Serverless Framework with `serverless-google-cloudfunctions`.
- **Files**:
  - `serverless.yml`: Configures GCP deployment.
  - `main.py`: API endpoint with CORS for UI.
  - `send_email.py`: SendGrid email logic.
  - `test_server.py`: Flask for offline testing.
- **Endpoint**: `POST /send` at `https://us-central1-lone-461009.cloudfunctions.net/email-api-dev-sendEmail`.
- **Payload**:
  ```json
  {
    "receiver_email": "enigmasrealm77@gmail.com",
    "subject": "Test Email",
    "body_text": "Hello from Serverless!"
  }
  ```
- **Error Handling**: Returns 400 for missing fields, 500 for server errors.

## UI (Optional)
- **Framework**: Next.js with TypeScript, `shadcn` components, and `sonner` toasts.
- **Location**: `ui/` folder.
- **Features**: Form to input `receiver_email`, `subject`, and `body_text`, with validation and toasts.
- **Runs**: Locally at `http://localhost:3000`.
- **Calls**: Backend API via `fetch`.

## Setup Instructions
### Backend
1. **Install Serverless**:
   ```bash
   npm install -g serverless
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   - Create `.env`:
     ```
     SENDER_EMAIL=your-email@gmail.com
     SENDGRID_API_KEY=your-sendgrid-api-key
     ```
   - Add GCP service account key as `lone-461009-06de97721e9a.json`.
4. **Deploy**:
   ```bash
   serverless deploy
   ```
5. **Run Offline**:
   ```bash
   python test_server.py
   ```
   - Test:
     ```bash
     curl -X POST http://localhost:3000/send -H "Content-Type: application/json" -d '{"receiver_email":"enigmasrealm77@gmail.com","subject":"Test","body_text":"Hello"}'
     ```

### UI (Optional)
1. **Navigate to UI**:
   ```bash
   cd ui
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Locally**:
   ```bash
   npm run dev
   ```
   - Open `http://localhost:3000`.

### Running Without UI
To run only the backend without the UI:
1. **Remove UI Folder**:
   ```bash
   rm -rf ui
   ```
2. **Replace Files**:
   - **main.py**: Use the original version (no CORS):
     ```python
     import json
     from sendgrid import SendGridAPIClient
     from sendgrid.helpers.mail import Mail
     import os

     def send_email(request):
         try:
             request_json = request.get_json(silent=True)
             if not request_json:
                 return json.dumps({'error': 'Invalid JSON'}), 400

             receiver_email = request_json.get('receiver_email')
             subject = request_json.get('subject')
             body_text = request_json.get('body_text')

             if not all([receiver_email, subject, body_text]):
                 return json.dumps({'error': 'Missing required fields: receiver_email, subject, body_text'}), 400

             message = Mail(
                 from_email=os.environ['SENDER_EMAIL'],
                 to_emails=receiver_email,
                 subject=subject,
                 plain_text_content=body_text
             )

             try:
                 sg = SendGridAPIClient(os.environ['SENDGRID_API_KEY'])
                 response = sg.send(message)
                 return json.dumps({
                     'message': 'Email sent successfully',
                     'status': response.status_code
                 }), 200
             except Exception as e:
                 return json.dumps({'error': f'Failed to send email: {str(e)}'}), 500
         except Exception as e:
             return json.dumps({'error': f'Server error: {str(e)}'}), 500
     ```
   - **serverless.yml**: Use the original version (no UI exclusions):
     ```yaml
     service: email-api
     frameworkVersion: '3'
     useDotenv: true

     provider:
       name: google
       runtime: python38
       project: lone-461009
       credentials: C:\Users\gugul\Downloads\Serverless_project_new\email-api\lone-461009-06de97721e9a.json
       region: us-central1
       environment:
         SENDER_EMAIL: ${env:SENDER_EMAIL}
         SENDGRID_API_KEY: ${env:SENDGRID_API_KEY}

     plugins:
       - serverless-google-cloudfunctions
       - serverless-dotenv-plugin
       - serverless-offline

     functions:
       sendEmail:
         handler: send_email
         events:
           - http: /send
     ```
3. **Deploy**:
   ```bash
   serverless deploy
   ```

## Showcase
- **GitHub**: [https://github.com/LaZy-Wolf/serverless-email-api](https://github.com/LaZy-Wolf/serverless-email-api)
- **Blog Post**: [Medium/Dev.to link] (add after publishing).
- **Serverless Community**: Shared on [serverless.com/community](https://www.serverless.com/community).

## Notes
- **GCP Choice**: AWS payment issues led to GCP usage.
- **DMARC**: Gmail sender (`enigmasrealm77@gmail.com`) verified. Use a custom domain for production.
- **Bonus Points**: Added optional UI and community showcase.
