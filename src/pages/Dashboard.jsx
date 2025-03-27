import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import SensorSidebar from "../components/SensorSidebar";
import { SensorContext } from "../context/SensorContext";
import { CounterWebSocket } from "../../sockets/CounterWebsocket";

const Dashboard = () => {
   const {sensorName} = useContext(SensorContext);

   const[sensor, setSensor] = useState(sensorName); 

   const counterData = CounterWebSocket(sensor);



  //  useEffect(() => {
  //   const fetchData = async() =>{
  //     const response = await new WebSocket(``)
  //   }
  //  })

  return(
    <div className="dashboard-container">
      <SensorSidebar />
      <p> sensor: {sensorName}</p>

      <h2>Real-time Anomaly Updates for {sensorName}</h2>
      <select onChange={(e) => setSensor(e.target.value)} value={sensor}>
        <option value={sensorName}>{sensorName}</option>
        {/* <option value="counter_value2">counter2</option>
        <option value="counter_value3">counter3</option> */}
      </select>
      <ul>
        {counterData?.map((item, index)=>(
          <li key={index}>
            <strong>Time:</strong> {item.Time} |<strong>{sensorName}:</strong> {item[sensor]}| <strong>Status:</strong> {item.Status}
          </li>
        ))}
      </ul>

    </div>
  )
};

export default Dashboard;
