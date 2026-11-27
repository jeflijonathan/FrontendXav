import clsx from "clsx";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import useSidebarStore from "../../store/useSidebarStore";
import useAuthStore from "../../store/useAuthStore";
import ItemMenu from "./ItemMenu";
import type { MenuItemType } from "../../types";
import LogoSidebar from "./LogoSidebar";
import BaseMenu from "./BaseMenu";
import getProfilePhotoUrl from "@utils/getProfilePhotoUrl";
import CoPresentIcon from "@mui/icons-material/CoPresent";
const SidebarApp = () => {
  const { isSidebarOpen, handleSidebarToggle } = useSidebarStore();
  const { user, activeRole, logout } = useAuthStore();
  const navigate = useNavigate();

  const normalizedRole = (activeRole || "").toLowerCase().trim();
  const hasSidebarRole = (allowed: string[]) =>
    allowed.includes(normalizedRole) ||
    (!normalizedRole &&
      (user?.roles?.some((r) => allowed.includes((r.name || "").toLowerCase().trim())) ??
        false));

  const canManageSchedule = hasSidebarRole(["kepala_sekolah", "kurikulum", "admin", "superadmin"]);
  const canAccessSchoolInfo = hasSidebarRole(["kurikulum", "kepala_sekolah", "tu", "admin", "superadmin"]);
  const canAccessAnnouncements = hasSidebarRole([
    "kurikulum",
    "kepala_sekolah",
    "tu",
    "kesiswaan",
    "admin",
    "superadmin",
  ]);

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
        { label: "Kategori Mapel", href: "/category-subjects" },
        { label: "Mapel", href: "/subjects" },
        { label: "Kategori Ekstra", href: "/category-extras" },
      ],
    },
    {
      icon: <CoPresentIcon fontSize="small" />,
      label: "KBM",
      subItems: [
        { label: "Presensi Siswa", href: "/presensi-siswa" },
        { label: "Buku Induk Kehadiran", href: "/buku-induk-kehadiran" },
      ],
    },
    {
      icon: <CalendarMonthIcon fontSize="small" />,
      label: "Jadwal",
      subItems: [
        { label: "Kalender Akademik", href: "/kalender-akademik" },
        ...(canManageSchedule
          ? [
              { label: "Alokasi Jam & JP", href: "/alokasi-jp" },
              { label: "Pengajar", href: "/teaching-staff" },
              { label: "Roster Jam Belajar", href: "/roster-jam" },
            ]
          : []),
        { label: "Jadwal Pelajaran", href: "/jadwal-pelajaran" },
      ],
    },
    ...(canAccessAnnouncements || canAccessSchoolInfo
      ? [
          {
            icon: <BusinessIcon fontSize="small" />,
            label: "Sekolah",
            subItems: [
              ...(canAccessAnnouncements
                ? [{ label: "Pengumuman", href: "/announcements" }]
                : []),
              ...(canAccessSchoolInfo
                ? [{ label: "Informasi Sekolah", href: "/school-informations" }]
                : []),
            ],
          },
        ]
      : []),
    {
      icon: <PeopleIcon fontSize="small" />,
      label: "Pengguna",
      subItems: [
        { label: "Pegawai", href: "/employees" },
        { label: "Siswa", href: "/students" },
      ],
    },
    {
      icon: <SettingsIcon fontSize="small" />,
      label: "Pengaturan",
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
            <div
              onClick={() => navigate("/dashboard-profile")}
              className="flex items-center gap-3 whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity"
              title="Lihat Profil Saya"
            >
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
