import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import useSidebarStore from "../../store/useSidebarStore";
import { ThemeToggle } from "../../components/Theme";

const NavbarApp = () => {
  const { handleSidebarToggle } = useSidebarStore();

  return (
    <nav className="h-18.25 px-6 border-b flex items-center justify-between shrink-0 bg-white dark:bg-[#09090b] border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={handleSidebarToggle}
          className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <MenuIcon />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="relative p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-pointer">
          <NotificationsIcon fontSize="small" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
            2
          </span>
        </div>

        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
          alt="Avatar"
          className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
        />
      </div>
    </nav>
  );
};

export default NavbarApp;
