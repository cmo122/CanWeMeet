import { link } from 'fs';
import githublogo from '../components/icons/github-mark/github-mark.png'
import linkedinlogo from '../components/icons/LinkedIn-Logos/LI-In-Bug.png'
import Image from 'next/image';
import '../styles/footer.css'

export default function Footer() {
    return (
    <footer className="flex flex-col p-4 bg-black -z-2 footer
    bg-[rgba(255,255,255,0.4)] shadow-md backdrop-blur-xl">
        <nav>
            <ul className="group justify-center flex font-montserrat text-xl space-x-4">
                <li className='flex text-black items-center content-center justify-center'>Contact Me!</li>
                <li>
                    <a href="https://github.com/cmo122">
                        <Image className="w-14 h-14" src={githublogo} alt="GitHub Logo"/>
                    </a>
                </li>
                <li>
                    <a href="/about">
                        <Image className="w-16 h-14" src={linkedinlogo} alt="LinkedIn Logo"/>    
                    </a>
                </li>
            </ul>
        </nav>
    </footer>
    )
}