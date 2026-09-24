import clsx from "clsx";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BusinessIcon from "@mui/icons-material/Business";
import useSidebarStore from "../../store/useSidebarStore";
import ItemMenu from "./ItemMenu";
import type { MenuItemType } from "../../types";
import LogoSidebar from "./LogoSidebar";
import BaseMenu from "./BaseMenu";
const SidebarApp = () => {
  const { isSidebarOpen, handleSidebarToggle } = useSidebarStore();

  const menuItems: MenuItemType[] = [
    {
      icon: <DashboardIcon fontSize="small" />,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: <SchoolIcon fontSize="small" />,
      label: "Akademik",
      subItems: [
        { label: "Major (Jurusan)", href: "/majors" },
        { label: "Class (Kelas)", href: "/classes" },
        { label: "Classroom", href: "/classrooms" },
      ],
    },
    {
      icon: <MenuBookIcon fontSize="small" />,
      label: "Kurikulum",
      subItems: [
        { label: "Category Subjects", href: "/category-subjects" },
        { label: "Subjects", href: "/subjects" },
        { label: "Teacher Subjects", href: "/teacher-subjects" },
        { label: "Effective Weeks", href: "/effective-weeks" },
      ],
    },
    {
      icon: <CalendarMonthIcon fontSize="small" />,
      label: "Jadwal",
      subItems: [
        { label: "Category Schedule Time", href: "/category-schedule-times" },
        { label: "Schedule Time Slots", href: "/schedule-times" },
        { label: "Schedules (Jadwal)", href: "/schedules" },
      ],
    },
    {
      icon: <BusinessIcon fontSize="small" />,
      label: "Sekolah",
      subItems: [
        { label: "School Information", href: "/school-informations" },
      ],
    },
    {
      icon: <PeopleIcon fontSize="small" />,
      label: "Users",
      subItems: [
        { label: "Employees", href: "/employees" },
        { label: "Students", href: "/students" },
      ],
    },
    {
      icon: <SettingsIcon fontSize="small" />,
      label: "Settings",
      subItems: [
        { label: "Profile", href: "/dashboard-profile" },
        { label: "Security", href: "/settings/security" },
        { label: "WhatsApp Connections", href: "/settings/whatsapp-connections" },
      ],
    },
    { icon: <HelpIcon fontSize="small" />, label: "Help & Support", href: "#" },
    { icon: <HelpIcon fontSize="small" />, label: "Test Menu", href: "/test-menu" },
  ];

  const textVisibilityClass = clsx(
    "transition-opacity duration-200",
    isSidebarOpen ? "opacity-100 block" : "opacity-0 hidden",
  );

  return (
    <>
      {isSidebarOpen && (
        <div
          onClick={handleSidebarToggle}
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={clsx(
          "h-screen transition-all ease-in-out duration-300 flex flex-col justify-between border-r",
          "fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0",
          "bg-theme-primary text-secondary-txt border-light-dark",
          isSidebarOpen
            ? "w-64 translate-x-0"
            : "-translate-x-full md:w-20 md:translate-x-0",
        )}
      >
        <LogoSidebar isSidebarOpen={isSidebarOpen}/>
        <BaseMenu>
           <p
            className={clsx(
              "px-3 text-[10px] font-bold uppercase tracking-widest mb-2 whitespace-nowrap text-secondary-txt/60",
              textVisibilityClass,
            )}
          >
            Main Menu
          </p>
           <nav className="space-y-1.5">
            {menuItems.map((item, index) => (
              <ItemMenu key={index} item={item} />
            ))}
          </nav>
        </BaseMenu>
          
         
        <div className="p-4 border-t shrink-0 overflow-hidden border-light-dark bg-theme-secondary/40">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 whitespace-nowrap">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border shrink-0 border-light-dark"
              />
              <div className={clsx("flex flex-col", textVisibilityClass)}>
                <span className="font-semibold text-sm leading-tight block truncate w-28 text-primary-txt">
                  Alex Doe
                </span>
                <span className="text-xs truncate w-28 mt-0.5 text-secondary-txt/70">
                  alex@ukm.ac.id
                </span>
              </div>
            </div>

            {isSidebarOpen && (
              <button
                title="Logout"
                className="p-2 rounded-xl transition-all shrink-0 text-secondary-txt/60 hover:text-primary hover:bg-primary/10"
              >
                <LogoutIcon fontSize="small" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarApp;
