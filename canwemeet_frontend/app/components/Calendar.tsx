import Image from 'next/image'
import '../styles/calendar.css'

export default function Calendar() {

    // initialize div cells for day selection
    const cells = () => {

        const cellList = [];
        const currentDate = new Date();

        for (let i = 0; i < 35; i++){
            // create a buffer object to ensure we're incrementing from the initialized current date
            const dateBuffer = new Date(currentDate)
            // set buffer to current date and increment based on loop stage
            dateBuffer.setDate(currentDate.getDate()+i)
            cellList.push({
                id: i,
                // local date string will be based on user's local time zone settings
                date: dateBuffer.getDate()
            })
        }
        return cellList
    }

    return (
        <div>
        <h2 className="flex justify-center">Select dates</h2>
            <div id='calendar' className='calendar'>
            {cells().map(day => (
                <div key={day.id} className="calendar-cell">
                    {day.date}
                </div>
                ))}                
            </div>
        </div>
    )
}
