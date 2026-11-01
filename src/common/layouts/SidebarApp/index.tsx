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
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import useSidebarStore from "../../store/useSidebarStore";
import useAuthStore from "../../store/useAuthStore";
import ItemMenu from "./ItemMenu";
import type { MenuItemType } from "../../types";
import LogoSidebar from "./LogoSidebar";
import BaseMenu from "./BaseMenu";
import getProfilePhotoUrl from "@utils/getProfilePhotoUrl";

const SidebarApp = () => {
  const { isSidebarOpen, handleSidebarToggle } = useSidebarStore();
  const { user, activeRole, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(navigate);
  };

  const menuItems: MenuItemType[] = [
    {
      icon: <DashboardIcon fontSize="small" />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <SchoolIcon fontSize="small" />,
      label: "Akademik",
      subItems: [
        { label: "Jurusan", href: "/majors" },
        { label: "Kelas", href: "/classes" },
      ],
    },
    {
      icon: <MenuBookIcon fontSize="small" />,
      label: "Kurikulum",
      subItems: [
        { label: "Category Subjects", href: "/category-subjects" },
        { label: "Subjects", href: "/subjects" },
        { label: "Teacher Subjects", href: "/teacher-subjects" },
      ],
    },
    {
      icon: <CalendarMonthIcon fontSize="small" />,
      label: "Jadwal",
      subItems: [
        { label: "Roster Jam Belajar", href: "/roster-jam" },
      ],
    },
    {
      icon: <BusinessIcon fontSize="small" />,
      label: "Sekolah",
      subItems: [
        { label: "Pengumuman", href: "/announcements" },
        { label: "Informasi Sekolah", href: "/school-informations" },
      ],
    },
    {
      icon: <PeopleIcon fontSize="small" />,
      label: "Users (TU & Kurikulum)",
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
      ],
    },
    { icon: <HelpIcon fontSize="small" />, label: "Help & Support", href: "#" },
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
        <LogoSidebar isSidebarOpen={isSidebarOpen} />
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
              <Avatar
                src={getProfilePhotoUrl(user?.profile_url)}
                alt={user?.full_name || "Profile"}
                sx={{ width: 38, height: 38, bgcolor: "primary.main", fontWeight: 700, fontSize: "0.875rem" }}
              >
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <div className={clsx("flex flex-col", textVisibilityClass)}>
                <span className="font-semibold text-sm leading-tight block truncate w-28 text-primary-txt">
                  {user?.full_name || "Pengguna"}
                </span>
                <span className="text-xs truncate w-28 mt-0.5 text-secondary-txt/70">
                  {activeRole ? activeRole.toUpperCase() : (user?.identifier || "-")}
                </span>
              </div>
            </div>

            {isSidebarOpen && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl transition-all shrink-0 text-secondary-txt/60 hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
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
