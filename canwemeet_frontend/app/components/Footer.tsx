import { link } from 'fs';
import githublogo from '../components/icons/github-mark/github-mark.png'
import linkedinlogo from '../components/icons/LinkedIn-Logos/LI-In-Bug.png'
import Image from 'next/image';

export default function Footer() {
    return (
    <footer className="flex flex-col p-4 bg-black">
        <nav>
            <ul className="flex group font-montserrat text-xl space-x-4">
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