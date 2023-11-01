import React, {useState,useEffect, FormEventHandler} from "react";
import { Grid, TextInput, Button } from '@mantine/core';
import {useForm} from '@mantine/form'
import { useRouter } from 'next/router';
import Layout from '../app/components/Layout'
import {createClient} from '@supabase/supabase-js'
import '../app/styles/event.css'
require('dotenv').config();
import GlassWindow from "@/app/components/GlassWindow";

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

    const [event, setEvent] = useState<any>(null);
    const [sortedDates, setSortedDates] = useState<any>([])
    const [eventTimes, setEventTimes]=useState<any>([])
    const [nameInput, setNameInput]=useState<string>('')
    const [user, setUser] = useState<User>({name:'', freetime:[]})
    const [selectedDivs, setSelectedDivs] = useState<string[]>([]);
    const [mouseIsDown, setMouseIsDown] = useState(false);

    const router = useRouter();
    const currentUrl = router.asPath;
    const eventId = currentUrl.replace(/^\/+/, '');

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

    useEffect(() => {
      const handleBroadcasts = (payload:{ type: "broadcast"; event: string; payload: { [key: string]: any; }; }) => {
        console.log('Change received!', payload)
      }
      const subscription = supabase
        .channel("events")
        .on('broadcast', {event:"INSERT"}, handleBroadcasts)
        .subscribe()
    
      return () => {
        subscription.unsubscribe();
      };
    }, []);
    
    const handleMouseDown = (id:string) => {
      if (!selectedDivs.includes(id)) {
        setSelectedDivs((prevDivs) => [...prevDivs, id]);
      }
      setMouseIsDown(true);
    };
  
    const handleMouseUp = (id:string) => {
      setSelectedDivs((prevDivs) => prevDivs.filter((divId) => divId !== id));
      setMouseIsDown(false);
    };
  
    const handleMouseEnter = (id: string) => {
      if (mouseIsDown) {
        if (!selectedDivs.includes(id)) {
          setSelectedDivs((prevDivs) => [...prevDivs, id]);
        } else {
          setSelectedDivs((prevDivs) => prevDivs.filter((divId) => divId !== id));
        }
      }
    };
    
    

    function generateTimeGrids(outerIndex:number, date:string){
      const newDate=new Date(date)
      const month = newDate.toLocaleString('default', { month: 'short' });
      const day = newDate.getDate();
      const year = newDate.getFullYear();
      return (
        <Grid.Col>
        {eventTimes.map((time:Date, index:number) => {
          const id:any = `${month},${day},${year}_${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
          const isDivSelected = selectedDivs.includes(id);
          return(
              <div className="flex" key={index}>
                {outerIndex === 0 && (
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

    useEffect(() => {
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
      }, [eventId]);
    
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

    const handleSubmit: React.FormEventHandler = (e) => {
      e.preventDefault();
      setUser({name:nameInput, freetime:[]});
    }

    return (
      <Layout>
      {event && sortedDates ? (
        <div className="flex flex-grow  justify-center">
          <GlassWindow >
            <h5 className="text-4xl"><strong>{event.eventName}</strong></h5>

            <div className="rounded-lg border border-sky-500">{window.location.href}
              <button className="rounded-lg border-solid border border-sky-500 p-1 m-5">Copy Link</button>
            </div>

            {user.name==='' && 
            <form onSubmit={handleSubmit}>
              <TextInput
              label="Enter name to start entering dates: "
              placeholder="John Doe"
              onChange={(e) => setNameInput(e.target.value)}
              />
              
              <Button type='submit' className="bg-blue-500">Sign In</Button>
            </form>}

            {user && <div>{user.name}</div>}

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
                    <div>{generateTimeGrids(index, date)}</div>
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