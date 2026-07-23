"""
Portfolio contact form backend.

Receives a POST request from your contact form (name, email, message)
and emails it to you via SMTP (Gmail by default).

Run locally:
    pip install -r requirements.txt
    cp .env.example .env      # then fill in your real values
    python app.py

The server starts at http://localhost:5000
"""

import os
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Only allow requests from your actual site once it's live.
# Add your deployed domain here, e.g. "https://francischege.com"
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
CORS(app, origins=ALLOWED_ORIGINS)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")          # the Gmail address sending the email
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")  # a Gmail App Password, not your normal password
RECEIVING_EMAIL = os.getenv("RECEIVING_EMAIL", SMTP_USER)  # where messages land

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@app.route("/send-message", methods=["POST"])
def send_message():
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()
    subject = (data.get("subject") or "New message from portfolio contact form").strip()

    # --- basic validation ---
    if not all([name, email, message]):
        return jsonify({"ok": False, "error": "Name, email, and message are required."}), 400

    if not EMAIL_RE.match(email):
        return jsonify({"ok": False, "error": "That email address doesn't look valid."}), 400

    if not SMTP_USER or not SMTP_PASSWORD:
        app.logger.error("SMTP_USER / SMTP_PASSWORD not configured.")
        return jsonify({"ok": False, "error": "Server email is not configured yet."}), 500

    try:
        _send_email(name, email, subject, message)
    except Exception:
        app.logger.exception("Failed to send email")
        return jsonify({"ok": False, "error": "Could not send your message. Please try again later."}), 500

    return jsonify({"ok": True, "message": "Message sent successfully."})


def _send_email(name: str, sender_email: str, subject: str, message: str) -> None:
    email_msg = MIMEMultipart()
    email_msg["From"] = SMTP_USER
    email_msg["To"] = RECEIVING_EMAIL
    email_msg["Reply-To"] = sender_email  # lets you hit "reply" and answer them directly
    email_msg["Subject"] = f"Portfolio contact: {subject}"

    body = (
        f"New message from your portfolio contact form:\n\n"
        f"Name: {name}\n"
        f"Email: {sender_email}\n\n"
        f"Message:\n{message}\n"
    )
    email_msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, RECEIVING_EMAIL, email_msg.as_string())


if __name__ == "__main__":
    app.run(debug=True, port=5000)
