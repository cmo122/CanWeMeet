import React, { useEffect, useState } from "react";

interface Days {
    dayName: string;
    checkedStatus: boolean;
  }

export default function DaySelector() {
    const [days, setDays] = useState<Days[]>([])

    const populateDays = () => {
        const dayNamesList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
        const daysList=[]
        for (let i = 0; i < 7; i++){
            daysList.push({dayName:dayNamesList[i], checkedStatus:false})
        }
        return daysList
    }

    useEffect(() => {
        setDays(populateDays())
    },[])

    return (
     <div className="flex justify-center items-center">
            {days.map((day, index) => (
            <div key={index} className="flex flex-col justify-center items-center m-3">
                <h2 className="text-white">{day.dayName}</h2>
                <input
                type="checkbox"
                name={day.dayName}
                value={day.dayName}
                className="w-6 h-6 p-4"
              />
            </div>

         ))}
     </div>
    )
}