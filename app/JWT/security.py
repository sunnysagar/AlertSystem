"""
This module provides utility functions for hashing and verifying passwords
using the Argon2 hashing algorithm from the `passlib` library.
Functions:
    hash_password(password: str) -> str:
        Hashes a plain text password using the Argon2 algorithm and returns
        the hashed password as a string.
    verify_password(plain_password: str, hashed_password: str) -> bool:
        Verifies a plain text password against a previously hashed password
        using the Argon2 algorithm. Returns True if the password matches,
        otherwise False.
"""

from passlib.hash import argon2

def hash_password(password: str) -> str:
    """
    Hashes a plaintext password using the Argon2 algorithm.
    Args:
        password (str): The plaintext password to be hashed.
    Returns:
        str: The hashed password as a string.
    """

    return argon2.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies whether a plain text password matches a hashed password.
    Args:
        plain_password (str): The plain text password to verify.
        hashed_password (str): The hashed password to compare against.
    Returns:
        bool: True if the plain password matches the hashed password, False otherwise.
    """

    return argon2.verify(plain_password, hashed_password)
