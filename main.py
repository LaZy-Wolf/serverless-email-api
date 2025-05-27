import json
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os

def send_email(request):
    # Enable CORS
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }

    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return ('', 204, headers)

    try:
        request_json = request.get_json(silent=True)
        if not request_json:
            return (json.dumps({'error': 'Invalid JSON'}), 400, headers)

        receiver_email = request_json.get('receiver_email')
        subject = request_json.get('subject')
        body_text = request_json.get('body_text')

        if not all([receiver_email, subject, body_text]):
            return (json.dumps({'error': 'Missing required fields: receiver_email, subject, body_text'}), 400, headers)

        message = Mail(
            from_email=os.environ['SENDER_EMAIL'],
            to_emails=receiver_email,
            subject=subject,
            plain_text_content=body_text
        )

        try:
            sg = SendGridAPIClient(os.environ['SENDGRID_API_KEY'])
            response = sg.send(message)
            return (json.dumps({
                'message': 'Email sent successfully',
                'status': response.status_code
            }), 200, headers)
        except Exception as e:
            return (json.dumps({'error': f'Failed to send email: {str(e)}'}), 500, headers)
    except Exception as e:
        return (json.dumps({'error': f'Server error: {str(e)}'}), 500, headers)