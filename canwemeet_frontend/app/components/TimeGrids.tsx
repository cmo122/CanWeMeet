import { Grid } from "@mantine/core";
import { useState } from "react";

interface User {
    name: string;
    freetime: string[];
  }

  interface TimeGridProps {
    outerIndex: number;
    date: string;
    eventTimes: Date[];
    user: User;
  }

  // Generates time grid divs
  export default function TimeGrids(props:TimeGridProps)
    {

    // Mouse state
    const [mouseIsDown, setMouseIsDown] = useState(false);
    const [selectedDivs, setSelectedDivs] = useState<string[]>([]);

    const handleMouseDown = (id:string) => {
        if(!props.user.name) return;
        if (!selectedDivs.includes(id)) {
          setSelectedDivs((prevDivs) => [...prevDivs, id]);
        }
        setMouseIsDown(true);
      };
    
      const handleMouseUp = (id:string) => {
        if(!props.user.name) return;
        setSelectedDivs((prevDivs) => prevDivs.filter((divId) => divId !== id));
        setMouseIsDown(false);
      };
    
      const handleMouseEnter = (id: string) => {
        if(!props.user.name) return;
        if (mouseIsDown) {
          if (!selectedDivs.includes(id)) {
            setSelectedDivs((prevDivs) => [...prevDivs, id]);
          } else {
            setSelectedDivs((prevDivs) => prevDivs.filter((divId) => divId !== id));
          }
        }
      };

    const newDate=new Date(props.date)
    const month = newDate.toLocaleString('default', { month: 'short' });
    const day = newDate.getDate();
    const year = newDate.getFullYear();
    return (
      <Grid.Col>
      {props.eventTimes.map((time:Date, index:number) => {
        const id:any = `${month},${day},${year}_${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
        const isDivSelected = selectedDivs.includes(id);
        return(
            <div className="flex" key={index}>
              {props.outerIndex === 0 && (
                    <div className="text-xs p-1">
                      {time.getMinutes() === 0 ? `${time.getHours() < 10 ? '0' : ''}${time.getHours()}:00` : ''}
                      {time.getMinutes() !== 0 ? `${time.getHours() < 10 ? '0' : ''}${time.getHours()}:${time.getMinutes()}` : ''}
                    </div>
              )}
              <div>
                <div
                id={id} 
                className={`w-12 h-6 border border-black ${
                  isDivSelected  ? 'selected' : ''
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