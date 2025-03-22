"""
This module defines Pydantic models for user-related data structures.
Classes:
    UserCreate:
        Represents the data required to create a new user.
        Attributes:
            email (EmailStr): The email address of the user.
            username (str): The username of the user.
            password (str): The password for the user account.
    UserResponse:
        Represents the data returned in response to user-related queries.
        Attributes:
            id (str): The unique identifier of the user.
            name (str): The name of the user.
            department (Optional[str]): The department the user belongs to (if any).
            email (EmailStr): The email address of the user.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    department: Optional[str]
    email: EmailStr
