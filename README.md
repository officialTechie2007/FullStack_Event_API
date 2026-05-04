#  Role-Based Event Management System (FastAPI)

A fully functional and scalable backend API built with FastAPI, implementing secure JWT-based authentication and role-based access control (RBAC) for Admin and User roles.
Designed following modern backend best practices, the API ensures security, modularity, and performance, making it suitable for real-world production use cases.

##  Overview

This project allows:

* Users to register with **email verification (OTP)**
* Login using JWT authentication
* Register for events
* Admins to manage events, registrations, attendance, and export data

Built with a focus on **security, scalability, and real-world backend practices**.


##  Key Features

###  Authentication Flow

1. User Signup
   → POST /signup
   → User provides name, email, password
   → OTP is generated & sent (email)

2. OTP Verification
   → POST /verify
   → User submits OTP
   → Account gets activated

3. Resend OTP (if needed)
   → POST /resend-otp
   → New OTP sent to user email

4. Login
   → POST /login
   → User submits email & password
   → Server validates credentials
   → JWT Access Token is generated

5. Access Protected Routes
   → GET /protected
   → User sends JWT token in Authorization header
   → Server verifies token
   → Access granted if valid

6. Forgot Password
   → POST /forgot-password
   → OTP sent to email

7. Reset Password
   → POST /reset-password
   → User submits OTP + new password
   → Password updated securely


###  User Flow(Normal user)
1. View Events
   → GET /events
   → Fetch all available events

2. View Events in Table Format
   → GET /events-table
   → Structured/tabular event data

3. Register for Event
   → POST /register/{event_id}
   → Requires JWT Token
   → User registers for selected event

4. Get User Profile
   → GET /me
   → Returns logged-in user details


### Admin Flow

(Admin Authentication Required)

1. Create Event
   → POST /admin/create-event
   → Admin creates new event

2. Get All Users
   → GET /admin/users
   → Fetch all registered users

3. Delete Event
   → DELETE /admin/delete-event/{event_id}
   → Remove an event

4. Get All Registrations
   → GET /admin/registrations
   → View all event registrations

5. Get Registrations by Event
   → GET /admin/registrations/{event_id}
   → Filter registrations per event

6. Filter Events by Date
   → GET /admin/events-by-date
   → Retrieve events based on date

7. Export Registrations (CSV)
   → GET /admin/export
   → Download registration data as CSV

8. Mark Attendance
   → PUT /admin/mark-attendance/{registration_id}
   → Mark a user as attended

9. View Attendance
   → GET /admin/attendance
   → View attendance records

10. Get Only Attended Users
    → GET /admin/attended
    → Filter attended participants


Token Usage
Authorization Header Format:

Authorization: Bearer <your_jwt_token>


## Tech Stack

- Backend: FastAPI  
- Database: SQLite  
- ORM: SQLAlchemy  
- Authentication: JWT (python-jose)  
- Password Hashing: Passlib  
- API Testing: Swagger UI  
- Data Export: Pandas  
- Passlib (Password Hashing)
- SMTP (Email OTP System)
- Pydantic
- Python-dotenv


## Database Schema

### Users
- id, name, email, password, role  

### Events
- id, title, date, location  

### Registrations
- id, user_id, event_id  



## Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/Event_Management_API.git
cd Event_Management_API
```

### 2️⃣ Setup Backend

```bash
cd backend
python -m venv venv
```

**Activate virtual environment:**
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

**Install Dependencies:**
```bash
pip install -r requirements.txt
```

**Setup `.env` File:**
Create a `.env` file in the `backend` directory:
```env
EMAIL=your_email@gmail.com
EMAIL_PASS=your_app_password
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
```

**Run Backend Server:**
```bash
uvicorn main:app --reload
```
API runs on `http://127.0.0.1:8000` (Docs: `http://127.0.0.1:8000/docs`)

### 3️⃣ Setup Frontend

Open a new terminal window:
```bash
cd frontend
npm install
```

**Run Frontend Development Server:**
```bash
npm run dev
```
The frontend will start at `http://localhost:5173` and will automatically proxy API requests to the backend.

##  Authentication Flow

```
Signup → OTP Verification → Login → Authorize → Access Protected APIs
```

##  Special Features

### 📧 Email OTP Verification

* OTP is sent to user email during signup
* Includes expiry time and resend option
* Ensures only valid users can register
* Forget Password and Reset Password


### 📄 CSV Export (Admin Feature)

* Admin can export all registrations as CSV
* Useful for reporting and analytics
* Can be opened in Excel / Google Sheets


## 📁 Project Structure


EventFlow/
│
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── models.py
│   ├── database.py
│   ├── requirements.txt
│   ├── .env.example
│   └── event.db
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── layouts/
    │   ├── pages/
    │   ├── routes/
    │   └── services/
    ├── package.json
    └── vite.config.js



## Security Features

* Password hashing (`pbkdf2_sha256`)
* JWT token-based authentication
* Role-based access control
* Environment variable security (.env)
* OTP-based email verification


##  Important Notes

* `.env` file is not included (security reason)
* Use `.env.example` as reference
* Gmail App Password is required for email functionality


##  Author

Akinchan Nayek


