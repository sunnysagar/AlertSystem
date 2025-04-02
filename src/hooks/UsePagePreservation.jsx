import React, { useDebugValue, useEffect } from "react";
import { useLocation } from "react-router-dom";

const UsePagePreservation = () => {
    const location = useLocation();

    useEffect(() => {
        sessionStorage.setItem("currentPath", location.pathname);
    }, [location]);  // mount for each location
};
export default UsePagePreservation;