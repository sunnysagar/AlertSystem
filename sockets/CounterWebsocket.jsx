import { useEffect, useRef, useState } from "react";

export const useCounterWebSocket = (counter) => {
    const [data, setData] = useState([]);
    const socketRef = useRef(null);
    const reconnectTimeout = useRef(null);

    useEffect(() => {
        if(!counter){
            console.log("websocketCounter: ", counter);
            return;
        } 

        console.log("RwebsocketCounter: ", counter);
    
        let isMounted = true;

        const connectWebSocket = () => {
            const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${counter}/value`);
            socketRef.current = ws;

            ws.onopen = () => {
                console.log(`[WebSocket] Connected to ${counter}`);
                if (reconnectTimeout.current) {
                    clearTimeout(reconnectTimeout.current); // Clear any pending reconnection attempts
                }
            };

            ws.onmessage = (event) => {
                if (!isMounted) return;
                try {
                    const responseData = JSON.parse(event.data);
                    console.log("[WebSocket] Received:", responseData);

                    if (Array.isArray(responseData[`${counter}_list`])) {
                        setData(responseData[`${counter}_list`]);
                    } else {
                        setData([]); // Handle empty data gracefully
                    }
                } catch (err) {
                    console.error("[WebSocket] JSON Parsing Error:", err);
                }
            };

            ws.onerror = (error) => console.error("[WebSocket] Error:", error);

            ws.onclose = () => {
                console.warn(`[WebSocket] Disconnected from ${counter}, retrying in 5s...`);
                reconnectTimeout.current = setTimeout(connectWebSocket, 5000); // Reconnect after 5s
            };
        };

        connectWebSocket();

        return () => {
            isMounted = false;
            socketRef.current?.close();
            clearTimeout(reconnectTimeout.current);
        };
    }, [counter]);

    return data;
};
