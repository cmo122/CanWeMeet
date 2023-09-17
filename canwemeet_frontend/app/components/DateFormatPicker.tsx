import React from "react";
import { useAppDispatch } from '@/app/components/redux/hooks';
import { setDateView } from './redux/dateViewSlice';

export default function DateFormatPicker() {
    const dispatch = useAppDispatch();
    const handleDateViewChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
        const newDateView = event.target.value;
        dispatch(setDateView(newDateView));
      };
    
    return (
        <div className="flex flex-col justify-center items-center">
            <h2 className='text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>Choose date format:</h2>
                <select onChange={handleDateViewChange} id="dateSelect" className='rounded-sm m-3'>
                    <option value="dates">Specific Dates</option>
                    <option value="days">Days of the Week</option>
                </select>
        </div>
    )
}