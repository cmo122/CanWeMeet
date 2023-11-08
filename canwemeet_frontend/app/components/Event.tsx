import React, {useState,useEffect, FormEventHandler} from "react";
import { Grid, TextInput, Button } from '@mantine/core';
import { useRouter } from 'next/router';
import Image from "next/image";
import Layout from './Layout'
import '../styles/event.css'
import '../styles/loading.css'
require('dotenv').config();
import GlassWindow from "@/app/components/GlassWindow";
import { useAppSelector, useAppDispatch } from "@/app/components/redux/hooks";
import { setSelectedTimes } from "./redux/selectedTimesSlice";
import TimeGridViewPicker from "@/app/components/TimeGridViewPicker";
import TimeGrids from "@/app/components/TimeGrids";
import checkCircle from './icons/check_circle.svg'

export const dynamic = "force-dynamic";

const customGridStyles = {
  root: {
    'overflow-x': "auto",
    
  },
  col:{
    'margin-right':'-10px',
    'padding':'0px'
  }
};

interface User {
  name: string;
  freetime: string[];
  timezone:string
}

export default function Event() {
  const router = useRouter();
  // Event states
  
  const [eventId, setEventId] = useState('');
  const [event, setEvent] = useState<any>(null);
  const [eventTimes, setEventTimes]=useState<any>([])
  const [sortedDates, setSortedDates] = useState<any>([])
  const [days, setDays] = useState<any>([])
  const [confirmAnimation, setConfirmAnimation]= useState<boolean>(false)
  const [loadingAnimation, setLoadingAnimation]= useState<boolean>(false)
  // User states
  const [nameInput, setNameInput]=useState<string>('')
  const [anonUser, setAnonUser] = useState<User>({name:'', freetime:[], timezone:''})

  //Redux state initialization
  const selectedTimes = useAppSelector((state) => state.selectedTimes);
  const dispatch= useAppDispatch();

  // to be fired by user, updates event state once finished
  async function updateFreetime(){
    setLoadingAnimation(true)
    const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if(anonUser.name && selectedTimes.length>0){
          try{
              const response = await fetch(`http://localhost:1234/${eventId}`,
              {method: "POST",
              headers: {
              'Content-Type': 'application/json',
              },
              body: JSON.stringify({name:anonUser.name,freetime:selectedTimes,timezone:systemTimezone})}
          );

          if(response.ok){
              const eventData = await response.json();
              setEvent(eventData[0])
              setConfirmAnimation(true)
              setTimeout(()=>setConfirmAnimation(false),1000)
          }
          else{
              console.log(response.status, response.statusText)
          }
          }catch(error){
              console.log(error)
          }
      }
      setLoadingAnimation(false)
  }

  function convertDateStringsToDates(timeString:string, dateStrings:string[], timezone:string) {
    if(timeString.length>0){
      const timeDate = new Date();
      const [hour, minute] = timeString.split(":").map(Number);
    
      timeDate.setHours(hour, minute, 0, 0);
    
      const newDates = dateStrings.map((dateStr) => {
        const date = new Date(dateStr);
        date.setHours(timeDate.getHours(), timeDate.getMinutes());
        //include timezone offset
        const newDate = new Date(date.toLocaleString('en-US', { timeZone: timezone}));
        return new Date(newDate);
      });
      
      return newDates;
    }
  }

  function convertDatesToNewTimeZone(dates: Date[], originalTimeZone: string, newTimeZone: string) {
      const newTimezoneDates=dates.map( (date) => {
        const utcTime = new Date(date.toLocaleString('en-US', { timeZone: originalTimeZone }));
        const newDate = new Date(utcTime.toLocaleString('en-US', { timeZone: newTimeZone }));
        return newDate;
      })
      return newTimezoneDates
  }
  
  function convertDate(newTimeZone:string) {
    if (event) {
      // Convert current event time and date strings to actual date objects
      const initialEventDates = convertDateStringsToDates(event.initialTime, event.dates, event.timezone) || [];
      const finalTimeConverted = convertDateStringsToDates(event.finalTime, event.dates, event.timezone) || [];

      // Take previous conversion and convert to the new timezone
      const convertedInitialDates = convertDatesToNewTimeZone(initialEventDates, event.timezone, newTimeZone);
      const convertedFinalDates = convertDatesToNewTimeZone(finalTimeConverted, event.timezone, newTimeZone);

      // Extract new time strings from timezone-converted values
      if(convertedInitialDates.length>0 && convertedFinalDates.length>0){
        const newInitialTime = new Date(convertedInitialDates[0]);
        const initialHours = newInitialTime.getHours();
        const initialMinutes = newInitialTime.getMinutes();
        const initialSeconds = newInitialTime.getSeconds();
        const formattedInitialTime = `${String(initialHours).padStart(2, '0')}:${String(initialMinutes).padStart(2, '0')}:${String(initialSeconds).padStart(2, '0')}`;
        const newFinalTime = new Date(convertedFinalDates[0]);
        const finalHours = newFinalTime.getHours();
        const finalMinutes = newFinalTime.getMinutes();
        const finalSeconds = newFinalTime.getSeconds();
        const formattedFinalTime = `${String(finalHours).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}:${String(finalSeconds).padStart(2, '0')}`;
        // Update local state with time zone adjustment
        setEvent({ ...event, initialTime: formattedInitialTime, finalTime: formattedFinalTime, timezone: newTimeZone, dates:convertedInitialDates });
      }
    }
  }

  useEffect(()=>{
    setEventId(router.asPath.replace(/^\/+/, ''))
  },[router.asPath])

  // Sets event ID, then sets even state to correct row in supabase upon page load
  useEffect(() => {
      async function fetchEventDetails() {
          try{
              const response = await fetch(`http://localhost:1234/${eventId}`,
              {method: "GET",
              headers: {
              'Content-Type': 'application/json',
              }}
          );

          if(response.ok){
              const eventData = await response.json();
              setEvent(eventData)
          }
          else{
              console.log(response.status, response.statusText)
          }
          }catch(error){
              console.log(error)
          }
      }
      //if eventId is confirmed, fetch details
      fetchEventDetails();
      
  }, [eventId]);

  // Sets time range for time grid generation
  // converts times if time zones differ
  useEffect(()=>{
    
    let newDates;
    // if event exists
    if(event && typeof event.initialTime === 'string'){
      //set to new york for testing purposes
      // *********
      // CHANGE BACK TO SYSTEM VALUE ONCE DONE TESTING  
      //**********
      const currentUserTimezone = "America/New_York"
      // const currentUserTimezone = event.timezone
      // TIMEZONE STUFF
      // if local timezone doesnt match with event timezone, convert event values to
      // local timezone's
      if(currentUserTimezone!==event.timezone){
        // convert initial time zone times to actual dates
        convertDate(currentUserTimezone)
      }
      //then, proceed as normal
      if(event.dates.length>0) {
        newDates= event.dates.map((dateStr:string) => new Date(dateStr)).sort((a:any,b:any)=> a-b);
        setSortedDates(newDates)
      }
      else{
        setDays(event.days)
      }
      const initialTime= new Date()
      initialTime.setHours(Number(event.initialTime.substring(0,2)))
      initialTime.setMinutes(0)

      const finalTime= new Date()
      finalTime.setHours(Number(event.finalTime.substring(0,2)))
      finalTime.setMinutes(0)

      if(initialTime>finalTime){
        finalTime.setDate(finalTime.getDate() + 1);
      }

      let iteratorTime= new Date(initialTime)
      
      const timeIntervals = [];
      while(iteratorTime<=finalTime){
        timeIntervals.push(new Date(iteratorTime))
        iteratorTime.setMinutes(iteratorTime.getMinutes() + 30)
        // if iteratorTime crosses midnight, set time to next day
        if (iteratorTime.getHours() === 24 && iteratorTime.getMinutes() === 0) {
          iteratorTime.setDate(iteratorTime.getDate() + 1);
          iteratorTime.setHours(initialTime.getHours());
        }
      }
      setEventTimes(timeIntervals);
      }
  },[event])

    // sets selectedTimes to server time once existing user name is confirmed
    useEffect(()=>{
        if(event && anonUser.name){
            const existingUser = event.all_users_freetime.find((user:User) => user.name === anonUser.name);
            if(existingUser){
                const userServerFreetime = existingUser.freetime;
                dispatch(setSelectedTimes(userServerFreetime))
            }
        }
        if(event && anonUser.name===''){
          dispatch(setSelectedTimes([]))
        }
        console.log(event)
    }, [anonUser, event])

    // Sets user details upon entering name
    const handleSubmit: React.FormEventHandler = (e) => {
      e.preventDefault();
      const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setAnonUser({name:nameInput, freetime:[], timezone:systemTimezone});
    }

    return (
        <Layout>
        {event && sortedDates ? (
          <div className="flex justify-center items-center">
            <GlassWindow >
            <h5 className="text-4xl"><strong>{event.eventName}</strong></h5>

            <div className="rounded-lg border border-sky-500 m-2 overflow:auto">{window.location.href}
                <button className={`rounded-lg border-solid border border-sky-500 p-1 m-5 
                `}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
                >Copy Link</button>
            </div>

            {anonUser.name==='' && 
            <form onSubmit={handleSubmit}>
            <TextInput
            label="Enter name to start entering dates: "
            placeholder="John Doe"
            onChange={(e) => setNameInput(e.target.value)}
            />
            
            <Button type='submit' className="bg-blue-500 m-2">Sign In</Button>
            </form>}

            {anonUser && <div>{anonUser.name}</div>}
            {anonUser.name && <Button onClick={()=>setAnonUser({name:"",freetime:[], timezone:""})} className="bg-blue-500 m-2">Sign Out</Button>}
            {anonUser.name && <Button className="flex items-center justify-center bg-blue-500 m-2" onClick={()=>updateFreetime()}>
            {loadingAnimation ? (
              <div className="sk-circle">
                <div className="sk-circle1 sk-child"></div>
                <div className="sk-circle2 sk-child"></div>
                <div className="sk-circle3 sk-child"></div>
                <div className="sk-circle4 sk-child"></div>
                <div className="sk-circle5 sk-child"></div>
                <div className="sk-circle6 sk-child"></div>
                <div className="sk-circle7 sk-child"></div>
                <div className="sk-circle8 sk-child"></div>
                <div className="sk-circle9 sk-child"></div>
                <div className="sk-circle10 sk-child"></div>
                <div className="sk-circle11 sk-child"></div>
                <div className="sk-circle12 sk-child"></div>
            </div>
            ) : confirmAnimation ? (
              <Image src={checkCircle} alt="Check circle" className="confirm-animation" />
            ) : (
              'Update Freetime'
            )}
            </Button>}

            
            <p>Current time grid view:</p>
            <TimeGridViewPicker/>
            <Grid styles={customGridStyles}
            gutter={0}>
                {sortedDates.length>0 && sortedDates.map((date : string, index : number)=>{
                    const convertDate=new Date(date)
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
                    const formattedDate = `${monthNames[convertDate.getMonth()]} ${convertDate.getDate()}`;
                    return(
                    <Grid.Col span={12/sortedDates.length} key={index}>
                        <div>
                            <p className=" flex text-sm justify-end">{formattedDate}</p>
                            <p className=" flex text-sm justify-end">{dayNames[convertDate.getDay()]}</p>
                        </div>
                        <div className="flex">
                            <TimeGrids
                            outerIndex={index}
                            date={date}
                            eventTimes={eventTimes}
                            user={anonUser}
                            event={event}
                            />
                        </div>
                    </Grid.Col>
                    )
                })}
                {days.length>0 && days.map((date : string, index : number)=>{
                    return(
                    <Grid.Col span={4} key={index}>
                        <div>
                            <p className=" flex text-sm justify-end">{date}</p>
                        </div>
                        <div className="flex">
                            <TimeGrids
                            outerIndex={index}
                            date={date}
                            eventTimes={eventTimes}
                            user={anonUser}
                            event={event}
                            />
                        </div>
                    </Grid.Col>
                    )
                })}
            </Grid>

            </GlassWindow>
          </div>
        ) : (
          <p className="h-screen">Loading event details...</p>
        )}
      </Layout>
    )
}