import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

def send_email(data):
    try:
        sender_email = os.getenv('SENDER_EMAIL')
        api_key = os.getenv('SENDGRID_API_KEY')

        if not sender_email or not api_key:
            raise ValueError("Missing SENDER_EMAIL or SENDGRID_API_KEY in environment variables")

        message = Mail(
            from_email=sender_email,
            to_emails=data['receiver_email'],
            subject=data['subject'],
            plain_text_content=data['body_text']
        )

        sg = SendGridAPIClient(api_key)
        response = sg.send(message)

        return {
            "status_code": response.status_code,
            "body": response.body.decode(),
            "headers": dict(response.headers)
        }

    except Exception as e:
        raise Exception(f"Failed to send email: {str(e)}")
