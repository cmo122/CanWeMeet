import Image from 'next/image'
import Index from '../pages/index'
import Layout from '../app/components/Layout'
import '../app/styles/background.css'
import { useForm, SubmitHandler  } from "react-hook-form";
import '../app/styles/input.css'
import { useEffect } from 'react';

type SignupValues = {
  username: string
  password: string
  confirmPassword:string
}
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function SignUp() {


  const { register, handleSubmit, setError, formState: { errors }, formState} = useForm<SignupValues>()

  const onSubmit:SubmitHandler<SignupValues> = async data => {
    await sleep(3000);

    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual', 
        message: 'Passwords do not match',
      });
      
    }
    try {
      const response = await fetch('http://localhost:1234/signup',
        {
          method: "POST",
          headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)}
      );
      
      if (response.ok) {
        console.log(data)
      } else {
        console.log("User creation failed!")
        console.log(response.status, response.statusText)
        return response
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div >
      <Layout>
        <div id="signup" className="h-screen flex flex-col justify-center items-center bg-orange-200 background-animation">
          <div id="signup" className="flex flex-col justify-center content-center p-5 rounded-lg
          bg-[rgba(255,255,255,0.5)] shadow-md backdrop-blur-sm rounded-lg h-[35rem]">
            <form className="flex flex-col"  action="" method="" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="username" className="text-xl text-white"> Username
              </label>
                <input type="text" className="text-white input-effect ml-6" id="username"
                {...register("username", { required: true, minLength: 4})} />
                {errors.username?.type === "required" && <p role="alert" className='text-red-500'>Username required</p>}
              
              <label htmlFor="password" className="text-xl text-white"> Password
              </label>
                <input type="password" className="input-effect right-100 text-white" id="password"
                {...register("password", { required: true, minLength: 8})} />
                {errors.password?.type === "required" && <p role="alert" className='text-red-500'>Password required</p>}
              
              <label htmlFor="confirmPassword" className="text-xl text-white"> Confirm Password
              </label>
                <input type="password" className="input-effect right-100 text-white" id="confirmPassword"
                {...register("confirmPassword", { required: true, minLength: 8 })} />
                {errors.confirmPassword?.type==="minLength" && <p role="alert" className='text-red-500'>Password is too short</p>}
                {errors.confirmPassword && <p role="alert" className='text-red-500'>Passwords don't match</p>}
              <button type="submit" className='rounded-lg p-4 m-4 border border-solid border-black w-30 text-white
              hover:shadow-lg  hover:bg-black transition'>
                Sign Up →</button>
                
            </form>
          </div>
        </div>
      </Layout>
    </div>
  )
}
