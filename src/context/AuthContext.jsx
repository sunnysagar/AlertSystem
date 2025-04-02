import axios from "axios";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    
    const[token, setToken] = useState(null);
    const[isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem("access_token");

        if(authToken){
            try {
                const decodeToken = jwtDecode(authToken);
                const currentTime = Date.now()/1000;   // in seconds

                if(decodeToken.exp > currentTime)
                {
                    setToken(authToken);
                    setIsAuthenticated(true);  

                     // Navigate to the previous path or a default authenticated page
                    const savedPath = sessionStorage.getItem('currentPath') || '/';
                    navigate(savedPath);
                }
                else{
                    logout();  // token expired
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                logout();
            }
           
        }else {
            navigate("/login");
        }
            
    }, []);

    // Login function
    const login = async(email, password) => {
        try{
            const response = await axios.post("http://127.0.0.1:8000/auth/login", { email, password },
                { headers: { "Content-Type": "application/json" } }
            );
            setToken(response.data.access_token);
            setIsAuthenticated(true);
            localStorage.setItem("access_token", response.data.access_token);
            alert("Login successful");
            navigate("/");
        } catch(error){
            // alert("Login failed", error);
            console.log("Login failed", error);    // will removed in the final
        }
    }

    // signup function
    const signup = async(user) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/auth/register", user );
                if(response)
                    navigate("/login");

        } catch (error) {
            alert("Signup failed", error);
            console.log("Signup failed", error);    // will removed in the final    
        }
    };

    // Logout function
    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem("access_token");
        sessionStorage.removeItem("currentPath");
        navigate("/login");
    };

    const contextValue = useMemo(() => ({
        isAuthenticated,
        token,
        login,
        signup,
        logout
    }), [isAuthenticated, token, login, signup, logout]);

    return(
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}
