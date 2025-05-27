from flask import Flask, request, jsonify
from send_email import send_email  # Your actual email sending function

app = Flask(__name__)

@app.route('/send', methods=['POST'])
def send():
    data = request.get_json()
    try:
        response = send_email(data)
        return jsonify({"message": "Email sent successfully!", "response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
