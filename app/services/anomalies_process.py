from fastapi import FastAPI, WebSocket, BackgroundTasks
import random
import asyncio
from starlette.websockets import WebSocketDisconnect
import smtplib
import pandas as pd
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.database import original_collection, info_collection
from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from app.auth.auth import oauth2_scheme
import httpx

router = APIRouter()

# Constants
Window_Size = 25
check_interval = 0.2 # seconds

# Window_Size = 500  # Adjust as needed
last_processed_id = None  # To track the last processed `_id`
last_sent_id = None  # Keep track of last sent _id
first_run = True   # flag to check to delete data in info data
fetch_count = 0
status = 0

async def fetch_latest_data():
    """Fetch new data from the database asynchronously."""
    global last_processed_id

    query = {}  # Default query (fetch latest if no last_processed_id)
    if last_processed_id:
        query = {"_id": {"$gt": last_processed_id}}  # Fetch new records only

    # Fetch new records sorted by `_id` in ascending order (oldest first)
    data = await original_collection.find(query).sort("_id", 1).limit(Window_Size).to_list(length=Window_Size)

    # Update the last processed ID
    if data:
        last_processed_id = data[-1]["_id"]

    return data

# async def detect_anomalies():
#     """Detect anomalies in the data and insert new batch records without overriding previous ones."""
#     global first_run

#     if first_run:
#         await info_collection.delete_many({})
#         first_run = False  # keep it false for 
         
#     print("Starting anomaly detection...")

#     # Fetch only new data
#     data = await fetch_latest_data()
#     if not data:
#         print("No new data to process.")
#         return

#     df = pd.DataFrame(data)

#     # Ensure the "Status" column exists
#     if "Status" not in df.columns:
#         df["Status"] = 0  # Default status

#     # Example anomaly marking logic (marking every alternate row)
#     df.loc[df.index % 2 == 0, "Status"] = 1  

#     # Assign a new unique ObjectId to each record before inserting
#     df["_id"] = [ObjectId() for _ in range(len(df))]

#     # Convert DataFrame to list of dictionaries (MongoDB format)
#     records = df.to_dict(orient="records")

#     # Bulk insert the entire batch for efficiency
#     if records:
#         await info_collection.insert_many(records)  # Fast batch insert

#     print(f"Anomaly detection complete. Inserted {len(records)} records.")

'''
    Scalable approach for the staus when actual method will use for anomalies detection
'''

async def detect_anomalies():
    """Detect anomalies in the data and insert records into 'info_collection' with counters as subdocuments."""
    global first_run, fetch_count


    if first_run:
        await info_collection.delete_many({})  # Clear previous records only once
        first_run = False

    
    print("Starting anomaly detection...")

    # Fetch only new data
    data = await fetch_latest_data()
    if data:
        fetch_count += 1  # Increment fetch count each time function is called
        print("fetch_count:", fetch_count)
        status = 1 if fetch_count % 2 == 0 else 0  # Determine status based on fetch count

    if not data:
        print("No new data to process.")
        return

    # Convert data to DataFrame
    df = pd.DataFrame(data)

    # Identify counter columns dynamically
    counter_columns = [col for col in df.columns if col.startswith("counter_value")]

    print(f"Detected counters: {counter_columns}")  # Debug: Ensure correct column names

    records = []
    
    for index, row in df.iterrows():
        counters_data = {}

        try:
            row_dict = row.to_dict()  # Ensure row is a dictionary

            for counter in counter_columns:
                if counter not in row_dict:
                    print(f"Warning: {counter} not found in row {index}")
                    continue  # Skip if column missing

                counter_value = row_dict[counter]

                if isinstance(counter_value, list):  # Check for list issue
                    print(f"Error: {counter} has list value {counter_value} in row {index}")
                    continue

                # Ensure key is string & assign values correctly
                counters_data[str(counter)] = {
                    str(counter): counter_value,
                    "Status": status
                }

            # Ensure 'Counters' is a dictionary and not a list
            if not isinstance(counters_data, dict):
                print(f"Error: counters_data is not a dict: {counters_data}")
                continue

            # Prepare MongoDB document
            record = {
                "Time": row_dict["Time"],
                "Counters": counters_data  # Store all counters as a subdocument
            }

            records.append(record)

        except Exception as e:
            print(f"Error processing row {index}: {e}")

    # Insert into MongoDB
    if records:
        try:
            await info_collection.insert_many(records)
            print(f"Anomaly detection complete. Inserted {len(records)} records.")
        except Exception as e:
            print(f"MongoDB Insertion Error: {e}")


   

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

async def get_counter_value(counter: str):
    """Fetch the next 20 new anomalies for a specific counter."""
    global last_sent_id

    query = {}  # Default: Fetch latest if no last_sent_id
    if last_sent_id:
        query = {"_id": {"$gt": last_sent_id}}  # Fetch older records

    # Fetch the next 20 records sorted by `_id` descending
    cursor = info_collection.find(query, {"_id": 1, "Time": 1, f"Counters.{counter}": 1}).sort("_id", 1).limit(25)
    records = await cursor.to_list(length=25)

    if not records:
        return {f"{counter}_list": []}  # No new records found

    # Update last_sent_id for next query
    last_sent_id = records[-1]["_id"]

    counter_values = []
    for record in records:
        if "Counters" in record and counter in record["Counters"]:
            counter_data = record["Counters"][counter]
            counter_values.append({
                "Time": record.get("Time"),
                counter: counter_data.get(counter),
                "Status": counter_data.get("Status")
            })

            # counter_values.sort("Time",1)

    return {f"{counter}_list": jsonable_encoder(counter_values)}  # JSON serializable response


async def websocket_endpoint(websocket: WebSocket, counter: str):
    """Handles WebSocket connections and ensures resilience to disconnections and idle states."""
    await websocket.accept()
    print(f"[WebSocket] Client connected: {counter}")

    no_data_count = 0  # Counter for idle connection

    try:
        while True:
            data = await get_counter_value(counter)

            if data[f"{counter}_list"]:  # If new data is found, reset no_data_count
                no_data_count = 0
                await websocket.send_json(data)
            else:
                no_data_count += 1
                print(f"[WebSocket] No new data for {counter}. Attempt {no_data_count}")

            if no_data_count >= 12:  # If no data for 12 cycles (1 minute), close connection
                print(f"[WebSocket] Closing connection for {counter} due to inactivity")
                await websocket.close()
                break

            await asyncio.sleep(5)  # Fetch new data every 5 seconds

    except WebSocketDisconnect:
        print(f"[WebSocket] Client disconnected: {counter}")
    except Exception as e:
        print(f"[WebSocket] Error: {e}")
    finally:
        await websocket.close()
   


# endpoint for fetching individual counter detail
@router.get("/{counter}/all", dependencies=[Depends(oauth2_scheme)])
async def get_each_counter_values(counter:str):
    cursor = info_collection.find({}, {"_id": 0, f"Counters.{counter}":1, "Time": 1})

    counter_values = []
    
    async for doc in cursor:
        if "Counters" in doc and counter in doc["Counters"]:
            counter_data = doc["Counters"][counter]
            counter_values.append({
                "Time": doc.get("Time"),
                counter: counter_data.get(counter),
                "Status": counter_data.get("Status")
            })

    return {f"{counter}_list": counter_values}


@router.get("/all/sensor", dependencies=[Depends(oauth2_scheme)])
async def get_all_available_counters():
    cursor = info_collection.find({}, {"_id": 1, "Counters": 1}).sort("_id", 1)  # Sort by creation order
    counter_keys = []

    async for document in cursor:
        if "Counters" in document:
            for key in document["Counters"].keys():
                if key not in counter_keys:
                    counter_keys.append(key)  # Maintain first-seen order
    
    if not counter_keys:
        raise HTTPException(status_code=404, detail="No counters found")
    
    return {"available_counters": counter_keys}  # Preserving creation order
