import React, {ReactNode} from "react";

export default function GlassWindow({children}:{children:ReactNode}){

    return(
        <div id="glassWindow" 
        className="p-5 rounded-lg
        bg-[rgba(255,255,255,0.5)] shadow-md backdrop-blur-sm rounded-lg 
         max-md:max-w-[19rem] m-3">
            <div className="flex flex-col p-3 justify-center items-center">{children}</div>
        </div>
    )
}