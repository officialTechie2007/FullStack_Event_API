from datetime import datetime, timedelta
from jose import jwt,JWTError
from passlib.context import CryptContext

import random

SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"

# 🔥 CHANGE HERE
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=2)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
# ADD THIS FUNCTION
def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
#EXTRA
def generate_otp():
    return str(random.randint(100000, 999999))
   