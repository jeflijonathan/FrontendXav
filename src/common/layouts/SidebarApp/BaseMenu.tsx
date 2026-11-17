
import type { ReactNode } from "react";

const BaseMenu = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex-1 min-h-0 min-w-0 p-4 overflow-y-auto scrollbar-hide space-y-1.5">
            {children}
        </div>
    );
};

export default BaseMenu;
