import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/Sidebar.css";
import { useLocation } from "react-router-dom";
import home from "../assets/home.png";
import logout_icon from "../assets/logout.png";
import profile from "../assets/profile.png";
import filter from "../assets/filter.png";
import history from "../assets/history.png";
import feedback from "../assets/feedback.png";
import settings from "../assets/settings.png";



export default function Sidebar() {
    const [isActive, setIsActive] = useState("home");
    const {token, logout} = useAuth();
    const  location = useLocation();
    const [userInfo, setUserInfo] = useState(null);

    const handleLogout = () => {
        logout();
        setIsActive(false);
    }

    useEffect(() => {
        switch(location.pathname){
            case "/":
                setIsActive("home");
                break;
            case "/filtration":
                setIsActive("Filtration");
                break;
            case "/history":
                setIsActive("History");
                break;
            case "/feedback":
                setIsActive("Feedback");
                break;
            case "/settings":
                setIsActive("Settings");
                break;
            case "/profile":
                setIsActive("Profile");
                break;
            default:
                setIsActive("home");
                break;
        };

        // fetchUserInfo();
    }, [location.pathname]);

    const fetchUserInfo = async() => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/users/profile',{
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            if(response){
                setUserInfo(response.data);
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    const handleTabClick = (tab) => {
        setIsActive(tab);
    }

    return (
        <div className="sidebar">
            <div className="sidebar-content">
                <ul>
                    <li className={isActive === "home" ? "active" : ""} onClick={() => handleTabClick("home")}>
                        <img src={home} alt="home"  className="icon-tab"/>Home
                    </li>
                    <li className={isActive === "Filtration" ? "active" : ""} onClick={() => handleTabClick("Filtration")}>
                    <img src={filter} alt="home"  className="icon-tab"/>Filtration
                    </li>
                    <li className={isActive === "History" ? "active" : ""} onClick={() => handleTabClick("History")}>
                    <img src={history} alt="home"  className="icon-tab"/>History
                    </li>
                    <li className={isActive === "Feedback" ? "active" : ""} onClick={() => handleTabClick("Feedback")}>
                    <img src={feedback} alt="home"  className="icon-tab"/>Feedback
                    </li>
                    <li className={isActive === "Settings" ? "active" : ""} onClick={() => handleTabClick("Settings")}>
                    <img src={settings} alt="home"  className="icon-tab"/>Settings
                    </li>
                   
                </ul>
            </div>
            <div className="sidebar-footer">

                <ul>
                    <li className={isActive === "Profile" ? "active" : "pro"} onClick={() => handleTabClick("Profile")} id="profile">
                        <img src={profile} alt="" />
                    </li>
                    <li onClick={handleLogout} id="logout">
                        <img src={logout_icon} alt="logout" /> Logout
                    </li>
                </ul>
               
        </div>
        </div>
    );
}