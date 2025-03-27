import React, { useEffect, useRef, useState } from "react";

export const CounterWebSocket = (counter) =>{
    const [data, setData] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${counter}/value`);

        ws.onopen = () => {
            console.log("Websocket conneted");
        };

        ws.onmessage = (event) => {
            const responseData = JSON.parse(event.data);
            setData(responseData[`${counter}_list`] || []);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    
        ws.onClose = () => {
            console.log("WebSocket closed, Reconnecting...");
            setTimeout(() => CounterWebSocket(counter), 3000);  //Reconnect after 3s
        };
    
        socketRef.current = ws;
    
        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [counter]);

    return data; 

};

//  export default CounterWebSocket;