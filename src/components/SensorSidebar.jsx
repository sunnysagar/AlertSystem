import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const SensorSidebar = () => {
    const [sensor, setSensor] = useState([]);
     const {token} = useAuth();

    const fetchSensors = async () => {
        
        try {
            const response = await axios.get("http://127.0.0.1:8000/infodb/all/sensor", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Sensor API response:", response.data); // Debugging

            // Ensure response data is an array
            setSensor(Array.isArray(response.data.available_counters) ? response.data.available_counters : []);
        } catch (error) {
            console.error("Error fetching sensors:", error);
        }
    };

    useEffect(() => {
        fetchSensors();
    }, []);

    return (
        <div className="sensor-sidebar">
            <h3>Detected Sensors</h3>
            <ul>
                {sensor.length > 0 ? (
                    sensor.map((sensorItem, index) => (
                        <li key={index}>{sensorItem || "Unnamed Sensor"}</li>
                    ))
                ) : (
                    <li>No sensors found</li>
                )}
            </ul>
        </div>
    );
};

export default SensorSidebar;
