import { Grid, Tooltip } from "@mantine/core";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { setSelectedTimes } from "./redux/selectedTimesSlice";
import { setHoverStateView } from "./redux/hoverStateSlice";
import { setSharedUsers } from "./redux/sharedUsersSlice";
import { useRouter } from 'next/router';
import check from './icons/check.svg'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { DateTime } from 'luxon';

interface CustomDateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  year?: 'numeric' | '2-digit'; // Define year as a valid option
  month?: 'numeric' | '2-digit' | 'short' | 'long'; // Define month as a valid option
  day?: 'numeric' | '2-digit'; // Define day as a valid option
  hour?: 'numeric' | '2-digit'; // Define hour as a valid option
  minute?: 'numeric' | '2-digit'; // Define minute as a valid option
}

interface User {
    name: string;
    freetime: string[];
    timezone:string
  }

interface Event{
  id: number;
  created_at: Date;
  eventID: string;
  eventName: string;
  initialTime: string;
  finalTime: string;
  timezone: string;
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
  const router = useRouter();
  // Redux states
  const dispatch= useAppDispatch();
  const selectedTimes = useAppSelector((state) => state.selectedTimes);
  const isAllUsersViewEnabled = useAppSelector((state) => state.allUsersView);

  // States
  const [serverEvent, setServerEvent] = useState<any>('')
  // const [eventId, setEventId] = useState('');
  const [bufferedTimes, setBufferedTimes] = useState<string[]>([]);

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

  useEffect(() => {
    setBufferedTimes(selectedTimes);
  }, [selectedTimes]);

  // fetch server side event state for comparison with local event state (after timezone conversion)
  // useEffect(() => {
  //   setEventId(router.asPath.replace(/^\/+/, ''));
  //   async function fetchEventDetails() {
  //       try{
  //           const response = await fetch(`http://localhost:1234/${eventId}`,
  //           {method: "GET",
  //           headers: {
  //           'Content-Type': 'application/json',
  //           }}
  //       );

  //       if(response.ok){
  //           const eventData = await response.json();
  //           setServerEvent(eventData)
  //       }
  //       else{
  //           console.log(response.status, response.statusText)
  //       }
  //       }catch(error){
  //           console.log(error)
  //       }
  //   }
  //   //if eventId is confirmed, fetch details
  //   if(eventId){
  //       fetchEventDetails();
  //   }
    
  // }, [eventId, router.asPath]);

  function normalizeFreetimesToCommonTimezone(user:User) {
    const targetTimezone = props.event.timezone
    return user.freetime.map((freetime) => {
      const [dateStr, timeStr] = freetime.split("_");
      const dateTime = DateTime.fromFormat(dateStr + ' ' + timeStr, 'LLL,dd,yyyy HH:mm', {
        zone: user.timezone,
      });
       // Convert to the new timezone
    const convertedDateTime = dateTime.setZone(targetTimezone);
    // Format the date and time string in your desired format
    const formattedDateTime = convertedDateTime.toFormat('LLL,dd,yyyy_HH:mm');

    return formattedDateTime;
    });
  }
 

  function normalizeDays(user:User) {
    const targetTimezone = props.event.timezone;

    // Create a mapping function to process a user's freetime
    const normalizedFreetime = user.freetime.map((freetime) => {
      const [daysStr, timeStr] = freetime.split('_');
      const days = daysStr.split('_');
      const formattedTime = DateTime.fromFormat(timeStr, 'HH:mm', { zone: user.timezone })
      .setZone(targetTimezone)
      .toFormat('HH:mm');
      const daysString = days.join('_');
      return `${daysString}_${formattedTime}`;
  });
  return normalizedFreetime;
}


  return (
    <Grid.Col>
    {props.eventTimes.map((time:Date, index:number) => {
      let isTimeSelected:boolean=false;
      let percentage=0;
      let id="";
      let year=0, month="", day=0;
      const userNames:string[]= [];
      // if event exists
      if(props.event){
        // and dates has values in it
        if(props.event.dates.length>0){
          const newDate=new Date(props.date)
          month = newDate.toLocaleString('default', { month: 'short' });
          day = newDate.getDate();
          year = newDate.getFullYear();
          id = `${month},${day},${year}_${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
        }
        // else, process id with regards to days instead
        else{
          id=`${props.date}_${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`
        }
      }
     
      const serverUsersFreetime = props.event.all_users_freetime;
      const serverTimeZone = props.event.timezone
      // if all users view is enabled and props.event exists
      if(isAllUsersViewEnabled && serverUsersFreetime.length>0){

        // if true and event exists, loop through every user in all_users_freetime and show their freetimes on the grid
        // store all users sharing the same time slot to userNames array, then assign it to data-names
        serverUsersFreetime.forEach((user:any,index:number)=>{

          // if user exists
          if (user) {
            if (user.timezone !== serverTimeZone && props.event.dates.length>0) {
              const normalizedFreetime = normalizeFreetimesToCommonTimezone(user);
              if (normalizedFreetime.includes(id)) {
                isTimeSelected = true;
                userNames.push(user.name);
              }
            }
            else if (user.timezone !== serverTimeZone && props.event.days.length>0) {
              const normalizedFreetime = normalizeDays(user);
              if (normalizedFreetime.includes(id)) {
                isTimeSelected = true;
                userNames.push(user.name);
              }
            }
            else if (user.timezone === serverTimeZone && user.freetime.includes(id)) {
              isTimeSelected = true;
              userNames.push(user.name);
            }
          }
            

          percentage = (userNames.length/serverUsersFreetime.length)*100;    
        })
       
      }
      else{
        if(bufferedTimes.includes(id)){
          isTimeSelected=true;
        }
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
              <Tooltip label={sharedUsers ? sharedUsers : "None"}>
                <div
                id={id}
                className={`w-12 h-6 border border-black flex items-center justify-center`}
                style={{ backgroundImage: isTimeSelected && !isAllUsersViewEnabled ? `url(${check.src})` : "none",
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '50%', }}
                data-date={`${year}-${month}-${day}`}
                data-time={`${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`}
                data-names={sharedUsers}
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
              </Tooltip>
            </div>
          </div>
      )
    })}
  </Grid.Col>
  )
}