#LINK SECTION
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User
from auth import hash_password, verify_password, create_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth import decode_token
from models import Event,Registration
#for CSV file export
import pandas as pd
from fastapi.responses import FileResponse

from fastapi.responses import HTMLResponse

from datetime import date
from datetime import datetime, timedelta #EXTRA

import smtplib  #for email sender EXTRA
from auth import generate_otp #EXTRA

from fastapi import FastAPI
import os
import smtplib
from dotenv import load_dotenv
import random
from email.message import EmailMessage
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()  #LOAD VARIABLE FROM .env file

SENDER_EMAIL = os.getenv("EMAIL")   #ENVORONMENT VARIABLE
APP_PASSWORD = os.getenv("EMAIL_PASS") #ENVORONMENT VARIABLE

#app = FastAPI() 

#Swagger heading change (TITLE),FastAPI() constructor call with arguments 

app = FastAPI(title="Role-Based Event Management System using FastAPI",
    description="This API allows users to register, login, view events and allows admins to manage events and registrations.",
    version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Create database tables from all models(user,event,registration) defined in models.py file
Base.metadata.create_all(bind=engine)

# DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload


def admin_only(user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user.get("user_id")).first()

    if db_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return db_user

import threading  # for background email sending

#EMAIL SENDER (Gmail → always use 16 digit App password of sender email)
def _send_email_sync(to_email, body, subject="OTP"):
    """Internal function that actually sends the email (runs in background thread)."""
    if not SENDER_EMAIL or not APP_PASSWORD:
        print(f"\n{'='*40}")
        print(f"📧 MOCK EMAIL SENT (No .env credentials found)")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"Message: {body}")
        print(f"{'='*40}\n")
        return
        
    try:
        msg = EmailMessage()
        msg.set_content(body)
        msg['Subject'] = subject
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email

        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=10)  # 10 second timeout
        server.starttls()
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"✅ Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")

def send_email(background_tasks: BackgroundTasks, to_email, body, subject="OTP"):
    """Send email in a background task so it doesn't block the API response."""
    background_tasks.add_task(_send_email_sync, to_email, body, subject)

@app.get("/test-email", tags=["🔧 DEBUG"], summary="Test Email Sending")
def test_email_endpoint(to_email: str):
    """Debug endpoint to test email sending and see the exact error."""
    if not SENDER_EMAIL or not APP_PASSWORD:
        return {"status": "error", "message": "EMAIL or EMAIL_PASS environment variables are missing on the server!"}
    
    try:
        msg = EmailMessage()
        msg.set_content("This is a test email from the Render deployment.")
        msg['Subject'] = "Test Email"
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email

        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=10)
        server.starttls()
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return {"status": "success", "message": f"Email sent successfully to {to_email}"}
    except Exception as e:
        return {"status": "error", "message": f"Failed to send email: {str(e)}"}



#==================================AUTH PANEL=======================
#The endpoint SIGNUP FOR USER AND ADMIN
# Role user and admin both can be input(default role user)
#===================================================================
@app.post("/signup",tags=["🔐 AUTH PANEL"], summary="User Signup")
def signup(
    name: str,
    email: str,
    password: str,
    background_tasks: BackgroundTasks,
    role: str = "user",   # 🔥 default role
    db: Session = Depends(get_db)
):
    # validate role
    if role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Role must be user or admin")

    # check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
        
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    otp = generate_otp() #EXTRA
    expiry = datetime.utcnow() + timedelta(minutes=5)
    # create new temporary user
    new_user = User(
        name=name,
        email=email,
        password=hash_password(password),
        role=role,
        otp=otp, #EXTRA
        otp_expiry=expiry #EXTRA
    )

    db.add(new_user)
    db.commit()
     #SAFE EMAIL CALL
    try:
        background_tasks.add_task(_send_email_sync, email, f"Your OTP is {otp}", "OTP for Signup") #Here email is the receiver's email
    except Exception as e: 
        print("Email error:", e)
        
    return {
        "message": f"{role} created successfully ,verify OTP",
        "user": {
            "name": name,
            "email": email,
            "role": role
        }
    }

#This endpoint is for OTP Verification
@app.post("/verify",tags=["🔐 AUTH PANEL"], summary="Verify OTP")
def verify(email: str, otp: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.otp != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if datetime.utcnow() > user.otp_expiry:
        raise HTTPException(status_code=400, detail="OTP expired")
    user.is_verified = True
    user.otp = None
    user.otp_expiry = None
    db.commit()

    return {"message": "Email verified successfully"}

#This endpoint is to Reset OTP
@app.post("/resend-otp", tags=["🔐 AUTH PANEL"], summary="Resend OTP")
def resend_otp(email: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = generate_otp()
    expiry = datetime.utcnow() + timedelta(minutes=1)
    user.otp = otp
    user.otp_expiry = expiry
    db.commit()
    background_tasks.add_task(_send_email_sync, email, f"Your OTP is {otp}", "New OTP")

    return {"message": "New OTP sent"}

#This endpoint for forget password
@app.post("/forgot-password", tags=["🔐 AUTH PANEL"])
def forgot_password(email: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # generate token
    token = str(random.randint(100000, 999999))
    expiry = datetime.utcnow() + timedelta(minutes=10)
    user.reset_token = token
    user.reset_token_expiry = expiry
    db.commit()
    # send email
    background_tasks.add_task(_send_email_sync, email, f"Your password reset OTP is {token}", "Password Reset OTP")

    return {"message": "Reset OTP sent to email"}

#This endpoint to Reset Password
@app.post("/reset-password", tags=["🔐 AUTH PANEL"])
def reset_password(email: str, token: str, new_password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.reset_token != token:
        raise HTTPException(status_code=400, detail="Invalid token")
    if datetime.utcnow() > user.reset_token_expiry:
        raise HTTPException(status_code=400, detail="Token expired")

    #update password
    user.password = hash_password(new_password)

    #clear token
    user.reset_token = None
    user.reset_token_expiry = None

    db.commit()

    return {"message": "Password reset successful"}

#==============This endpoint LOGIN FOR USER AND ADMIN==================

@app.post("/login",tags=["🔐 AUTH PANEL"], summary="User Login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    #THIS PART IS FOR EMAIL VERIFICATION , EXTRA
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified. Please verify OTP first.")
    
    token = create_token({
        "user_id": user.id,
        "role": user.role,
        "name": user.name,
        "email": user.email
    })

    return {"access_token": token}


#===========This endpoint is for PROTECTED ROUTE means for authorization=============

@app.get("/protected",tags=["🔐 AUTH PANEL"],summary="Verify Authorization using token")
def protected(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    return {"message": "You are authorized 🔐"}

#==========================USER PANEL STARTS FROM HERE===================
#================This endpoint is for viewing all Available Events=======

@app.get("/Events", tags=["👤 USER PANEL"],summary="View Events",description="Retrieve all available events in a structured format")
def get_events(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    return {
        "columns": ["ID", "Title", "Date", "Location"],
        "data": [
            {
                "ID": e.id,
                "Title": e.title,
                "Date": e.date,
                "Location": e.location
            }
            for e in events
        ]
    }

#==============================================================================
#This endpoint is for viewing events in HTML table format from Browser directly.
# use (http://127.0.0.1:8001/events-table)
#==============================================================================

@app.get("/events-table",tags=["👤 USER PANEL"],response_class=HTMLResponse,summary="View data in a table")
def events_table(db: Session = Depends(get_db)):
    events = db.query(Event).all()

    html = """
    <h2>Event List</h2>
    <table border="1">
    <tr><th>ID</th><th>Title</th><th>Date</th><th>Location</th></tr>
    """

    for e in events:
        html += f"<tr><td>{e.id}</td><td>{e.title}</td><td>{e.date}</td><td>{e.location}</td></tr>"

    html += "</table>"
    return html

#============This endpoint is to REGISTER FOR EXISTING EVENT by the USER===================

@app.post("/register/{event_id}",tags=["👤 USER PANEL"],summary="Register for Event")
def register_event(
    event_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("user_id")

    # check duplicate registration
    existing = db.query(Registration).filter(
        Registration.user_id == user_id,
        Registration.event_id == event_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already registered")

    registration = Registration(user_id=user_id, event_id=event_id)
    db.add(registration)
    db.commit()

    return {"message": "Registered successfully"}

#============The /me endpoint returns the currently authenticated
# user’s details using the JWT token.============================

@app.get("/me", tags=["👤 USER PANEL"], summary="Get Current User Info")
def get_me(
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.id == user.get("user_id")).first()

    return {
        "id": db_user.id,
        "name": db_user.name,
        "email": db_user.email,
        "role": db_user.role
    }

#==================ADMIN PANEL STARTS FROM HERE===================================

#==================EVENT CREATION BY ADMIN==========================================

@app.post("/admin/create-event",tags=["👑 ADMIN PANEL"],summary="Create Event (Admin)")
def admin_create_event(
    title: str,
    date: str,
    location: str,
    admin=Depends(admin_only),
    db: Session = Depends(get_db)
):
    event = Event(title=title, date=date, location=location)
    db.add(event)
    db.commit()
    return {"message": "Event created by admin"}

#===================VIEW ALL USERS BY ADMIN=========================

@app.get("/admin/users",tags=["👑 ADMIN PANEL"])
def get_all_users(
    admin=Depends(admin_only),
    db: Session = Depends(get_db)
):
    #return db.query(User).all()
    db_user=db.query(User).all()
    
    return [
    {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }
    for user in db_user
]
    
#=================DELETE AN EVENT BY ADMIN========================

@app.delete("/admin/delete-event/{event_id}", tags=["👑 ADMIN PANEL"])
def delete_event(
    event_id: int,
    admin = Depends(admin_only),
    db: Session = Depends(get_db)
):
    # event exist check
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()

    return {"message": "Event deleted successfully"}

#===================VIEW ALL REGISTRATION DETAILS  BY ADMIN===================

@app.get("/admin/registrations",tags=["👑 ADMIN PANEL"])
def get_all_registrations(
    admin=Depends(admin_only),
    db: Session = Depends(get_db)
):
    return db.query(Registration).all()

#===========fILTER REGISTRATION(ADMIN CAN FILTER EVENT WISE REGISTRATION)===========

@app.get("/admin/registrations/{event_id}",tags=["👑 ADMIN PANEL"])
def get_registrations_by_event(
    event_id: int,
    admin=Depends(admin_only),
    db: Session = Depends(get_db)
):
    data = db.query(Registration).filter(Registration.event_id == event_id).all()
    return data


#==============ADMIN CAN VIEW DATEWISE EVENT LIST===========================

from datetime import date
from fastapi import Query

@app.get("/admin/events-by-date", tags=["👑 ADMIN PANEL"], summary="Filter Events by Date")
def events_by_date(
    date: date = Query(..., description="YYYY-MM-DD"),
    admin=Depends(admin_only),
    db: Session = Depends(get_db)
):
    #return db.query(Event).filter(Event.date == str(date)).all()
    formatted_date = date.strftime("%d-%m-%Y")  # convert as dd-mm-yyyy(DB format)
    events = db.query(Event).filter(Event.date == formatted_date).all()
    
    if not events:
        return {"message": "No events found for this date"}

    return events

#=================EXPORT REGISTRATION DETAILS AS CSF FILE========================

@app.get("/admin/export",tags=["👑 ADMIN PANEL"],summary="Export Registration details as CSV")
def export_csv(admin=Depends(admin_only), db: Session = Depends(get_db)):
    data = db.query(Registration).all()

    rows = []
    for r in data:
        rows.append({
            "user_id": r.user_id,
            "event_id": r.event_id
        })

    df = pd.DataFrame(rows)
    file_name = "registrations.csv"
    df.to_csv(file_name, index=False)
    return FileResponse(file_name, media_type='text/csv', filename=file_name)

#ADMIN CAN RECORD  WHETHER AN USER ATTAIN AN EVENT======================== 

@app.put("/admin/mark-attendance/{registration_id}",
         tags=["👑 ADMIN PANEL"],
         summary="Mark Attendance")
def mark_attendance(
    registration_id: int,
    attended: bool,
    admin=Depends(admin_only),
    db: Session = Depends(get_db)
):
    reg = db.query(Registration).filter(Registration.id == registration_id).first()

    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")

    reg.attended = attended
    db.commit()

    return {"message": "Attendance updated"}


#================THIS ENDPOINT FOR VIEWING FULL ATTENDANCE DATA================

@app.get("/admin/attendance",
         tags=["👑 ADMIN PANEL"],
         summary="View Attendance")
def view_attendance(
    admin=Depends(admin_only),
    db: Session = Depends(get_db)
):
    data = db.query(Registration).all()

    return [
        {
            "registration_id": r.id,
            "user_id": r.user_id,
            "event_id": r.event_id,
            "attended": r.attended
        }
        for r in data
    ]
#=====================VIEW ONLY ATTENDED USERS(only present users)===================

@app.get("/admin/attended",
         tags=["👑 ADMIN PANEL"],
         summary="Get Only Attended Users")
def attended_users(admin=Depends(admin_only), db: Session = Depends(get_db)):
    return db.query(Registration).filter(Registration.attended == True).all()

#==============EVENTWISE ATTENDANCE STATUS===================================

@app.get("/admin/event-stats")
def event_stats(admin=Depends(admin_only), db: Session = Depends(get_db)):
    total = db.query(Registration).count()
    attended = db.query(Registration).filter(Registration.attended == True).count()

    return {
        "total": total,
        "attended": attended,
        "percentage": (attended/total)*100 if total else 0
    }
