import axios from "axios";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
            setToken(authToken);
            setIsAuthenticated(true);  
        }
            
    }, []);

    // Login function
    const login = async(email, password) => {
        try{
            const response = await axios.post("http://127.0.0.1:8000/auth/login", { email, password });
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