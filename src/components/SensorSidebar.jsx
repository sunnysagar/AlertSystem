import axios from "axios";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/SensorSidebar.css"
import { SensorContext } from "../context/SensorContext";
import sensorIcon from "../assets/sensor.png";



const SensorSidebar = () => {
    const [sensor, setSensor] = useState([]);
     const {token} = useAuth();
     const {sensorName, setSensorName} = useContext(SensorContext);
     const [clicked, setClicked] = useState(false);

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

    const handleClicked = (sName) =>{
        setSensorName(sName);
        setClicked(!clicked)
    }


    return (
        <div className="sensor-sidebar">
            <h3>Detected Sensors</h3>
            <ul>
                {sensor.length > 0 ? (
                    sensor.map((sensorItem, index) => (
                        <li 
                            key={index} 
                            onClick={() => handleClicked(sensorItem)} 
                            className={clicked && sensorName === sensorItem ? 'on-selected' : ''}
                        >
                            <img src={sensorIcon} alt="sensorIcon" />
                            {sensorItem || "Unnamed Sensor"}
                        </li>
                    ))
                ) : (
                    <li>No sensors found</li>
                )}
            </ul>
            {/* <p>{sensorName}</p> */}
        </div>
    );
};

export default SensorSidebar;
