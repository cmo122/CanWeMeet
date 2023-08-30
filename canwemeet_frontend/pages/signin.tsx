import Image from 'next/image'
import Index from '../pages/index'
import Layout from '../app/components/Layout'
// import Typewriter from 'typewriter-effect/dist/core'
import '../app/styles/background.css'
import '../app/styles/input.css'


export default function SignIn() {
  return (
    <div >
        <Layout>
          <div id="signin" className="h-screen flex flex-col justify-center items-center bg-orange-200 background-animation">
            <form action="" method='POST' className="flex flex-col">
            <label htmlFor="username" className="text-xl text-white"> Username
            </label>
            <input type="text" placeholder="John Doe" className="text-white input-effect ml-6" name="username">
                </input>
            <label htmlFor="password" className="text-xl text-white"> Password
            </label>
            <input type="password" className="input-effect right-100 text-white" name="password">
                </input>
            <button className='rounded-lg p-4 m-4 border border-solid border-black w-30 text-white
              hover:shadow-lg  hover:bg-black transition'>
              Sign In →</button>
            <a className="text-white hover:text-gray-400" href="/signup">Create account</a>
            <a className="text-white hover:text-gray-400" href="">Forgot password?</a>
            </form>
          </div>
        </Layout>
    </div>
  )
}
