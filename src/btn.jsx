import React from "react";
import { useState } from "react";

const Btn = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        let c = count + 1;
        setCount(c)
        }
    return (
        <div>
            <button onClick={handleClick}>Click me</button>
            <p>You clicked {count} times</p>
        </div>
    );
}
export default Btn;
