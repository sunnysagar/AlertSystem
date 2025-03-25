from fastapi import FastAPI, WebSocket, BackgroundTasks
import random
import asyncio
import smtplib
import pandas as pd
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.database import original_collection, info_collection
from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from bson import ObjectId

router = APIRouter()

# Constants
Window_Size = 500
check_interval = 2 # seconds

async def fetch_latest_data():
    """Fetch data from the database asynchronously."""
    return await original_collection.find().sort("_id", -1).limit(Window_Size).to_list(length=Window_Size)



async def detect_anomalies():
    """Detect anomalies in the data and insert new batch records without overriding previous ones."""
    print("Starting anomaly detection...")

    # Fetch the latest batch (window size data)
    data = await fetch_latest_data()
    if not data:
        return

    df = pd.DataFrame(data)

    # Ensure the "Status" column exists
    if "Status" not in df.columns:
        df["Status"] = 0  # Default status

    # Example anomaly marking logic (marking every alternate row)
    df.loc[df.index % 2 == 0, "Status"] = 1  

    # Assign a new unique ObjectId to each record before inserting
    df["_id"] = [ObjectId() for _ in range(len(df))]

    # Convert DataFrame to list of dictionaries (MongoDB format)
    records = df.to_dict(orient="records")

    # Bulk insert the entire batch for efficiency
    if records:
        await info_collection.insert_many(records)  # Fast batch insert

    print(f"Anomaly detection complete. Inserted {len(records)} records.")

    # print(f"Anomaly detection complete. Inserted {len(records)} records.")

def send_email_alert():
    """Send an email alert when an anomaly is detected."""
    sender_email = "your_email@gmail.com"
    receiver_email = "receiver_email@gmail.com"
    password = "your_email_password"
    
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = "Anomaly Detected!"
    body = "An anomaly was detected in the latest data window. Please check the system."
    message.attach(MIMEText(body, "plain"))
    
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
        print("Email alert sent successfully.")
    except Exception as e:
        print(f"Failed to send email: {e}")



async def monitor_data():
    """Continuously monitor data and trigger anomaly detection."""
    while True:
        try:
            await detect_anomalies()
            # send_email_alert()
            await asyncio.sleep(check_interval)
        except Exception as e:
            print("some error ")
            print(f"An error occurred: {e}")
            await asyncio.sleep(check_interval)

async def websocket_endpoint(websocket: WebSocket):
    """WebSocket connection for real-time anomaly updates."""
    await websocket.accept()
    while True:
        data = await get_anomalies()
        await websocket.send_json(data)
        await asyncio.sleep(2)


async def get_anomalies():
    cursor = info_collection.find().sort("_id", -1).limit(10)
    records = await cursor.to_list(length=10)

    # Convert ObjectId to string for JSON serialization
    for record in records:
        record["_id"] = str(record["_id"])

    return jsonable_encoder(records)  # Ensure FastAPI can serialize the response