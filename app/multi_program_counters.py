"""
This script reads counter values from an OpenPLC using Modbus TCP and stores the data in an ArcticDB library.
Configuration:
    PLC_IP (str): IP address of the OpenPLC.
    PLC_PORT (int): Port number for Modbus communication.
    REGISTER_ADDRESSES (list): List of register addresses to read from the PLC.
    MONGO_URI (str): URI for connecting to the MongoDB instance.
    LIBRARY_NAME (str): Name of the library in ArcticDB.
Execution:
    1. Connects to the OpenPLC using Modbus TCP.
    2. Connects to the ArcticDB instance.
    3. Initializes the specified library in ArcticDB if it does not exist.
    4. Enters an infinite loop to:
        a. Read the specified registers from the OpenPLC.
        b. Extract counter values from the read registers.
        c. Create a pandas DataFrame with the timestamp and counter values.
        d. Append the new data to the existing data in ArcticDB.
        e. Print the saved data to the console.
        f. Sleep for 1 milli-second before the next read cycle.
"""
import time
import pandas as pd
from datetime import datetime
from pymodbus.client import ModbusTcpClient
from database import plc_collection 
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# OpenPLC Configuration
load_dotenv()
PLC_IP = os.getenv("PLC_IP")
PLC_PORT = 502  # Single Modbus device, one port
REGISTER_ADDRESSES = list(range(0, 76))

# # ArcticDB Configuration
# MONGO_URI = "mongodb://localhost:27017/"
# LIBRARY_NAME = "alert"
# Connect to OpenPLC
client = ModbusTcpClient(PLC_IP, port=PLC_PORT)
client.connect()

# # Connect to ArcticDB
# store = Arctic(MONGO_URI)

# # Initialize Library in ArcticDB (If not exists, create it)
# if LIBRARY_NAME not in store.list_libraries():
#     store.initialize_library(LIBRARY_NAME)

# library = store[LIBRARY_NAME]
library=plc_collection

while True:
    # Read all necessary registers from OpenPLC
    result = client.read_holding_registers(REGISTER_ADDRESSES[0], count=len(REGISTER_ADDRESSES))

    if result.isError():
        print("Error reading from PLC!")
        continue

    # Extract values dynamically for 75 registers
    counter_values = {f"counter_value{i+1}": result.registers[i] for i in range(75)}
    timestamp = datetime.now()

    # Prepare DataFrame dynamically for all 75 counter values
    df = pd.DataFrame({
        "timestamp": [timestamp],
        **{f"counter_value{i+1}": [counter_values[f"counter_value{i+1}"]] for i in range(75)}
    })

    # Append data to ArcticDB
    if "counter_data10" in library.list_symbols():
        existing_data = library.read("counter_data10").data
        df = pd.concat([existing_data, df], ignore_index=True)

    library.write("counter_data10", df)

    print(f"Saved: {timestamp} - {counter_values}")
    time.sleep(0.01)  # Read every 1  milli second
# # Print the counter_data10 table
# if "counter_data10" in library.list_symbols():
#     counter_data = library.read("counter_data10").data
#     print(counter_data)

# else:
#     print("No data found for counter_data10.")
