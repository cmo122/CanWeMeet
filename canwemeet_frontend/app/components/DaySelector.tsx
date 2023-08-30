import React, { useState } from "react";
import '../styles/dayselector.css'


export default function DaySelector() {
    const [days] = useState(['Sun','Mon','Tue','Wed','Thur','Fri','Sat'])
    const [dayColor, setDayColor] = useState(['bg-red-500', 'bg-red-500',
    'bg-red-500','bg-red-500','bg-red-500','bg-red-500','bg-red-500'])

    function handleSelection(index:number) {
        const newColors = [...dayColor]
        newColors[index] === 'bg-red-500' ? newColors[index] = 'bg-green-500'
            : newColors[index] = 'bg-red-500'
        setDayColor(newColors)
    }

    return (
     <div className="flex justify-center items-center">
            {days.map((day, index) => (
            <div key={index} className="flex flex-col justify-center items-center m-3">
                <h2>{day}</h2>
                <div onClick={()=>handleSelection(index)} className={`daySegment ${dayColor[index]}`}>
                
                </div>
            </div>

         ))}
     </div>
    )
}