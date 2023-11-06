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
            <Button onClick={handleGridViewChange} className="bg-blue-500 m-2">Toggle View</Button>
        </div>
    )
}