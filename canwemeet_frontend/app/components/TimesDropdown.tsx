import { useEffect, useState } from "react"
import PropTypes, { InferProps } from 'prop-types';

interface props{
    timeType:string
}

export default function TimesDropdown({timeType}: props) {
    const [times,setTimes]=useState<string[]>([])

    const generateTimes = () => {
        const timeList = []
        for (let i = 1; i <= 12; i++){
            const hour = `${i.toString().padStart(2, '0')}:00`
            timeList.push(hour)
        }
        return timeList
    }

    useEffect(() => {
        setTimes(generateTimes());
      }, []);

    return (
        <div className='flex justify-center items-center'>
            {timeType === 'initialTime' ?  
                <p className='text-white'>No earlier than: </p> :
                <p className='text-white'>No later than: </p> }
                
                <select name={timeType} id="times" className="rounded-md m-2">
                    {times.map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                    ))
                    }
                </select>
            <select name={`${timeType}Meridiem`} id={`${timeType}Meridiem`} defaultValue="" className='m-2'>
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                </select>
            </div>
    )
}