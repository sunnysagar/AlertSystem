"""
main.py
This module serves as the entry point for the Alert System Web App backend, built using the FastAPI framework. 
It initializes the FastAPI application, includes routers for authentication and user management, and starts 
the application server when executed directly.
Routes:
- /auth: Handles authentication-related operations (e.g., login, registration).
- /users: Manages user-related operations (e.g., user profiles, user data).
Modules:
- auth: Contains routes and logic for authentication.
- users: Contains routes and logic for user management.
Execution:
Run this script directly to start the development server using Uvicorn.
Example:
    $ python main.py
Attributes:
    app (FastAPI): The FastAPI application instance.
"""
from fastapi import FastAPI, BackgroundTasks, Depends, HTTPException, WebSocket
from app.routes import auth, users
from fastapi.middleware.cors import CORSMiddleware
from app.auth.auth import oauth2_scheme, get_current_user
from app.database import plc_collection, original_collection
from app.services.anomalies_process import websocket_endpoint, monitor_data, get_anomalies
from datetime import datetime
import asyncio
import time
import threading
from pymodbus.client import ModbusTcpClient
import subprocess
from bson import ObjectId
from fastapi.encoders import jsonable_encoder


app = FastAPI(title="Alert System Web App")
process=None
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["users"])

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://localhost:5173",
    "http://localhost:5174",
]

# OpenPLC Configuration
PLC_IP = "192.168.1.181"
PLC_PORT = 502
REGISTER_ADDRESSES = list(range(3))  # Registers 0-3

# Modbus Client
client = ModbusTcpClient(PLC_IP, port=PLC_PORT)
client.connect()

# Flag for PLC task
running = False
plc_thread = None

# counter to track inserts
record_count = 0
batch_data = []

def read_plc_task():
    """ Continuously read PLC data and store it in MongoDB """
    global running, record_count, batch_data
    while running:
        result = client.read_holding_registers(REGISTER_ADDRESSES[0], count=len(REGISTER_ADDRESSES))
        if result.isError():
            print("Error reading from PLC")
            time.sleep(2)
            continue

        counter_values = result.registers
        timestamp = datetime.now()

        # Store data in MongoDB
        plc_record = {
            "timestamp": timestamp,
            **{f"counter_value{i+1}": counter_values[i] for i in range(len(counter_values))}
        }

        # Store in the primary database
        plc_collection.insert_one(plc_record)
        print(f"Stored PLC Data at {timestamp}")

        # Add to batch list
        batch_data.append(plc_record)
        record_count += 1

        # when 100 records are inserted, store in the original database
        if record_count == 100:
            original_collection.insert_many(batch_data)  # Bulk insert
            print(f"Moved {record_count} records to the archive database.")
            
            record_count = 0
            batch_data = []
            

        # print(f"Stored PLC Data at {timestamp}")  # Debugging info
        time.sleep(1)

@app.post("/start_plc", dependencies=[Depends(oauth2_scheme)])
def start_plc(background_tasks: BackgroundTasks):
    """ Start PLC data collection in the background """
    global running
    if running:
        raise HTTPException(status_code=400, detail="PLC data collection is already running")

    running = True
    background_tasks.add_task(read_plc_task)  # ✅ Runs in the background

    return {"message": "PLC data collection started"}

@app.post("/stop_plc", dependencies=[Depends(oauth2_scheme)])
def stop_plc():
    """ Stop PLC data collection """
    global running
    if not running:
        raise HTTPException(status_code=400, detail="PLC data collection is not running")

    running = False
    return {"message": "PLC data collection stopped"}



def convert_objectid(obj):
    """Recursively converts ObjectId fields to string."""
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, list):
        return [convert_objectid(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: convert_objectid(value) for key, value in obj.items()}
    else:
        return obj

@app.get("/latest_data", dependencies=[Depends(oauth2_scheme)])
async def get_latest_data():
    data = await plc_collection.find_one({}, sort=[("_id", -1)])  # Fetch latest data
    if data:
        data = convert_objectid(data)  # Convert ObjectId to string
        return jsonable_encoder(data)
    return {"message": "No data found"}

@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    await websocket_endpoint(websocket)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(monitor_data())

@app.get("/fetch_anomalies")
def fetch_anomalies():
    return get_anomalies()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
