import Layout from '../app/components/Layout'
import TimesDropdown from '@/app/components/TimesDropdown';
import { Group } from '@mantine/core';
import DateFormatPicker from '@/app/components/DateFormatPicker';
import DateSelectorElement from '@/app/components/DateSelectorElement';
import '../app/styles/input.css'
import '../app/styles/background.css'
import '../app/styles/calendar.css'
import { Provider } from 'react-redux';
import { useAppSelector } from '@/app/components/redux/hooks';
import store from '../app/components/redux/store';


export default function Main() {

  

  return (
    <Provider store={store}>
          <Layout>
          <div id='mainContent' className="flex flex-col justify-center items-center h-screen background-animation
            rounded-lg">
            <div id="eventCreationWindow" className="flex flex-col justify-center content-center p-5 rounded-lg
                bg-[rgba(255,255,255,0.5)] shadow-md backdrop-blur-sm rounded-lg h-[45rem]">
              <form action="http://localhost:3000" method='POST' className="flex flex-col justify-center content-center">
                    <div className="flex justify-center content-center">
                      <label htmlFor="eventName" className="text-xl text-white"> Event:
                        <input type="text" placeholder="Enter event name here!"
                        className="input-effect ::placeholder:text-black-200"
                        name="eventName"/>
                      </label>
                    </div>
              <h1 className='text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>What times will work?</h1>
                <TimesDropdown timeType='initialTime'/>
                <TimesDropdown timeType='finalTime'/>
                <DateFormatPicker/>
                <DateSelectorElement/>
                <button type="submit" className='rounded-lg p-4 m-4 border border-solid border-black text-white
                      drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] w-30
                      hover:shadow-lg hover:bg-black transition'>
                Create new event →</button>
              </form>
          </div>
    
          </div>
          </Layout>
    
  </Provider>
    )
  }
  