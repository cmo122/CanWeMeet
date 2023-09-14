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


export default function Main() {
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  // const handleSubmit = async (e: React.SyntheticEvent) => {
  //   e.preventDefault();
  //   console.log(e.target)
  //   if (e.currentTarget instanceof HTMLFormElement) {
  //     const formData = new FormData(e.currentTarget);
  //     fetch('http://localhost:1234', {
  //       method: 'POST',
  //       body: formData,
  //     })
  //       .then((response) => {
  //         console.log(formData)
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //       });
  //   }
  // }
  
  return (
    <Provider store={store}>
          <Layout>
          <div id='mainContent' className="flex flex-col justify-center items-center h-screen background-animation
            rounded-lg">
            <div id="eventCreationWindow" className="flex flex-col justify-center content-center p-5 rounded-lg
                bg-[rgba(255,255,255,0.5)] shadow-md backdrop-blur-sm rounded-lg h-[45rem]">
              <form onSubmit={handleSubmit((data)=>console.log(data))} className="flex flex-col justify-center content-center">
                <div className="flex justify-center content-center">
                  <label htmlFor="eventName" className="text-xl text-white"> Event:
                    <input type="text" placeholder="Enter event name here!"
                    className="input-effect ::placeholder:text-black-200"
                    {...register("eventName")}/>
                  </label>
                </div>
                <h1 className='text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>What times will work?</h1>
                <TimesDropdown timeType='initialTime' register={register}/>
                <TimesDropdown timeType='finalTime' register={register}/>
                <DateFormatPicker/>
                <DateSelectorElement register={register} control={control}/>
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
  