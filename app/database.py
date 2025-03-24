"""
This module sets up the database connection and collections for the AlertBackend application.
Modules:
    - motor.motor_asyncio: Provides the AsyncIOMotorClient for asynchronous MongoDB operations.
    - fastapi: Used for building FastAPI applications (imported but not used in this module).
    - os: Provides functions to interact with the operating system (imported but not used in this module).
Constants:
    - MONGO_URL (str): The MongoDB connection string.
    - DB_NAME (str): The name of the database to connect to.
Attributes:
    - client (AsyncIOMotorClient): The MongoDB client instance for asynchronous operations.
    - database: The MongoDB database instance.
    - users_collection: The MongoDB collection for storing user data.
"""

from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "alert"

client = AsyncIOMotorClient(MONGO_URL)
database = client[DB_NAME]

users_collection = database.get_collection("users")

plc_collection = database.get_collection("plc_data")

original_collection = database.get_collection("originalDB")

info_collection = database.get_collection("infoDB")
