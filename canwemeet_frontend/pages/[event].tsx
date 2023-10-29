import React, {useState,useEffect, ReactNode} from "react";
import { useRouter } from 'next/router';
import {createClient} from '@supabase/supabase-js'
require('dotenv').config();

export const dynamic = "force-dynamic";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Event() {

    const [event, setEvent] = useState(null);

    const router = useRouter();
    const currentUrl = router.asPath;
    const eventId = currentUrl.replace(/^\/+/, '');

    useEffect(() => {
      console.log(eventId)
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

    

    return (
      <div>
      {event ? (
        <div>
          {Object.entries(event).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {value as ReactNode}
          </div>
        ))}</div>
      ) : (
        <p>Loading event details...</p>
      )}
    </div>
    )
}