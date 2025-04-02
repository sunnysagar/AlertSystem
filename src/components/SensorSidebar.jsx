/**
 * SensorSidebar Component
 * 
 * This component displays a sidebar containing a list of detected sensors. 
 * Users can select a sensor from the list, and the selected sensor's name 
 * is stored in the context for use in other parts of the application.
 * 
 */
import axios from "axios";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/SensorSidebar.css"
import sensorIcon from "../assets/sensor.png";

const SensorSidebar = ({onSensorClick}) => {
    const [sensor, setSensor] = useState([]);
     const {token} = useAuth();
     const [sensorName, setSensorName] = useState('');
     const [clicked, setClicked] = useState(false);

    const fetchSensors = async () => {
        if(!token) return;
        
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
    }, [token]);

    const handleClicked = (sName) =>{
        setSensorName(sName);
        setClicked(!clicked);
        // onSensorClick(sName)
    }

    const handlePlotClick = () => {
        onSensorClick(sensorName);
    }

    const handleRefresh = () =>{
        fetchSensors();
    }

    const handleClearPlot = () => {
        setSensorName('');
        onSensorClick('');
    }


    return (
        <div className="sensor-sidebar">
            <div className="sensor-container">
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
            </div>
           
           <div className="sensor-controllers">
                <button className="plot-btn" onClick={handlePlotClick}>Show Plot</button>
                <button className="refresh-btn" onClick={handleRefresh}>Refresh</button>
                <button className="clear-plot" onClick={handleClearPlot}>Clear Plot</button>
           </div>
        </div>
    );
};

export default SensorSidebar;
