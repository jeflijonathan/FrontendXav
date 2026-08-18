import clsx from "clsx";
import Logo from "../../../assets/logoSMK.png";
import { useTextVisibilityClassSidebar } from "../../utils/textVisibilityClass";

const LogoSidebar = ({isSidebarOpen}: {isSidebarOpen: boolean}) => {
    const textVisibilityClassSidebar = useTextVisibilityClassSidebar();
    return(
        <div className="p-5 flex items-center gap-3 border-b h-[73px] shrink-0 overflow-hidden border-light-dark">
          <img src={Logo} alt="Logo SMK Xaverius Palembang" width="30" className="shrink-0" />
          <span
            className={clsx(
              "font-bold text-sm tracking-wider whitespace-nowrap",
              "text-primary-txt",
               textVisibilityClassSidebar,
            )}
          >
            SMK Xaverius Palembang
          </span>
        </div>
    )
}

export default LogoSidebar

