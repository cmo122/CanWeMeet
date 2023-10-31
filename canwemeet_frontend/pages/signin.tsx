import Layout from '../app/components/Layout'
// import Typewriter from 'typewriter-effect/dist/core'
import '../app/styles/background.css'
import '../app/styles/input.css'
import { useForm } from "react-hook-form";
import React from 'react'
import GlassWindow from '@/app/components/GlassWindow';


export default function SignIn() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  return (
    <Layout>
      <div id="signin" className="h-screen flex flex-col justify-center items-center">
        <div id="signinwindow" className="flex flex-col justify-center content-center p-5 rounded-lg
                bg-[rgba(255,255,255,0.5)] shadow-md backdrop-blur-sm rounded-lg h-[35rem] max-md:w-[21rem] max-md:h-[30rem]">
              <form action="" method='POST' className="flex flex-col">
                <label htmlFor="username" className="text-xl text-white"> Username
                </label>
                  <input type="text"
                  className="text-white input-effect ml-6"
                {...register("username", { required: true, minLength: 4, maxLength: 20 })} />
                {errors.username?.type === 'required' && <p
                  role="alert"
                  className='text-red-500'>
                  Username is required</p>}
                  {errors.username?.type === 'minLength' && <p role="alert">Username is too short</p>}
                <label htmlFor="password" className="text-xl text-white"> Password
                </label>
                  <input type="password"
                  className="input-effect right-100 text-white"
                  {...register("password", { required: true, minLength: 8 })}/>
                  <span id="passwordError" className="passwordError"/>
                <button className='rounded-lg p-4 m-4 border border-solid border-black w-30 text-white
                hover:shadow-lg  hover:bg-black transition'>
                Sign In →</button>
                <a className="text-white hover:text-gray-400" href="/signup">Create account</a>
                <a className="text-white hover:text-gray-400" href="">Forgot password?</a>
              </form>
          </div>
      </div>
    </Layout>
  )
}
