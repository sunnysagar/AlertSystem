"""
This module defines the routes and dependencies for user-related operations in the AlertBackend application.
Routes:
    - GET /profile: Retrieves the profile information of the currently authenticated user.
Dependencies:
    - get_current_user: A dependency that extracts and validates the current user from the provided JWT token.
Functions:
    - get_current_user(token: str): Decodes the JWT token to extract the user's email, validates the token, 
      and retrieves the user from the database.
    - get_profile(user: dict): Returns the profile information (name, department, email) of the authenticated user.
Modules and Libraries:
    - fastapi: Used for creating API routes and handling dependencies.
    - jose: Used for decoding and validating JWT tokens.
    - pymongo: Used for interacting with the MongoDB database.
    - app.database: Contains the MongoDB collection for users.
    - app.JWT.jwtSecurity: Contains the JWT security configurations (SECRET_KEY, ALGORITHM).
"""
from fastapi import APIRouter, Depends, HTTPException
from app.JWT.jwtSecurity import SECRET_KEY, ALGORITHM
from jose import JWTError, jwt
from app.database import users_collection
from app.auth.auth import oauth2_scheme, get_current_user
import pymongo
from fastapi.security import OAuth2PasswordBearer

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

router = APIRouter()

# async def get_current_use(token: str = Depends(oauth2_scheme)):
#     """
#     Retrieve the current user based on the provided JWT token.
#     This function decodes the JWT token to extract the user's email and fetches
#     the corresponding user data from the database. If the token is invalid or
#     the user cannot be found, an HTTP exception is raised.
#     Args:
#         token (str): The JWT token provided by the client, extracted using the
#                      `Depends` mechanism with `oauth2_scheme`.
#     Returns:
#         dict: The user document retrieved from the database.
#     Raises:
#         HTTPException: If the token is invalid or the user cannot be found.
#     """

#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email: str = payload.get("sub")
#         if email is None:
#             raise HTTPException(status_code=401, detail="Invalid token")
#         user = await users_collection.find_one({"email": email})
#         return user
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/profile")
async def get_profile(user: dict = Depends(get_current_user)):
    """
    Retrieve the profile information of the currently authenticated user.
    Args:
        user (dict): A dictionary containing the current user's information, 
                     provided by the `get_current_user` dependency.
    Returns:
        dict: A dictionary containing the user's name, department, and email.
    """

    return{"name": user["name"], "department": user["department"], "email": user["email"]}
