import React, { useState, useEffect, useContext } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import SensorSidebar from "../components/SensorSidebar";
import { SensorContext } from "../context/SensorContext";
import { useCounterWebSocket } from "../../sockets/CounterWebsocket";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { sensorName } = useContext(SensorContext);
  const [data, setData] = useState([]); // Stores graph data
  const maxPoints = 60; // Number of points shown on graph

  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(800);

  const counterData = useCounterWebSocket(sensorName);

  useEffect(() => {
    if (!counterData || counterData.length === 0 || !isRunning) return;

    // Transform incoming data
    const newData = counterData.map((item) => ({
      Time: item.Time,
      Data: item[sensorName] || 0, // Handle missing values
      Status: item.Status,
      color: item.Status === 1 ? "red" : "green",
    }));

    setData((prevData) => {
      const updatedData = [...prevData, ...newData];

      // Sliding window effect: Keep only the last `maxPoints` entries
      return updatedData.slice(-maxPoints);
    });

  }, [counterData, sensorName, isRunning]);

  return (
    <div className="dashboard-container">
      <div className="left-container">
        <SensorSidebar />
        <p>Sensor: {sensorName}</p>
      </div>

      {/* Real-Time Sensor Data Graph */}
      <div className="right-container">
        <h2>Real-Time Sensor Data</h2>
        <div className="plot-container">
          <div onClick={() => setIsRunning(!isRunning)}>
            <ResponsiveContainer width="99%" height={700}>
              <LineChart data={data}>
                <CartesianGrid stroke="#000" />
                <XAxis dataKey="Time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Data"
                  stroke={data.length > 0 ? data[data.length - 1].color : "green"}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Speed Controls */}
          <div className="speed-controller">
            <button onClick={() => setSpeed((prev) => Math.max(prev - 200, 200))}>Speed Up</button>
            <button onClick={() => setSpeed((prev) => prev + 200)}>Slow Down</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
