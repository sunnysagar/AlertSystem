from fastapi import FastAPI, WebSocket, BackgroundTasks
import random
import asyncio
import smtplib
import pandas as pd
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.database import original_collection, info_collection
from app.JWT.jwtSecurity import SECRET_KEY, ALGORITHM
from jose import JWTError, jwt
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()

# Constants
Window_Size = 500
check_interval = 2 # seconds

def fetch_latest_data():
    """Fetch data from the database."""
    data = []
    for record in original_collection.find().sort("_id", -1).limit(Window_Size):
        data.append(record)
    return data

def detect_anomalies(data):
    """Detect anomalies in the data and update MongoDB."""
    print("Starting anomaly detection...")
    data = fetch_latest_data()
    if not data:
        return
    
    df = pd.DataFrame(data)
    if "Status" not in df.columns:
        df["Status"] = 0  # Default status
    
    df.loc[df.index % 2 == 0, "Status"] = 1  # Mark every alternate window as an anomaly
    
    # Update MongoDB with anomalies
    for record in df.to_dict(orient="records"):
        info_collection.replace_one({"_id": record["_id"]}, record, upsert=True)
    
    print("Anomaly detection complete.")

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
        detect_anomalies()
        send_email_alert()
        await asyncio.sleep(check_interval)

async def websocket_endpoint(websocket: WebSocket):
    """WebSocket connection for real-time anomaly updates."""
    await websocket.accept()
    while True:
        data = get_anomalies()
        await websocket.send_json(data)
        await asyncio.sleep(2)

# @app.on_event("startup")
async def startup_event():
    """Start background monitoring on server start."""
    asyncio.create_task(monitor_data())

# @app.get("/fetch_anomalies")
def get_anomalies():
    """Fetch the latest anomalies from MongoDB."""
    return list(info_collection.find().sort("_id", -1).limit(10))