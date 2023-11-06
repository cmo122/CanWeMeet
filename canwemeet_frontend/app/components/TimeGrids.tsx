import { Grid } from "@mantine/core";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { setSelectedTimes } from "./redux/selectedTimesSlice";
import { setHoverStateView } from "./redux/hoverStateSlice";
import { setSharedUsers } from "./redux/sharedUsersSlice";
import check from './icons/check.svg'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface User {
    name: string;
    freetime: string[];
  }

interface Event{
  id: number;
  created_at: Date;
  eventID: string;
  eventName: string;
  initialTime: string;
  finalTime: string;
  timezone: string;
  dates_format: boolean;
  dates: Date[];
  days: string[];
  all_users_freetime: JSON[]
}

interface TimeGridProps {
  outerIndex: number;
  date: string;
  eventTimes: Date[];
  user: User;
  event: Event;
}

// Generates time grid divs
export default function TimeGrids(props:TimeGridProps){
  
  // Redux states
  const dispatch= useAppDispatch();
  const selectedTimes = useAppSelector((state) => state.selectedTimes);
  const isAllUsersViewEnabled = useAppSelector((state) => state.allUsersView);

  // Mouse state
  const [mouseIsDown, setMouseIsDown] = useState(false);

  // all mouse functions that handle dragover logic
  // ***
  const handleMouseDown = (id:string) => {
      if(!props.user.name) return;
      if (selectedTimes.includes(id)) {
        const updatedSelectedTimes = selectedTimes.filter((divId) => divId !== id);
        dispatch(setSelectedTimes(updatedSelectedTimes));
      }
      else{
        dispatch(setSelectedTimes([...selectedTimes, id]));
      }
      setMouseIsDown(true);
    };
  
  const handleMouseUp = (id:string) => {
    if(!props.user.name) return;
    setMouseIsDown(false);
  };

  const handleMouseEnter = (id: string, sharedUsers:string) => {
    dispatch(setHoverStateView(true))
    dispatch(setSharedUsers(sharedUsers))
    if(!props.user.name || !mouseIsDown) return;
    if (mouseIsDown) {
      const updatedSelectedTimes = selectedTimes.includes(id)
      ? selectedTimes.filter((divId) => divId !== id)
      : [...selectedTimes, id];

      dispatch(setSelectedTimes(updatedSelectedTimes));

    }
  };

  const handleMouseOut = () => {
    dispatch(setHoverStateView(false))
  };
  // ***

  const newDate=new Date(props.date)
  const month = newDate.toLocaleString('default', { month: 'short' });
  const day = newDate.getDate();
  const year = newDate.getFullYear();
  return (
    <Grid.Col>
    {props.eventTimes.map((time:Date, index:number) => {
      let isTimeSelected:boolean=false;
      let percentage=0;
      const userNames: string[] = [];
      const id:string = `${month},${day},${year}_${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
      if(isAllUsersViewEnabled && props.event){
        // if true and event exists, loop through every user in all_users_freetime and show their freetimes on the grid
        // store all users sharing the same time slot to userNames array, then assign it to data-names
        props.event.all_users_freetime.forEach((user:any,index:number)=>{
          // if user exists on element
          if(user.freetime){
            // and their freetime has the current div time included
            if(user.freetime.includes(id)){
              // update time values
              isTimeSelected = true;
              userNames.push(user.name)
            }}
        })
        percentage = (userNames.length/props.event.all_users_freetime.length)*100;
      }
      else{
        // else, render only the current users freetime
        isTimeSelected = selectedTimes.includes(id);
      } 
      
      const sharedUsers=userNames.join(', ')
      // const percentage = (userNames.length/props.event.all_users_freetime.length)*100;
      return(
          <div className="flex" key={index}>
            {props.outerIndex === 0 && (
                  <div className="text-xs select-none p-1">
                    {time.getMinutes() === 0 ? `${time.getHours() < 10 ? '0' : ''}${time.getHours()}:00` : ''}
                    {time.getMinutes() !== 0 ? `${time.getHours() < 10 ? '0' : ''}${time.getHours()}:${time.getMinutes()}` : ''}
                  </div>
            )}
            <div>
              <div
              id={id} 
              className={`w-12 h-6 border border-black flex items-center justify-center`}
              style={{ backgroundImage: isTimeSelected && !isAllUsersViewEnabled ? `url(${check.src})` : "none",
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat', 
              backgroundSize: '50%', }}
              data-date={`${year}-${month}-${day}`}
              data-time={`${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`}
              data-names={userNames.join(', ')}
              onMouseDown={() => handleMouseDown(id)}
              onMouseUp={() => handleMouseUp(id)}
              onMouseEnter={() => handleMouseEnter(id, sharedUsers)}
              onMouseOut={()=>handleMouseOut()}
              >
              {isTimeSelected && isAllUsersViewEnabled && <div style={{ 
                width: 20, 
                height: 20,
                position: 'relative',
                zIndex: -999,
                 }}>
                <CircularProgressbar value={percentage} strokeWidth={50}
                 styles={buildStyles({
                  strokeLinecap: "butt"
                })}
                background
                backgroundPadding={6}
               />
               </div>}
              </div>
            </div>
          </div>
      )
    })}
  </Grid.Col>
  )
}