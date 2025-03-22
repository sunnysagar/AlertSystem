import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/Sidebar.css";
import { useLocation } from "react-router-dom";


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

        fetchUserInfo();
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
                        <i className="fas fa-home"></i>Home
                    </li>
                    <li className={isActive === "Filtration" ? "active" : ""} onClick={() => handleTabClick("Filtration")}>
                        <i className="fas fa-filter"></i>Filtration
                    </li>
                    <li className={isActive === "History" ? "active" : ""} onClick={() => handleTabClick("History")}>
                        <i className="fas fa-history"></i>History
                    </li>
                    <li className={isActive === "Feedback" ? "active" : ""} onClick={() => handleTabClick("Feedback")}>
                        <i className="fas fa-comment"></i>Feedback
                    </li>
                    <li className={isActive === "Settings" ? "active" : ""} onClick={() => handleTabClick("Settings")}>
                        <i className="fas fa-cog"></i>Settings
                    </li>
                    <li className={isActive === "Profile" ? "active" : ""} onClick={() => handleTabClick("Profile")}>
                        <i className="fas fa-user"></i>Profile
                    </li>
                    <li onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>Logout
                    </li>
                </ul>
            </div>
            <div className="sidebar-footer">
                <p>{userInfo && userInfo.name}</p>
        </div>
        </div>
    );
}