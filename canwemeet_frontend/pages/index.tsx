import Layout from '../app/components/Layout'
import Calendar from '../app/components/Calendar'
import '../app/styles/input.css'

export default function Main(){
  return (
        <Layout>
        <div id='mainContent' className="h-screen bg-orange-200">
          <div className=" flex justify-center content-center">
            <input type="text" placeholder="Enter event name here!"
              className="input-effect" />
          </div>
          <Calendar/>
        </div>
        </Layout>
      
    )
  }
  