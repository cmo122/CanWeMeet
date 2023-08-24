import Image from 'next/image'
import Header from './components/Header'
import Main from './pages/Main'
import Footer from './components/Footer'


export default function Home() {
  return (
    <div>
      <Header />
      <Main/>
      <Footer/>
    </div>
  )
}
