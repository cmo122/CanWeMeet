import Layout from '../app/components/Layout'
import TimesDropdown from '@/app/components/TimesDropdown';
import DaySelector from '@/app/components/DaySelector';
import { Group } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import '../app/styles/input.css'
import '../app/styles/background.css'
import '../app/styles/calendar.css'
import React, {useState} from 'react'

export default function Main() {
  const [date, setDate] = useState<string | Date | Date[] | null>(null);
  const [dateView, setDateView] = useState('dates');

  const changeDateView = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDateView(event.target.value);
  };

  return (
        <Layout>
        <div id='mainContent' className="flex flex-col justify-center items-center h-screen background-animation
          rounded-lg">
          <div id="eventCreationWindow" className="flex flex-col justify-center content-center p-5 rounded-lg 
              bg-[rgba(255,255,255,0.4)] shadow-md backdrop-blur-xl rounded-lg h-100">
                <div className="flex justify-center content-center">
                  <input type="text" placeholder="Enter event name here!"
                    className="input-effect ::placeholder:text-black-200" />
                </div>
            
            <h1 className='text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>What times will work?</h1>
          <div id='timeSelectInitial' className='flex justify-center items-center'>
            <p className='text-white'>No earlier than: </p>
            <TimesDropdown />
            <select name="" id="" className='m-2'>
              <option value="am">AM</option>
              <option value="pm">PM</option>
            </select>
          </div>
          <div id='timeSelectFinal' className='flex justify-center items-center'>
            <p className='text-white'>No later than: </p>
            <TimesDropdown />
            <select name="" id="" className='m-2'>
              <option value="am">AM</option>
              <option value="pm">PM</option>
            </select>
          </div>

            <h2 className='text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>Choose date format:</h2>
            <select onChange={changeDateView} name="dateSelect" id="dateSelect" className='rounded-sm m-3'>
              <option value="dates">Specific Dates</option>
              <option value="days">Days of the Week</option>
            </select>

            <Group position="center">
              {dateView === 'dates' && (
                <DatePicker type="multiple" className='bg-black-0 backdrop-blur-lg'/>
              )}
              {dateView === 'days' && (
              <DaySelector/>
              )}    
                </Group>
            <button className='rounded-lg p-4 m-4 border border-solid border-black text-white  
                  drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] w-30
                  hover:shadow-lg hover:bg-black transition'>
                    Create new event →</button>
          </div>
        </div>
        </Layout>
      
    )
  }
  