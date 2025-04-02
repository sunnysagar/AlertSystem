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
import os
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours (1440 minutes)

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
