import { useEffect, useState } from "react"

export default function TimesDropdown() {
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
        <div>
            <select name="times" id="times" className="rounded-md m-2">
                {times.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                ))

                }
            </select>
        </div>
    )
}