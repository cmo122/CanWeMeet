import '../styles/header.css'

export default function Header() {
    return (
    <header className="flex flex-col p-4 mt-0 bg-blue-300">
        <nav>
            <ul className="flex group font-montserrat text-xl space-x-4">
                <li className='underline-hover'>
                    <a href="/">CanWeMeet</a>
                </li>
                <li className='underline-hover'>
                    <a href="/about">About</a>
                </li>
                <li className='underline-hover'>
                    <a href="/signin">Sign In</a>
                </li>
            </ul>
        </nav>
    </header>
    )
}