import React from "react";
import { useAppDispatch, useAppSelector } from '@/app/components/redux/hooks';
import { toggleAllUsersView } from "./redux/allUsersViewSlice";
import { Button } from "@mantine/core";

export default function TimeGridViewPicker() {
    const dispatch = useAppDispatch();
    const handleGridViewChange = () => {
        dispatch(toggleAllUsersView());
      };
    const allUsersView=useAppSelector((state)=>state.allUsersView)  
    
    return (
        <div className="flex flex-col justify-center items-center">
            <Button onClick={handleGridViewChange} className="bg-blue-500 m-2">
                {allUsersView ? <div>All Users Freetimes</div> : <div>Your Freetimes</div>}
            </Button>
        </div>
    )
}