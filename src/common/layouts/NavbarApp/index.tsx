import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import LogoutIcon from "@mui/icons-material/Logout";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import EmailIcon from "@mui/icons-material/Email";
import CampaignIcon from "@mui/icons-material/Campaign";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import {
  Chip,
  Tooltip,
  IconButton,
  Avatar,
  Popover,
  Drawer,
  Box,
  Typography,
  Badge,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import useSidebarStore from "../../store/useSidebarStore";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";
import { ThemeToggle } from "../../components/Theme";
import RoleSelectionDialog from "@components/Auth/RoleSelectionDialog";
import getProfilePhotoUrl from "@utils/getProfilePhotoUrl";

const NavbarApp = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { handleSidebarToggle } = useSidebarStore();
  const { user, activeRole, setIsRoleModalOpen, logout } = useAuthStore();
  const {
    systemNotifications,
    markSystemNotificationAsRead,
    markAllSystemNotificationsAsRead,
  } = useNotificationStore();
  const navigate = useNavigate();

  // Mode Tampilan Notifikasi: 'drawer' (Versi 2 - Panel Samping Kanan) atau 'popover' (Versi 1 - Dropdown Menu)
  const [notifMode, setNotifMode] = useState<"drawer" | "popover">("drawer");

  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);

  const toggleNotifMode = (mode: "drawer" | "popover") => {
    setNotifMode(mode);
    if (mode === "drawer") {
      setNotifAnchorEl(null);
      setIsNotifDrawerOpen(true);
    } else {
      setIsNotifDrawerOpen(false);
    }
  };

  const handleOpenNotif = (event: React.MouseEvent<HTMLElement>) => {
    if (notifMode === "drawer") {
      setIsNotifDrawerOpen(true);
    } else {
      setNotifAnchorEl(event.currentTarget);
    }
  };

  const handleCloseNotif = () => {
    setNotifAnchorEl(null);
    setIsNotifDrawerOpen(false);
  };

  const handleLogout = async () => {
    await logout(navigate);
  };

  const unreadCount = systemNotifications.filter((n) => !n.read).length;

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

        {/* Notifications Icon with Badge & Popover */}
        <Tooltip title="Notifikasi & Email Broadcast">
          <IconButton
            onClick={handleOpenNotif}
            sx={{
              p: 1.2,
              borderRadius: "12px",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* ======================================================== */}
        {/* NOTIFIKASI VERSI 1: POPOVER DROPDOWN                    */}
        {/* ======================================================== */}
        <Popover
          open={Boolean(notifAnchorEl) && notifMode === "popover"}
          anchorEl={notifAnchorEl}
          onClose={handleCloseNotif}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                width: { xs: 320, sm: 390 },
                maxHeight: 540,
                borderRadius: 3,
                boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.6)" : "0 10px 30px rgba(0,0,0,0.15)",
                border: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                bgcolor: isDark ? "#141416" : "#ffffff",
                display: "flex",
                flexDirection: "column",
              },
            },
          }}
        >
          {/* Popover Header */}
          <Box sx={{ p: 2, bgcolor: isDark ? "#18181b" : "#f8fafc", borderBottom: isDark ? "1px solid #27272a" : "1px solid #e2e8f0" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <NotificationsIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDark ? "#f4f4f5" : "#0f172a" }}>
                  Notifikasi Sistem & Email
                </Typography>
              </Box>

              <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                {unreadCount > 0 && (
                  <Chip
                    label={`${unreadCount} baru`}
                    size="small"
                    color="error"
                    sx={{ height: 20, fontSize: "10px", fontWeight: 700 }}
                  />
                )}
                {/* Switch to Versi 2 (Panel Samping) */}
                <Tooltip title="Alihkan ke Versi 2 (Panel Samping)" arrow>
                  <IconButton
                    size="small"
                    onClick={() => toggleNotifMode("drawer")}
                    sx={{
                      p: 0.5,
                      color: isDark ? "#60a5fa" : "#2563eb",
                      bgcolor: isDark ? "#27272a" : "#eff6ff",
                      borderRadius: 1.5,
                      border: isDark ? "1px solid #3f3f46" : "1px solid #bfdbfe",
                    }}
                  >
                    <VerticalSplitIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
              <Typography variant="caption" sx={{ color: isDark ? "#a1a1aa" : "#64748b" }}>
                Versi 1: Pop-up dropdown menu
              </Typography>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  onClick={markAllSystemNotificationsAsRead}
                  startIcon={<DoneAllIcon sx={{ fontSize: 14 }} />}
                  sx={{ textTransform: "none", fontSize: "11px", p: 0, minWidth: "auto", fontWeight: 600 }}
                >
                  Tandai dibaca
                </Button>
              )}
            </Box>
          </Box>

          {/* Popover Content List */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 1, bgcolor: isDark ? "#141416" : "#ffffff" }}>
            {systemNotifications.length === 0 ? (
              <Box sx={{ py: 5, textAlign: "center", px: 2 }}>
                <MarkEmailReadIcon sx={{ fontSize: 40, color: isDark ? "#3f3f46" : "#cbd5e1", mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? "#a1a1aa" : "#64748b" }}>
                  Tidak ada notifikasi baru
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? "#71717a" : "#94a3b8" }}>
                  Semua pengumuman dan email broadcast akan muncul di sini.
                </Typography>
              </Box>
            ) : (
              systemNotifications.map((notif) => (
                <Box
                  key={notif.id}
                  onClick={() => {
                    markSystemNotificationAsRead(notif.id);
                    navigate("/announcements");
                    handleCloseNotif();
                  }}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    cursor: "pointer",
                    bgcolor: notif.read
                      ? "transparent"
                      : isDark
                      ? "rgba(37, 99, 235, 0.16)"
                      : "#eff6ff",
                    border: "1px solid",
                    borderColor: notif.read
                      ? isDark
                        ? "#27272a"
                        : "transparent"
                      : isDark
                      ? "rgba(59, 130, 246, 0.35)"
                      : "#bfdbfe",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: notif.read
                        ? isDark
                          ? "#1f1f23"
                          : "#f8fafc"
                        : isDark
                        ? "rgba(37, 99, 235, 0.25)"
                        : "#dbeafe",
                    },
                    display: "flex",
                    gap: 1.5,
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        notif.type === "email"
                          ? isDark
                            ? "rgba(217, 119, 6, 0.25)"
                            : "#fef3c7"
                          : isDark
                          ? "rgba(67, 56, 202, 0.25)"
                          : "#e0e7ff",
                      color:
                        notif.type === "email"
                          ? isDark
                            ? "#fbbf24"
                            : "#d97706"
                          : isDark
                          ? "#818cf8"
                          : "#4338ca",
                      flexShrink: 0,
                    }}
                  >
                    {notif.type === "email" ? (
                      <EmailIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <CampaignIcon sx={{ fontSize: 18 }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: notif.read ? 600 : 800,
                          color: isDark ? "#f4f4f5" : "#0f172a",
                          fontSize: "12.5px",
                        }}
                      >
                        {notif.title}
                      </Typography>
                      {!notif.read && (
                        <Box
                          sx={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            bgcolor: "#ef4444",
                            flexShrink: 0,
                            ml: 1,
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDark ? "#a1a1aa" : "#475569",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mt: 0.3,
                        lineHeight: 1.35,
                      }}
                    >
                      {notif.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: isDark ? "#71717a" : "#94a3b8", fontSize: "10.5px", mt: 0.5, display: "block" }}
                    >
                      {notif.timestamp}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          <Divider sx={{ borderColor: isDark ? "#27272a" : "#e2e8f0" }} />
          <Box sx={{ p: 1.2, textAlign: "center", bgcolor: isDark ? "#18181b" : "#f8fafc" }}>
            <Button
              fullWidth
              size="small"
              onClick={() => {
                navigate("/announcements");
                handleCloseNotif();
              }}
              endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
              sx={{ textTransform: "none", fontWeight: 700, fontSize: "12px", color: isDark ? "#60a5fa" : undefined }}
            >
              Lihat Semua Pengumuman
            </Button>
          </Box>
        </Popover>

        {/* ======================================================== */}
        {/* NOTIFIKASI VERSI 2: PANEL SAMPING (RIGHT DRAWER)         */}
        {/* Sesuai Permintaan User: Pop-up Kesamping Samping Kanan  */}
        {/* ======================================================== */}
        <Drawer
          anchor="right"
          open={isNotifDrawerOpen && notifMode === "drawer"}
          onClose={handleCloseNotif}
          slotProps={{
            paper: {
              sx: {
                width: { xs: "100%", sm: 400, md: 440 },
                maxWidth: "100vw",
                bgcolor: isDark ? "#141416" : "#ffffff",
                borderLeft: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                boxShadow: isDark ? "-10px 0 35px rgba(0, 0, 0, 0.7)" : "-10px 0 30px rgba(0, 0, 0, 0.15)",
                display: "flex",
                flexDirection: "column",
                height: "100vh",
              },
            },
          }}
        >
          {/* Drawer Header */}
          <Box
            sx={{
              p: 2.5,
              bgcolor: isDark ? "#18181b" : "#f8fafc",
              borderBottom: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <NotificationsIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isDark ? "#f4f4f5" : "#0f172a" }}>
                  Notifikasi & Email
                </Typography>
                {unreadCount > 0 && (
                  <Chip
                    label={`${unreadCount} baru`}
                    size="small"
                    color="error"
                    sx={{ height: 20, fontSize: "10px", fontWeight: 700 }}
                  />
                )}
              </Box>

              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                {/* Switch to Versi 1 (Popover Dropdown) */}
                <Tooltip title="Alihkan ke Versi 1 (Dropdown Popover)" arrow>
                  <IconButton
                    size="small"
                    onClick={() => toggleNotifMode("popover")}
                    sx={{
                      bgcolor: isDark ? "#27272a" : "#ffffff",
                      border: isDark ? "1px solid #3f3f46" : "1px solid #e2e8f0",
                      color: isDark ? "#60a5fa" : "#2563eb",
                      p: 0.8,
                      borderRadius: 1.5,
                      "&:hover": { bgcolor: isDark ? "#3f3f46" : "#f1f5f9" },
                    }}
                  >
                    <WebAssetIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* Close Button (X) */}
                <Tooltip title="Tutup Panel Notifikasi" arrow>
                  <IconButton
                    onClick={handleCloseNotif}
                    size="small"
                    sx={{
                      bgcolor: isDark ? "#27272a" : "#ffffff",
                      border: isDark ? "1px solid #3f3f46" : "1px solid #e2e8f0",
                      color: isDark ? "#f4f4f5" : "#0f172a",
                      p: 0.8,
                      borderRadius: 1.5,
                      "&:hover": { bgcolor: isDark ? "#3f3f46" : "#f1f5f9" },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" sx={{ color: isDark ? "#a1a1aa" : "#64748b" }}>
                Versi 2: Panel samping (Slide Drawer kanan)
              </Typography>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  onClick={markAllSystemNotificationsAsRead}
                  startIcon={<DoneAllIcon sx={{ fontSize: 14 }} />}
                  sx={{ textTransform: "none", fontSize: "11px", p: 0, minWidth: "auto", fontWeight: 600 }}
                >
                  Tandai semua dibaca
                </Button>
              )}
            </Box>
          </Box>

          {/* Drawer Notification List */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              bgcolor: isDark ? "#141416" : "#ffffff",
            }}
          >
            {systemNotifications.length === 0 ? (
              <Box sx={{ py: 8, textAlign: "center", px: 3 }}>
                <MarkEmailReadIcon sx={{ fontSize: 48, color: isDark ? "#3f3f46" : "#cbd5e1", mb: 1.5 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? "#f4f4f5" : "#334155" }}>
                  Tidak Ada Notifikasi Baru
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? "#71717a" : "#94a3b8", display: "block", mt: 0.5 }}>
                  Semua pengumuman resmi dan broadcast email akademik akan muncul di sini.
                </Typography>
              </Box>
            ) : (
              systemNotifications.map((notif) => (
                <Box
                  key={notif.id}
                  onClick={() => {
                    markSystemNotificationAsRead(notif.id);
                    navigate("/announcements");
                    handleCloseNotif();
                  }}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    borderRadius: 2.5,
                    cursor: "pointer",
                    bgcolor: notif.read
                      ? isDark
                        ? "#18181b"
                        : "#ffffff"
                      : isDark
                      ? "rgba(37, 99, 235, 0.16)"
                      : "#eff6ff",
                    border: "1px solid",
                    borderColor: notif.read
                      ? isDark
                        ? "#27272a"
                        : "#e2e8f0"
                      : isDark
                      ? "rgba(59, 130, 246, 0.35)"
                      : "#bfdbfe",
                    boxShadow: notif.read ? "none" : isDark ? "0 4px 14px rgba(0,0,0,0.4)" : "0 2px 8px rgba(37, 99, 235, 0.08)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateX(-2px)",
                      borderColor: "#3b82f6",
                    },
                    display: "flex",
                    gap: 1.5,
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        notif.type === "email"
                          ? isDark
                            ? "rgba(217, 119, 6, 0.25)"
                            : "#fef3c7"
                          : isDark
                          ? "rgba(67, 56, 202, 0.25)"
                          : "#e0e7ff",
                      color:
                        notif.type === "email"
                          ? isDark
                            ? "#fbbf24"
                            : "#d97706"
                          : isDark
                          ? "#818cf8"
                          : "#4338ca",
                      flexShrink: 0,
                    }}
                  >
                    {notif.type === "email" ? (
                      <EmailIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <CampaignIcon sx={{ fontSize: 20 }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: notif.read ? 600 : 800,
                          color: isDark ? "#f4f4f5" : "#0f172a",
                          fontSize: "13px",
                        }}
                      >
                        {notif.title}
                      </Typography>
                      {!notif.read && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#ef4444",
                            flexShrink: 0,
                            ml: 1,
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDark ? "#a1a1aa" : "#475569",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mt: 0.5,
                        lineHeight: 1.45,
                        fontSize: "12px",
                      }}
                    >
                      {notif.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: isDark ? "#71717a" : "#94a3b8", fontSize: "11px", mt: 0.8, display: "block" }}
                    >
                      {notif.timestamp}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {/* Drawer Footer */}
          <Box
            sx={{
              p: 2,
              bgcolor: isDark ? "#18181b" : "#f8fafc",
              borderTop: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
              flexShrink: 0,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              size="medium"
              onClick={() => {
                navigate("/announcements");
                handleCloseNotif();
              }}
              endIcon={<ArrowForwardIcon />}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
            >
              Lihat Semua Pengumuman
            </Button>
          </Box>
        </Drawer>

        {/* User Info & Avatar */}
        {user ? (
          <div
            onClick={() => navigate("/dashboard-profile")}
            className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800 cursor-pointer hover:opacity-85 transition-opacity"
            title="Lihat Profil Saya"
          >
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
