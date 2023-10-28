import Image from 'next/image'
import Index from '../pages/index'
import Layout from '../app/components/Layout'


export default function About() {
  return (
    <div>
        <Layout>
        <div className='h-screen text-white flex flex-col justify-center items-center'>
          <h1 className='text-xl'>Welcome to CanWeMeet, a simple and intuitive tool to arrange free time with friends,
            family, or colleagues!</h1>
          <h1 className='text-xl'>Inspired by 
            <a className="underline hover:color-grey" href="https://www.when2meet.com/"> when2meet.com</a>
          </h1>
        </div>
        </Layout>
    </div>
  )
}
