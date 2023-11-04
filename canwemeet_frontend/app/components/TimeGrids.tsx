import { Grid } from "@mantine/core";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { setSelectedTimes } from "./redux/selectedTimesSlice";

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
    selectedDivs: string[]
    event: Event
  }

  // Generates time grid divs
  export default function TimeGrids(props:TimeGridProps)
    {
    
    const dispatch= useAppDispatch();
    const selectedTimes = useAppSelector((state) => state.selectedTimes);
    // Mouse state
    const [mouseIsDown, setMouseIsDown] = useState(false);

    const handleMouseDown = (id:string) => {
        if(!props.user.name) return;
        if (!selectedTimes.includes(id)) {
          dispatch(setSelectedTimes([...selectedTimes, id]));
        }
        setMouseIsDown(true);
      };
    
      const handleMouseUp = (id:string) => {
        if(!props.user.name) return;
        setMouseIsDown(false);
      };
    
      const handleMouseEnter = (id: string) => {
        if(!props.user.name || !mouseIsDown) return;
        if (mouseIsDown) {
          const updatedSelectedTimes = selectedTimes.includes(id)
          ? selectedTimes.filter((divId) => divId !== id)
          : [...selectedTimes, id];

          dispatch(setSelectedTimes(updatedSelectedTimes));

        }
      };

    const newDate=new Date(props.date)
    const month = newDate.toLocaleString('default', { month: 'short' });
    const day = newDate.getDate();
    const year = newDate.getFullYear();
    return (
      <Grid.Col>
      {props.eventTimes.map((time:Date, index:number) => {
        const serverUsersFreetime: User[] = props.event.all_users_freetime.map((item: any) => ({
          name: item.name,
          freetime: item.freetime
        }));
        console.log("server user base", serverUsersFreetime)
        const id:any = `${month},${day},${year}_${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
        const userIndex = serverUsersFreetime.findIndex(item => (item as User).name === props.user.name);
        const isTimeSelected = selectedTimes.includes(id) || (userIndex !== -1 && serverUsersFreetime[userIndex].freetime.includes(id));
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
                className={`w-12 h-6 border border-black ${
                  isTimeSelected  ? 'selected' : ''
                }`}
                data-date={`${year}-${month}-${day}`}
                data-time={`${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`}
                onMouseDown={() => handleMouseDown(id)}
                onMouseUp={() => handleMouseUp(id)}
                onMouseEnter={() => handleMouseEnter(id)}
                >
                </div>
              </div>
            </div>
        )
      })}
    </Grid.Col>
    )
  }