import clsx from "clsx";
import useSidebarStore from "../store/useSidebarStore";

export const useTextVisibilityClassSidebar = () => {
    const { isSidebarOpen } = useSidebarStore();

    return clsx(
        "transition-opacity duration-200",
        isSidebarOpen ? "opacity-100 block" : "opacity-0 hidden",
    );
};

