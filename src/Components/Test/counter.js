 import React,{useState} from "react";

  export default function Counter({initialCount})
 {
    const [count,setCount]=useState(initialCount)
    const increment=()=>
    {
        setCount((prev)=>prev+1);
    }
    const decrement=()=>{
        setCount((prev)=>prev-1)
    }
    const restart=()=>{
        setCount(0)
    }
    const switchSigns=()=>{
        setCount((prev)=>prev*-1)
    }
    return (
        <div>
            <h1>
                count:<h3 data-testid="count">{count}</h3>
            </h1>
              <div>
                <button onClick={increment}>inc</button>
                <button onClick={decrement}> dec</button>
                <button onClick={restart}> res</button>
                <button onClick={switchSigns}> Sign</button>
              </div>

        </div>
    )
  
 }