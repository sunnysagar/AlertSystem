import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PLCControl = () => {
    const [data, setData] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    // const token = localStorage.getItem("token"); // Retrieve JWT token
    const {token} = useAuth();

    const startPLC = async () => {
        try {
            await axios.post("http://127.0.0.1:8000/start_plc", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsRunning(true);
        } catch (error) {
            console.error("Error starting PLC data collection:", error);
        }
    };

    const stopPLC = async () => {
        try {
            await axios.post("http://127.0.0.1:8000/stop_plc", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsRunning(false);
        } catch (error) {
            console.error("Error stopping PLC data collection:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/latest_data", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setData(response.data);
            } catch (error) {
                console.error("Error fetching PLC data:", error);
            }
        };

        if (isRunning) {
            fetchData();
            const interval = setInterval(fetchData, 1000); // Auto-refresh every second
            return () => clearInterval(interval);
        }
    }, [isRunning, token]);

    return (
        <div>
            <h2>PLC Control Panel</h2>
            <button onClick={startPLC} disabled={isRunning} style={{ marginRight: "10px", backgroundColor: "green", color: "white" }}>
                Start PLC
            </button>
            <button onClick={stopPLC} disabled={!isRunning} style={{ backgroundColor: "red", color: "white" }}>
                Stop PLC
            </button>

            <h3>Latest PLC Data</h3>
            {data ? (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            {Object.keys(data).filter(k => k.includes("counter")).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{new Date(data.timestamp).toLocaleString()}</td>
                            {Object.values(data).slice(1).map((value, index) => (
                                <td key={index}>{value}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>Click "Start PLC" to begin collecting data.</p>
            )}
        </div>
    );
};

export default PLCControl;
