import React from "react";
import { Navbar } from "../components/Navbar";
import "../styles/Homepage.css";
import PLCControl from "../PLC/plc_read";
import Sidebar from "../components/Sidebar";


const Homepage = () => {
    return (
        <div className="homepage">
            <header>
            <Navbar />
            <div className="sidebar-container">
                <Sidebar />
            </div>
           
            {/* <h1>Homepage</h1> */}
            </header>
            {/* <PLCControl /> */}
         
        </div>
    );
}; 

export default Homepage;