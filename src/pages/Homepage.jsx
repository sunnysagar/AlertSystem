import React from "react";
import { Navbar } from "../components/Navbar";
import "../styles/Homepage.css";
import PLCControl from "../PLC/plc_read";


const Homepage = () => {
    return (
        <div className="homepage">
            <header>
            <Navbar />
            <h1>Homepage</h1>
            </header>
            <PLCControl />
         
        </div>
    );
}; 

export default Homepage;