import React from "react";
import { Navbar } from "../components/Navbar";
import "../styles/Homepage.css";


const Homepage = () => {
    return (
        <div className="homepage">
            <header>
            <Navbar />
            <h1>Homepage</h1>
            </header>
         
        </div>
    );
}; 

export default Homepage;