import { useEffect, useState } from "react";
import { Grid } from "@mantine/core";
import {createClient} from '@supabase/supabase-js'
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/app/components/redux/hooks';
import {toggleTimeGridView} from './redux/timeGridViewSlice'
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

  interface AllUsersFreetimeViewProps {
    event: any;
    eventTimes: string[]
  }

export default function AllUsersFreetimeView(props: AllUsersFreetimeViewProps){


    const [event, setEvent] = useState<any>(props.event);
    const [eventTimes, setEventTimes]=useState<any>(props.eventTimes)
    const [sortedDates, setSortedDates] = useState<any>([])

      useEffect(()=>{
        let newDates;
        
        if(event) {
          newDates= event.dates
          .map((dateStr:string) => new Date(dateStr))
          .sort((a:any,b:any)=> a-b);
        }
        setSortedDates(newDates)
  
      },[event])
      
      useEffect(() => {
          async function fetchEventDetails() {
            try {
              const { data, error } = await supabase
                .from('Events')
                .select('*')
                .eq('eventID', event.eventID)
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
        }, [event]);

    function generateTimeGrids(outerIndex:number, date:string){
        const newDate=new Date(date)
        const month = newDate.toLocaleString('default', { month: 'short' });
        const day = newDate.getDate();
        const year = newDate.getFullYear();
        return (
          <Grid.Col>
          {eventTimes.map((time:Date, index:number) => {
            const id:any = `${month},${day},${year}_${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
            const userFreetime= event.all_users_freetime[0].freetime
            const isDivSelected = userFreetime.includes(id);
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

                    >
                    </div>
                  </div>
                </div>
            )
          })}
        </Grid.Col>
        )
      }

    return(
        <div>
            <p>All Users Freetime</p>
            { event && <Grid styles={customGridStyles}
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
            </Grid>}
            
        </div>
    )
}