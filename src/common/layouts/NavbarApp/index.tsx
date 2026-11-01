import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import LogoutIcon from "@mui/icons-material/Logout";
import { Chip, Tooltip, IconButton, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useSidebarStore from "../../store/useSidebarStore";
import useAuthStore from "../../store/useAuthStore";
import { ThemeToggle } from "../../components/Theme";
import RoleSelectionDialog from "@components/Auth/RoleSelectionDialog";
import getProfilePhotoUrl from "@utils/getProfilePhotoUrl";

const NavbarApp = () => {
  const { handleSidebarToggle } = useSidebarStore();
  const { user, activeRole, setIsRoleModalOpen, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(navigate);
  };

  return (
    <nav className="h-18.25 px-6 border-b flex items-center justify-between shrink-0 bg-white dark:bg-[#09090b] border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={handleSidebarToggle}
          className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <MenuIcon />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Active Role Indicator & Switcher */}
        {user && (
          <Tooltip title="Klik untuk berganti hak akses (Role)" arrow>
            <Chip
              icon={<SwitchAccountIcon fontSize="small" />}
              label={`Role: ${activeRole ? activeRole.toUpperCase() : "Pilih Role"}`}
              color="primary"
              variant={activeRole ? "filled" : "outlined"}
              size="small"
              onClick={() => setIsRoleModalOpen(true)}
              sx={{
                fontWeight: 600,
                cursor: "pointer",
                px: 0.5,
                "&:hover": { opacity: 0.9 },
              }}
            />
          </Tooltip>
        )}

        <ThemeToggle />

        <div className="relative p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-pointer">
          <NotificationsIcon fontSize="small" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
            2
          </span>
        </div>

        {/* User Info & Avatar */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
            <Avatar
              src={getProfilePhotoUrl(user.profile_url)}
              alt={user.full_name}
              sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: "0.875rem", fontWeight: 700 }}
            >
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
                {user.full_name}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {user.identifier} ({user.user_type === "employee" ? "Pegawai" : "Siswa"})
              </span>
            </div>

            <Tooltip title="Keluar dari Akun (Logout)" arrow>
              <IconButton size="small" onClick={handleLogout} color="error" sx={{ ml: 0.5 }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <Avatar sx={{ width: 34, height: 34 }} />
        )}
      </div>

      <RoleSelectionDialog />
    </nav>
  );
};

export default NavbarApp;
