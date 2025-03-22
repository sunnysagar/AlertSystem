"""
This module defines the data models for user-related operations using Pydantic.
Classes:
    User:
        Represents a user with attributes such as `id`, `name`, `department`, `email`, and `password`.
        - `id` (Optional[str]): The MongoDB `_id` field, optional.
        - `name` (str): The name of the user.
        - `department` (Optional[str]): The department of the user, optional.
        - `email` (EmailStr): The email address of the user, validated as a proper email format.
        - `password` (str): The password of the user.
    UserSignup:
        Extends the `User` model to include an additional `confirm_password` field for user signup.
        - `confirm_password` (str): The password confirmation field.
    UserLogin:
        Represents the data required for a user login operation.
        - `email` (EmailStr): The email address of the user, validated as a proper email format.
        - `password` (str): The password of the user.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from bson import ObjectId

class User(BaseModel):
    """
    User model representing a user in the system.
    Attributes:
        id (Optional[str]): The unique identifier for the user, corresponding to the MongoDB `_id` field. This field is optional.
        name (str): The name of the user.
        department (Optional[str]): The department to which the user belongs. This field is optional.
        email (EmailStr): The email address of the user, validated as a proper email format.
        password (str): The password for the user account.
    """

    id: Optional[str] = None  # MongoDB `_id` field (optional)
    name: str
    department: Optional[str] = None
    email: EmailStr
    password: str

class UserSignup(User):
    """
    UserSignup class extends the User class to include an additional field for password confirmation.
    Attributes:
        confirm_password (str): A field to store the confirmation of the user's password.
    """

    confirm_password: str

class UserLogin(BaseModel):
    """
    UserLogin model represents the structure for user login data.
    Attributes:
        email (EmailStr): The email address of the user. Must be a valid email format.
        password (str): The password of the user.
    """

    email: EmailStr
    password: str
