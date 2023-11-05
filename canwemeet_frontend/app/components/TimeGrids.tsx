import { Grid } from "@mantine/core";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { setSelectedTimes } from "./redux/selectedTimesSlice";
import { setHoverStateView } from "./redux/hoverStateSlice";
import { setSharedUsers } from "./redux/sharedUsersSlice";
import check from './icons/check.svg'

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
  
  // buffer state
  const [selectedTimesBuffer, setSelectedTimesBuffer] = useState<string[]>([]);

  // sets buffer for selectedTimes redux state
  useEffect(() => {
    setSelectedTimesBuffer(selectedTimes);
  }, [selectedTimes]);

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
      const userNames: string[] = [];
      const id:string = `${month},${day},${year}_${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
      if(isAllUsersViewEnabled){
        // if true, loop through every user in all_users_freetime and show their freetimes on the grid
        // store all users sharing the same time slot to userNames array, then assign it to data-names
        props.event.all_users_freetime.forEach((user:any,index:number)=>{
          if (user.freetime.includes(id)) {
            isTimeSelected = true;
            userNames.push(user.name)
          }
        })
      }
      else{
        // else, render only the current users freetime
        isTimeSelected = selectedTimesBuffer.includes(id);
      } 
      
      const sharedUsers=userNames.join(', ')
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
              style={{ backgroundImage: isTimeSelected ? `url(${check.src})` : "none",
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
              </div>
            </div>
          </div>
      )
    })}
  </Grid.Col>
  )
}