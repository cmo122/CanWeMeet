import Header from "./Header";
import Footer from "./Footer";
import React, { ReactNode } from "react";
import '../styles/background.css'

export default function Layout({children}:{children:ReactNode}) {
    return (
        <div id="layout" className="flex flex-col flex-grow background-animation">
            <Header />
                <main className="flex justify-center items-center max-md:m-5">{children}</main>
            <Footer/>
        </div>
    )
}