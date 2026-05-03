import os
from dotenv import load_dotenv

load_dotenv()

SENDER_EMAIL = os.getenv("EMAIL")
APP_PASSWORD = os.getenv("EMAIL_PASS")

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES=os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

print(SENDER_EMAIL)
print(APP_PASSWORD)

print(SECRET_KEY)
print(ALGORITHM)
print(ACCESS_TOKEN_EXPIRE_MINUTES)

'''
def send_email(to_email, otp):
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()

    server.login(SENDER_EMAIL, APP_PASSWORD)

    message = f"Subject: OTP\n\nYour OTP is {otp}"
    server.sendmail(SENDER_EMAIL, to_email, message)

    server.quit()
'''