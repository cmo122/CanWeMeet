import Header from "./Header";
import Footer from "./Footer";
import React, { ReactNode } from "react";
import '../styles/background.css'

export default function Layout({children}:{children:ReactNode}) {
    return (
        <div id="layout" className="background-animation">
            <Header />
                <main>{children}</main>
            <Footer/>
        </div>
    )
}