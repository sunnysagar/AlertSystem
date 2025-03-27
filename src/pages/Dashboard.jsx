import axios from "axios";
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import SensorSidebar from "../components/SensorSidebar";

const Dashboard = () => {
   const [data, setData] = useState("");

  //  useEffect(() => {
  //   const fetchData = async() =>{
  //     const response = await axios.get
  //   }
  //  })

  return(
    <div className="dashboard-container">
      <SensorSidebar />

    </div>
  )
};

export default Dashboard;
