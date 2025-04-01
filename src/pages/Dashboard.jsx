import React, { useState, useEffect, useContext, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import SensorSidebar from "../components/SensorSidebar";
import { useCounterWebSocket } from "../../sockets/CounterWebsocket";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [sensorName, setSensorName] = useState("");
  const [data, setData] = useState([]);
  const maxPoints = 60;
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1000);
  const counterData = useCounterWebSocket(sensorName);
  const isFirstRun = useRef(true); // Track first run
  const [notifyPaused, setIsNotifyPaused] = useState('');

  useEffect(() => {
    if (!counterData || counterData.length === 0 || !isRunning) return;

    const newData = counterData.map((item) => ({
      Time: item.Time,
      Data: item[sensorName] || 0,
      Status: item.Status,
      color: item.Status === 1 ? "red" : "green",
    }));

    setData((prevData) => [...prevData, ...newData].slice(-maxPoints), speed);
  }, [counterData, sensorName, isRunning, speed]);

  const handleSensorClicked = (selectedSensor) => {
    setSensorName(selectedSensor);
  };

  const toggleRunningState = () => {
    if (!isFirstRun.current) {
      setIsNotifyPaused(isRunning ? "Paused" : "Resumed"); // set notifiction text
      setTimeout(()=> setIsNotifyPaused(''), 2000);  // Auto-hide after 2s
    }
    isFirstRun.current = false;
    setIsRunning((prev) => !prev);
  };

  return (
    <div className="dashboard-container">
      <div className="left-container">
        <SensorSidebar onSensorClick={handleSensorClicked} />
      </div>
      {!sensorName ? (
        <h3>Please select a sensor to start monitoring.</h3>
      ) : (

        
        <div className="right-container">
          <h2>Real-Time Sensor Data {sensorName ? `(${sensorName})` : "(Select a Sensor)"}</h2>
          <div className="plot-container">
             {/* Notification Pop-Up */}
             {notifyPaused && (
              <div className="notification-popup">
                {notifyPaused}
              </div>
            )}
            <div onClick={toggleRunningState}>
              <ResponsiveContainer width="99%" height={500}>
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
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="speed-controller">
              <button onClick={() => setSpeed((prev) => Math.max(prev - 200, 200))}>Speed Up</button>
              <button onClick={() => setSpeed((prev) => prev + 200)}>Slow Down</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
