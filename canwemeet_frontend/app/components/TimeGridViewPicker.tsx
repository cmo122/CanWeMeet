import React from "react";
import { useAppDispatch, useAppSelector } from '@/app/components/redux/hooks';
import { toggleAllUsersView } from "./redux/allUsersViewSlice";
import { Button } from "@mantine/core";

export default function TimeGridViewPicker() {
    const dispatch = useAppDispatch();
    const handleGridViewChange = () => {
        dispatch(toggleAllUsersView());

      };
    
    return (
        <div className="flex flex-col justify-center items-center">
            <h2 className='text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>Choose date format:</h2>
            <Button onClick={handleGridViewChange} className="bg-blue-500 m-2">Toggle View</Button>
        </div>
    )
}