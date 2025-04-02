import React from "react";
import { useAuth } from "../context/AuthContext";  //custom hook
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated? <Outlet/>: <Navigate to='/login'/>;
};

export default ProtectedRoute;