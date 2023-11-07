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
    const [anonUser, setAnonUser] = useState<User>({name:'', freetime:[]})

    //Redux state initialization
    const isAllUsersViewEnabled = useAppSelector((state) => state.allUsersView);
    const selectedTimes = useAppSelector((state) => state.selectedTimes);
    const mostSharedTimes=useAppSelector((state)=>state.mostSharedTimes)
    const dispatch= useAppDispatch();

    // to be fired by user, updates event state once finished
    async function updateFreetime(){
      setLoadingAnimation(true)
        if(anonUser.name && selectedTimes.length>0){
            try{
                const response = await fetch(`http://localhost:1234/${eventId}`,
                {method: "POST",
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({name:anonUser.name,freetime:selectedTimes})}
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

    // Sets event ID, then sets even state to correct row in supabase upon page load
    useEffect(() => {
        setEventId(router.asPath.replace(/^\/+/, ''));
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
        if(eventId){
            fetchEventDetails();
        }
        
    }, [eventId, router.asPath]);

    // Sets time range for time grid generation
    useEffect(()=>{
      const timeIntervals = [];
      if(event){
        const initialTime= new Date()
        initialTime.setHours(Number(event.initialTime.substring(0,2)))
        initialTime.setMinutes(0)
        initialTime.setSeconds(0)
        const finalTime= new Date()
        finalTime.setHours(Number(event.finalTime.substring(0,2)))

        let iteratorTime= new Date(initialTime)

        while(iteratorTime<=finalTime){
          timeIntervals.push(new Date(iteratorTime))
          iteratorTime.setMinutes(iteratorTime.getMinutes() + 30)
        }
        
      }
      setEventTimes(timeIntervals);
      
    },[event])

    // sorts dates and sets user's times to sorted dates once event data is loaded
    // if days is selected, sets days state
    useEffect(()=>{
      let newDates;
      if(event){
        if(event.dates.length>0) {
          newDates= event.dates
          .map((dateStr:string) => new Date(dateStr))
          .sort((a:any,b:any)=> a-b);
          setSortedDates(newDates)
        }
        else{
          setDays(event.days)
        }
      }

    },[event])  

    // sets selectedTimes to server time once existing user name is confirmed
    useEffect(()=>{
        if(event){
            const existingUser = event.all_users_freetime.find((user:User) => user.name === anonUser.name);
            if(existingUser){
                const userServerFreetime = existingUser.freetime;
                dispatch(setSelectedTimes(userServerFreetime))
            }
        }
    }, [anonUser, event])

    // Sets user details upon entering name
    const handleSubmit: React.FormEventHandler = (e) => {
      e.preventDefault();
      setAnonUser({name:nameInput, freetime:[]});
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
            <Button className="flex items-center justify-center bg-blue-500 m-2" onClick={()=>updateFreetime()}>
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
            </Button>
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
                    <Grid.Col span={3} key={index}>
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
                    <Grid.Col span={3} key={index}>
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