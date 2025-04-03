import React, { useState } from "react";

const TimeSelectionModal = () =>{
    const [startTime, setStartTime] = useState([]);
    const [endTime, setEndTime] = useState([]);

    return(
        <div className="time-selection-container">
            <h3>Select Timeframe for plot</h3>
            <select name="" id=""></select>
        </div>
    );

};

export default TimeSelectionModal;