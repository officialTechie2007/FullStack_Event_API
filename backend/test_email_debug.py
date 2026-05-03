import smtplib
import os
from dotenv import load_dotenv
from email.message import EmailMessage

load_dotenv()

SENDER_EMAIL = os.getenv("EMAIL")
APP_PASSWORD = os.getenv("EMAIL_PASS")

print(f"Email: {SENDER_EMAIL}")
print(f"Pass length: {len(APP_PASSWORD) if APP_PASSWORD else 0}")

try:
    msg = EmailMessage()
    msg.set_content("This is a test email to verify credentials.")
    msg['Subject'] = "Test Email"
    msg['From'] = SENDER_EMAIL
    msg['To'] = SENDER_EMAIL

    print("Connecting to SMTP...")
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    print("Logging in...")
    server.login(SENDER_EMAIL, APP_PASSWORD)
    print("Sending message...")
    server.send_message(msg)
    server.quit()
    print("Email sent successfully!")
except Exception as e:
    print(f"Failed to send email: {str(e)}")
