import type { ReactNode } from "react";

const BaseMenu = ({children}: {children: ReactNode}) => {
    return(
        <>
            <div className="flex-1 p-4 overflow-y-auto scrollbar-hide space-y-1.5">
                {children} 
            </div>
        </>
    )
}
export default BaseMenu;