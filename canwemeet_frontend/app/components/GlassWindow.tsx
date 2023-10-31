import React, {ReactNode} from "react";

export default function GlassWindow({children}:{children:ReactNode}){

    return(
        <div id="glassWindow" className="flex flex-col p-5 rounded-lg
                bg-[rgba(255,255,255,0.5)] shadow-md backdrop-blur-sm rounded-lg max-md:w-[20rem] max-md:h-[45rem] m-5">
            <div className="">{children}</div>
        </div>
    )
}