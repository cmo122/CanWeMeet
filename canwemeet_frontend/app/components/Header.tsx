import '../styles/header.css'
import Link from 'next/link'

export default function Header() {
    return (
    <header className="flex flex-col pt-4 mt-0 header">
        <nav>
            <ul className="flex group justify-center font-montserrat text-xl space-x-4">
                <li className='link'>
                    <Link href="/">CanWeMeet</Link>
                </li>
                <li className='link'>
                    <Link href="/about">About</Link>
                </li>
            </ul>
        </nav>
    </header>
    )
}