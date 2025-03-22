"""
This module provides functionality for creating JSON Web Tokens (JWT) for secure authentication.
Functions:
    create_access_token(data: dict, expires_delta: timedelta = None) -> str:
        Generates a JWT access token with the provided data and expiration time.
Constants:
    SECRET_KEY: str
        The secret key used to sign the JWT.
    ALGORITHM: str
        The algorithm used for encoding the JWT.
    ACCESS_TOKEN_EXPIRE_MINUTES: int
        The default expiration time for the access token in minutes.
"""

from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt

SECRET_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTc0MjI4NzE5MiwiaWF0IjoxNzQyMjg3MTkyfQ.TA0n4X08kthLQtMEuRiW9rcO9aHnGaqZFjoxvc-HrDE"
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Generates a JSON Web Token (JWT) for the given data with an optional expiration time.
    Args:
        data (dict): The payload data to encode into the JWT.
        expires_delta (timedelta, optional): The duration for which the token is valid. 
            If not provided, a default expiration time is used.
    Returns:
        str: The encoded JWT as a string.
    """

    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
