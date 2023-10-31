import React, {useState,useEffect} from "react";
import { Grid, rem } from '@mantine/core';
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
    '--grid-justify':'end',
    '--grid-align':'end'
  },
};

export default function Event() {

    const [event, setEvent] = useState<any>(null);
    const [sortedDates, setSortedDates] = useState<any>([])
    const [eventTimes, setEventTimes]=useState<any>([])

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
      

    function generateTimeGrids(outerIndex:number){
      return (
      <div>
        {eventTimes.map((time:Date, index:number) => {
          return(
              <div className="flex" key={index}>
                {outerIndex === 0 && (
                  <div>
                    <div className="text-xs">
                      {time.getMinutes() === 0 ? `${time.getHours() < 10 ? '0' : ''}${time.getHours()}:00` : ''}
                      {time.getMinutes() !== 0 ? `${time.getHours() < 10 ? '0' : ''}${time.getHours()}:${time.getMinutes()}` : ''}
                    </div>
                  </div>
                )}
                <div>
                  <div className="w-10 h-4 border border-black"></div>
                </div>
              </div>
          )
        })}
      </div>
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


    return (
      <Layout>
      {event && sortedDates ? (
        <div className="flex h-screen w-screen justify-center">
          <GlassWindow >
            <h5 className="text-4xl"><strong>{event.eventName}</strong></h5>

            <div className="rounded-lg border border-sky-500">{window.location.href}
              <button className="rounded-lg border-solid border border-sky-500 p-1 m-5">Copy Link</button>
            </div>

            <Grid styles={customGridStyles} 
            gutter={{base:6}}>
              {sortedDates.map((date : string, index : number)=>{
                const convertDate=new Date(date)
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
                const formattedDate = `${monthNames[convertDate.getMonth()]} ${convertDate.getDate()}`;
                return(
                  <Grid.Col  span="auto">
                    <div key={index}>
                        <div>
                          <p className=" flex text-sm justify-end">{formattedDate}</p>
                          <p className=" flex text-sm justify-end">{dayNames[convertDate.getDay()]}</p>
                        </div>
                        {generateTimeGrids(index)}
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