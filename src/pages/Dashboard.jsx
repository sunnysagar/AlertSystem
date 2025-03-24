import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export const Dashboard = () => {
    const [data, setData] = useState([]);
    const maxPoints = 50;
    const [isRunning, setIsRunning] = useState(true);
    const [speed, setSpeed] = useState(1100);
    const intervalTime = 1100;
    const timeGap = 5; // Maintain uniform spacing

    useEffect(() => {
        if (!isRunning) return;
        const startTime = Date.now();

        const interval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const statusValue = Math.random() * 100; // Random value between 0-100
        const isAnomaly = Math.random() > 0.8; // 20% chance of anomaly

      const newDataPoint = {
        Time: new Date().toLocaleTimeString(), // Keep points uniformly spaced
        Status: statusValue, // Random value between 0-100
        Color: isAnomaly ? "red": "green", // 20% chance of anomaly
      };

      setData((prevData) => {
        const updatedData = [...prevData, newDataPoint];
        return updatedData.length > maxPoints ? updatedData.slice(1) : updatedData; // Keep only last maxPoints
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isRunning, speed]);

  
    return (
      <div>
        <h2>Live Random Data</h2>
        <div onClick={() => setIsRunning(!isRunning)}>
            <LineChart width={900} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Time" minTickGap={10} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
                     type="monotone" 
                    dataKey="Status" 
                    stroke={data.length > 0 ? data[data.length - 1].Color : "green"} 
                    isAnimationActive={false} />
            {/* <Line type="monotone" dataKey="Anomaly" stroke="red" dot={false} isAnimationActive={false} /> */}
            </LineChart>
        </div>
        

        <div>
        {/* <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Pause" : "Resume"}</button> */}
        <button onClick={() => setSpeed((prev) => Math.max(prev - 200, 200))}>Speed Up</button>
        
        <button onClick={() => setSpeed((prev) => prev + 200)}>Slow Down</button>
      </div>

      </div>
    );
};

export default Dashboard;
