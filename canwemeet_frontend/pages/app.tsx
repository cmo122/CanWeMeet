import Layout from '../app/components/Layout'
import TimesDropdown from '@/app/components/TimesDropdown';
import DateFormatPicker from '@/app/components/DateFormatPicker';
import DateSelectorElement from '@/app/components/DateSelectorElement';
import '../app/styles/input.css'
import '../app/styles/background.css'
import '../app/styles/calendar.css'
import { Provider } from 'react-redux';
import store from '../app/components/redux/store';
import { useForm, SubmitHandler  } from "react-hook-form";
import React, {  useEffect, useState } from 'react';
import { useAppSelector } from '../app/components/redux/hooks';


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
  const dateView = useAppSelector((state) => state.dateView);

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
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: formData, 
  });

  const onSubmitCustom: SubmitHandler<IFormInput>= async (data:any) => {
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

  useEffect(() => {
    reset(defaultFormData);
      
  },[dateView])
  
  return (
    <Provider store={store}>
          <Layout>
          <div id='mainContent' className="flex flex-col justify-center items-center min-h-screen
            rounded-lg">
            <div id="eventCreationWindow" className="flex flex-col justify-center items-center p-5 rounded-lg
                bg-[rgba(255,255,255,0.5)] shadow-md backdrop-blur-sm rounded-lg max-md:w-[21rem] max-md:h-[45rem]">
              <form onSubmit={handleSubmit(onSubmitCustom)} className="flex flex-col justify-center content-center max-md:w-[20rem] max-md:h-[20rem]">
                <div className="flex justify-center content-center">
                  <label htmlFor="eventName" className="text-xl text-white"> Event:
                    <input type="text" placeholder="Enter event name here!"
                    className="input-effect ::placeholder:text-black-200 max-md:w-[16rem]"
                    {...register("eventName")}/>
                  </label>
                </div>
                <h1 className='text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>What times will work?</h1>
                <TimesDropdown timeType='initialTime' register={register}/>
                <TimesDropdown timeType='finalTime' register={register}/>
                <DateFormatPicker/>
                <DateSelectorElement control={control}/>
                <button type="submit" className='rounded-lg p-4 m-4 border border-solid border-black text-white
                      drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]
                      hover:shadow-lg hover:bg-black transition'>
                Create new event →</button>
              </form>
          </div>
          </div>
          </Layout>
  </Provider>
    )
  }
  