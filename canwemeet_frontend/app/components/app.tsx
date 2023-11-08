import Layout from './Layout'
import TimesDropdown from '@/app/components/TimesDropdown';
import DateFormatPicker from '@/app/components/DateFormatPicker';
import DateSelectorElement from '@/app/components/DateSelectorElement';
import '../styles/input.css'
import '../styles/background.css'
import '../styles/calendar.css'
import { useForm, SubmitHandler  } from "react-hook-form";
import React, {  useEffect, useState } from 'react';
import { useAppSelector } from './redux/hooks';
import GlassWindow from '@/app/components/GlassWindow';


interface IFormInput {
  eventName: string
  initialTime: string
  initialTimeMeridiem: string
  finalTime: string
  finalTimeMeridiem: string
  dates?: Date[]
  days?:string[]
}

export default function App() {
  const dateView = useAppSelector((state) => state.dateView || '');

  const defaultFormData: IFormInput = {
    eventName: "",
    initialTime: "01:00",
    initialTimeMeridiem: "am",
    finalTime: "05:00",
    finalTimeMeridiem: "pm",
    dates: [],
    days: [], 
  };

  const [formData, setFormData] = useState<IFormInput>(defaultFormData);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError, 
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: formData, 
  });

  function formatAsTimePG(timeString:string, timeMeridiem:string) {
    if(timeString){
        const timeParts = timeString.split(':');
        let hour = parseInt(timeParts[0]);
    
        if (timeMeridiem === 'pm' && hour < 12) {
            hour += 12;
        }
        
        const formattedHour = hour < 10 ? '0' + hour : hour.toString();

        const formattedTimePG = `${formattedHour}:${timeParts[1]}`;
    
        return formattedTimePG;
    }
  }

  const onSubmitCustom: SubmitHandler<IFormInput>= async (data:any) => {

    const result = validateTimeOrder(data.initialTime, data.finalTime, data.initialTimeMeridiem, data.finalTimeMeridiem);

    if(result){
      // Eastern timezone for testing only
      // REMOVE WHEN DONE
      data.timezone = 'America/New_York'
      await fetch('http://localhost:1234', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
      },
        body: JSON.stringify(data),
      })
      .then(async (response) => {
        if (response.status === 200) {
          const responseData = await response.json();
          const newURL = responseData.newURL;

          window.location.href = newURL;
        } else {
          console.log("Error: ", response);
        }
      })
      .catch((error) => {
        console.log(error)
      });
    }
      
}

  useEffect(() => {
    reset(defaultFormData);
      
  },[dateView])

  // time validation rule
  const validateTimeOrder = (initialTime:string, finalTime:string, initialTimeMeridiem:string, finalTimeMeridiem:string) => {
    const initialTimeDate = formatAsTimePG(initialTime, initialTimeMeridiem) || ""
    const finalTimeDate = formatAsTimePG(finalTime, finalTimeMeridiem) || ""
    if (initialTimeDate> finalTimeDate) {
      setError('initialTime', {
        type: 'manual',
        message: 'Initial time should be earlier than final time',
      });
        return false;
    } 
    else if (initialTimeDate === finalTimeDate) {
        setError('finalTime', {
          type: 'manual',
          message: 'Initial time and final time cannot be the same',
        });
        return false;
    }
    return true;
  };

  return (
          <Layout>
          <div id='mainContent' className="flex flex-col flex-grow justify-center items-center min-h-screen max-md:max-w-[20rem]">
          <GlassWindow>
            <form onSubmit={handleSubmit(onSubmitCustom)} className="flex flex-col justify-center content-center">
                <div className="flex justify-center content-center">
                  <label htmlFor="eventName" className="text-xl text-white"> Event:
                    <input type="text" placeholder="Enter event name here!"
                    className="input-effect ::placeholder:text-black-200 max-md:w-[16rem]"
                    {...register("eventName")}/>
                  </label>
                </div>
                <h1 className='text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>What times will work?</h1>
                <TimesDropdown timeType='initialTime' register={register}/>
                {errors.initialTime && <p className="error-message">{errors.initialTime.message}</p>}
                <TimesDropdown timeType='finalTime' register={register}/>
                {errors.finalTime && <p className="error-message">{errors.finalTime.message}</p>}
                <DateFormatPicker/>
                <DateSelectorElement control={control}/>
                <button type="submit" className='rounded-lg p-4 m-4 border border-solid border-black text-white
                      drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]
                      hover:shadow-lg hover:bg-black transition'>
                Create new event →</button>
            </form>
          </GlassWindow>
          </div>
          </Layout>
    )
  }
  