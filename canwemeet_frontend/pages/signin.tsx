import Image from 'next/image'
import Index from '../pages/index'
import Layout from '../app/components/Layout'
import Typewriter from 'typewriter-effect/dist/core'
import '../app/styles/input.css'


export default function About() {
  return (
    <div >
        <Layout>
          <div id="signin" className="h-screen flex flex-col justify-center items-center bg-orange-200">
            <form action="" method='POST' className="flex flex-col">
            <label htmlFor="username"> Username:
              <input type="text" placeholder="John Doe" className="input-effect" name="username">
                </input>
              </label>
            <label htmlFor="password"> Password:
                <input type="password" className="input-effect" name="password">
                </input>
              </label>
            </form>
          </div>
        </Layout>
    </div>
  )
}
