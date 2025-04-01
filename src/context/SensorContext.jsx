import { createContext, useState } from "react";

// Create Context
export const SensorContext = createContext();

// Provider Component
export const SensorProvider = ({ children }) => {
    const [sensorName, setSensorName] = useState("");

    return (
        <SensorContext.Provider value={{ sensorName, setSensorName }}>
            {children}
        </SensorContext.Provider>
    );
};
