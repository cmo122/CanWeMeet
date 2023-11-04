import React, {useState,useEffect, FormEventHandler} from "react";
import { Grid, TextInput, Button } from '@mantine/core';
import { useRouter } from 'next/router';
import Layout from './Layout'
import {createClient} from '@supabase/supabase-js'
import '../styles/event.css'
require('dotenv').config();
import GlassWindow from "@/app/components/GlassWindow";
import { useAppSelector } from "@/app/components/redux/hooks";
import AllUsersFreetimeView from "@/app/components/AllUsersFreetimeView";
import TimeGridViewPicker from "@/app/components/TimeGridViewPicker";
import TimeGrids from "@/app/components/TimeGrids";

export const dynamic = "force-dynamic";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

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
    // User states
    const [nameInput, setNameInput]=useState<string>('')
    const [anonUser, setAnonUser] = useState<User>({name:'', freetime:[]})

    const isTimeGridViewEnabled = useAppSelector((state) => state.timeGridView);
    const selectedTimes = useAppSelector((state) => state.selectedTimes);

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
      setEventTimes(timeIntervals)
    },[event])

    // Setup realtime freetime updates
    useEffect(() => {
        async function updateFreetime(){
            if(anonUser.name && selectedTimes.length>0){
            try{
                const response = await fetch(`http://localhost:1234/${eventId}`,
                {
                method: "POST",
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({name:anonUser.name,freetime:selectedTimes})}
            );

            if(response.ok){
                console.log(response.statusText)
            }
            else{
                console.log(response.status, response.statusText)
            }
            }catch(error){
                console.log(error)
                    }
                }
            }
            console.log(selectedTimes)
            updateFreetime()
            

  }, [selectedTimes]);
  
    // Sets event ID, then sets even state to correct row in supabase
    useEffect(() => {
        
        setEventId(router.asPath.replace(/^\/+/, ''));
            async function fetchEventDetails() {
            try {
                const { data, error } = await supabase
                .from('Events')
                .select('*')
                .eq('eventID', eventId)
                .single();
        
                if (error) {
                console.error('Error fetching event details:', error);
                } else {
                setEvent(data);
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        }
    
        fetchEventDetails();
      }, [eventId, router.asPath]);
    
    // sorts dates once event data is loaded
    useEffect(()=>{
      let newDates;
      
      if(event) {
        newDates= event.dates
        .map((dateStr:string) => new Date(dateStr))
        .sort((a:any,b:any)=> a-b);
      }
      setSortedDates(newDates)

    },[event])  

    // Sets user details upon entering name
    const handleSubmit: React.FormEventHandler = (e) => {
      e.preventDefault();
      setAnonUser({name:nameInput, freetime:[]});
    }

    return (
        <Layout>
        {event && sortedDates ? (
          <div className="flex flex-grow  justify-center">
            <GlassWindow >
              <h5 className="text-4xl"><strong>{event.eventName}</strong></h5>

              <div className="rounded-lg border border-sky-500 m-2">{window.location.href}
                <button className="rounded-lg border-solid border border-sky-500 p-1 m-5">Copy Link</button>
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

              <TimeGridViewPicker/>

              {!isTimeGridViewEnabled && <div>
                <p>Users Freetime</p>
                <Grid styles={customGridStyles}
                gutter={0}>
                {sortedDates.map((date : string, index : number)=>{
                    const convertDate=new Date(date)
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
                    const formattedDate = `${monthNames[convertDate.getMonth()]} ${convertDate.getDate()}`;
                    return(
                    <Grid.Col span={3}>
                        <div key={index}>
                            <div>
                            <p className=" flex text-sm justify-end">{formattedDate}</p>
                            <p className=" flex text-sm justify-end">{dayNames[convertDate.getDay()]}</p>
                            </div>
                        </div>
                        <div>
                        <TimeGrids
                        outerIndex={index}
                        date={date}
                        eventTimes={eventTimes}
                        user={anonUser}
                        selectedDivs={selectedTimes}
                        event={event}
                        />
                        </div>
                    </Grid.Col>
                    )
                })}
                </Grid>
              </div>}

              {isTimeGridViewEnabled && 
              <AllUsersFreetimeView event={event} eventTimes={eventTimes}/>}

            </GlassWindow>
          </div>
        ) : (
          <p className="h-screen">Loading event details...</p>
        )}
      </Layout>
    )
}