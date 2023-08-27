import Layout from '../app/components/Layout'
// import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { Group } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import '../app/styles/input.css'
import '../app/styles/background.css'
import React, {useState} from 'react'

export default function Main() {
  const [date, setDate] = useState<string | Date | Date[] | null>(null);
  return (
        <Layout>
        <div id='mainContent' className="flex flex-col justify-center items-center h-screen background-animation
          border rounded-lg w-90">
        <div className="flex flex-col justify-center content-center p-5 rounded-lg 
            bg-[rgba(255,255,255,0.4)] shadow-md backdrop-blur-xl rounded-lg">
              <div className="flex justify-center content-center">
                <input type="text" placeholder="Enter event name here!"
                  className="input-effect ::placeholder:text-black-200" />
              </div>
              <Group position="center">
                <Calendar type="range" className='bg-black-0 backdrop-blur-lg'/>
              </Group>
              <button className='rounded-lg p-4 m-4 border border-solid border-black w-30
              hover:shadow-lg hover:text-white hover:bg-black transition'>
                Create new event →</button>
            </div>
          </div>
        </Layout>
      
    )
  }
  