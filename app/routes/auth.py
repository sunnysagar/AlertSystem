"""
This module defines the authentication routes for the FastAPI application.
Routes:
    - POST /register: Registers a new user by saving their details in the database.
    - POST /login: Authenticates a user and generates an access token.
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from app.JWT.security import verify_password, hash_password
from app.JWT.jwtSecurity import create_access_token
from app.database import users_collection
from app.models.userModel import User, UserLogin
import pymongo

router = APIRouter()


@router.post("/register")
async def register(user: User):
    """
    Registers a new user in the system.
    This function checks if a user with the given email already exists in the database.
    If the user does not exist, their password is hashed, and their details are stored
    in the database.
    Args:
        user (User): An instance of the User model containing the user's details.
    Returns:
        dict: A dictionary containing a success message.
    Raises:
        HTTPException: If a user with the given email already exists, an exception
        with status code 400 and a relevant error message is raised.
    """
     # ✅ Use `await` with `find_one` for async MongoDB

    existing_user = await users_collection.find_one({"email": user.email})
    
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user.password = hash_password(user.password)
    user_dict = user.dict()
    await users_collection.insert_one(user_dict)

    return {"message": "User registered successfully"}

@router.post("/login")
async def login(user_login: UserLogin):
    """
    Handles user login by verifying credentials and generating an access token.
    Args:
        user_login (UserLogin): An object containing the user's login credentials, 
                                including email and password.
    Returns:
        dict: A dictionary containing the access token and its type.
    Raises:
        HTTPException: If the user is not found or the password is invalid.
    """

    user = await users_collection.find_one({"email": user_login.email})
    
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(user_login.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    access_token = create_access_token({"sub": user["email"]}, timedelta(minutes=30))
    
    return {"access_token": access_token, "token_type": "bearer"}