import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    Typography,
    Stack,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Drawer,
    TextField,
    InputAdornment,
    Fab,
    Zoom,
    Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EmailIcon from "@mui/icons-material/Email";
import CampaignIcon from "@mui/icons-material/Campaign";
import TableChartIcon from "@mui/icons-material/TableChart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useAuthStore from "@common/store/useAuthStore";
import useNotificationStore from "@common/store/useNotificationStore";
import AnnouncementService from "@api/announcement";
import type { AnnouncementResponseModel } from "@api/announcement/model";
import GoogleDrivePreview from "@components/GoogleDrivePreview/GoogleDrivePreview";
import moment from "moment";
import { parseDate } from "@utils/dateParse";

const DashboardPage: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { user, activeRole } = useAuthStore();
    const { syncAnnouncementsToNotifications } = useNotificationStore();
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState<AnnouncementResponseModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    // Batas konten awal: 2 baris x 3 kolom = 6 konten
    const [visibleCount, setVisibleCount] = useState<number>(6);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementResponseModel | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Mode Tampilan Detail: default panel samping kesamping (Drawer)
    const [viewMode, setViewMode] = useState<"dialog" | "drawer">("drawer");

    const announcementService = new AnnouncementService();

    const fetchAnnouncements = () => {
        setIsLoading(true);
        announcementService.fetchAnnouncementRequest(
            {
                onSuccess: (res: any) => {
                    const list = Array.isArray(res.data) ? res.data : [];
                    setAnnouncements(list);
                    syncAnnouncementsToNotifications(list);
                },
                onError: () => { },
                onFullfilled: () => {
                    setIsLoading(false);
                },
            },
            { params: { limit: 50 } }
        );
    };

    useEffect(() => {
        fetchAnnouncements();

        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Reset pagination ketika query pencarian atau range tanggal berubah
    useEffect(() => {
        setVisibleCount(6);
    }, [searchQuery, startDate, endDate]);

    // Filter announcements based on search query & range date
    // Hanya tampilkan pengumuman yang Published (status === 1)
    const filteredAnnouncements = announcements.filter((item) => {
        // Filter: hanya status Published (1) yang tampil di Dashboard
        if (item.status !== 1) return false;

        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
            !query ||
            (item.title && item.title.toLowerCase().includes(query)) ||
            (item.description && item.description.toLowerCase().includes(query));

        let matchesDate = true;
        if (item.created_at) {
            const itemDate = moment(item.created_at).format("YYYY-MM-DD");
            if (startDate && endDate) {
                matchesDate = itemDate >= startDate && itemDate <= endDate;
            } else if (startDate) {
                matchesDate = itemDate >= startDate;
            } else if (endDate) {
                matchesDate = itemDate <= endDate;
            }
        }

        return matchesQuery && matchesDate;
    });

    // Batas konten: 1 baris = 3 konten, 2 baris = 6 konten. Klik selengkapnya menambah 2 baris (+6 konten)
    const displayedAnnouncements = filteredAnnouncements.slice(0, visibleCount);

    const roleName = activeRole ? activeRole.toUpperCase() : "PENGGUNA";



    return (
        <Box sx={{ maxWidth: 1400, mx: "auto", pb: 10, px: { xs: 1, sm: 2 } }}>
            {/* Header Greeting Banner */}
            <Card
                elevation={0}
                sx={{
                    p: { xs: 2.5, md: 3.5 },
                    mb: 3.5,
                    borderRadius: 3.5,
                    background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                    color: "#ffffff",
                    boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.25)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", md: "center" },
                        gap: 2,
                    }}
                >
                    <Box>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                            <Chip
                                label={`HAK AKSES: ${roleName}`}
                                size="small"
                                sx={{
                                    bgcolor: "rgba(255, 255, 255, 0.2)",
                                    color: "#ffffff",
                                    fontWeight: 700,
                                    fontSize: "11px",
                                    backdropFilter: "blur(4px)",
                                }}
                            />
                            <Chip
                                label="TP 2026/2027 GANJIL"
                                size="small"
                                sx={{
                                    bgcolor: "rgba(255, 255, 255, 0.15)",
                                    color: "#ffffff",
                                    fontWeight: 700,
                                    fontSize: "11px",
                                }}
                            />
                        </Stack>
                        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
                            Selamat Datang, {user?.full_name || "Civitas Academica"}!
                        </Typography>
                        <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.85)", mt: 0.5 }}>
                            Portal Informasi & Pengumuman Akademik SMK Xaverius Palembang
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.5}>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/jadwal-pelajaran")}
                            startIcon={<TableChartIcon />}
                            sx={{
                                bgcolor: "#ffffff",
                                color: "#1e3a8a",
                                fontWeight: 700,
                                textTransform: "none",
                                borderRadius: 2,
                                "&:hover": { bgcolor: "#f1f5f9" },
                            }}
                        >
                            Jadwal Pelajaran
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/kalender-akademik")}
                            startIcon={<CalendarMonthIcon />}
                            sx={{
                                borderColor: "rgba(255, 255, 255, 0.6)",
                                color: "#ffffff",
                                fontWeight: 700,
                                textTransform: "none",
                                borderRadius: 2,
                                "&:hover": { borderColor: "#ffffff", bgcolor: "rgba(255, 255, 255, 0.1)" },
                            }}
                        >
                            Kalender Akademik
                        </Button>
                    </Stack>
                </Box>
            </Card>

            {/* Top Portal Search Header (Sesuai Screenshot User) */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3,
                    p: 2,
                    bgcolor: isDark ? "#141416" : "#ffffff",
                    borderRadius: 3,
                    border: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                    boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.5)" : "0 1px 3px rgba(0,0,0,0.02)",
                }}
            >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flex: 1, minWidth: 260, maxWidth: 500 }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Cari Berita / Pengumuman..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: isDark ? "#71717a" : "#94a3b8", fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2.5,
                                bgcolor: isDark ? "#18181b" : "#f8fafc",
                                color: isDark ? "#f4f4f5" : "#0f172a",
                                "& fieldset": { borderColor: isDark ? "#27272a" : "#e2e8f0" },
                                "&:hover fieldset": { borderColor: isDark ? "#3f3f46" : "#cbd5e1" },
                                "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                            },
                        }}
                    />
                    <Tooltip title="Muat Ulang Berita">
                        <IconButton
                            onClick={fetchAnnouncements}
                            disabled={isLoading}
                            sx={{
                                border: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                                borderRadius: 2,
                                bgcolor: isDark ? "#18181b" : "#f8fafc",
                                "&:hover": { bgcolor: isDark ? "#27272a" : "#f1f5f9" },
                            }}
                        >
                            <RefreshIcon sx={{ fontSize: 20, color: isDark ? "#a1a1aa" : "#64748b" }} />
                        </IconButton>
                    </Tooltip>
                </Stack>

                {/* Filter Range Tanggal (Dari Tanggal s/d Sampai Tanggal) */}
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                    <TextField
                        type="date"
                        size="small"
                        label="Dari Tanggal"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        slotProps={{
                            inputLabel: { shrink: true },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarTodayIcon sx={{ fontSize: 16, color: isDark ? "#a1a1aa" : "#64748b" }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            width: { xs: "100%", sm: 175 },
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2.5,
                                bgcolor: isDark ? "#18181b" : "#f8fafc",
                                color: isDark ? "#f4f4f5" : "#0f172a",
                                "& fieldset": { borderColor: isDark ? "#27272a" : "#e2e8f0" },
                                "&:hover fieldset": { borderColor: isDark ? "#3f3f46" : "#cbd5e1" },
                                "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                            },
                            "& .MuiInputLabel-root": {
                                color: isDark ? "#a1a1aa" : "#64748b",
                            },
                        }}
                    />

                    <Typography variant="caption" sx={{ color: isDark ? "#71717a" : "#94a3b8", fontWeight: 700, px: 0.5 }}>
                        s/d
                    </Typography>

                    <TextField
                        type="date"
                        size="small"
                        label="Sampai Tanggal"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        slotProps={{
                            inputLabel: { shrink: true },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarTodayIcon sx={{ fontSize: 16, color: isDark ? "#a1a1aa" : "#64748b" }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            width: { xs: "100%", sm: 175 },
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2.5,
                                bgcolor: isDark ? "#18181b" : "#f8fafc",
                                color: isDark ? "#f4f4f5" : "#0f172a",
                                "& fieldset": { borderColor: isDark ? "#27272a" : "#e2e8f0" },
                                "&:hover fieldset": { borderColor: isDark ? "#3f3f46" : "#cbd5e1" },
                                "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                            },
                            "& .MuiInputLabel-root": {
                                color: isDark ? "#a1a1aa" : "#64748b",
                            },
                        }}
                    />

                    {(startDate || endDate) && (
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                setStartDate("");
                                setEndDate("");
                            }}
                            sx={{
                                textTransform: "none",
                                fontSize: "12px",
                                fontWeight: 600,
                                borderRadius: 2,
                                borderColor: isDark ? "#3f3f46" : "#cbd5e1",
                                color: isDark ? "#93c5fd" : "#2563eb",
                                height: 38,
                                "&:hover": {
                                    borderColor: isDark ? "#71717a" : "#94a3b8",
                                    bgcolor: isDark ? "#27272a" : "#f1f5f9",
                                },
                            }}
                        >
                            Reset
                        </Button>
                    )}
                </Stack>
            </Box>

            {/* Portal Grid Layout (3 Columns Modern Cards Sesuai Screenshot) */}
            {isLoading ? (
                <Box sx={{ py: 12, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2 }}>
                    <CircularProgress size={36} />
                    <Typography variant="body2" sx={{ color: isDark ? "#a1a1aa" : "#64748b", fontWeight: 600 }}>
                        Memuat berita & pengumuman sekolah...
                    </Typography>
                </Box>
            ) : filteredAnnouncements.length === 0 ? (
                <Box
                    sx={{
                        py: 10,
                        textAlign: "center",
                        bgcolor: isDark ? "#141416" : "#ffffff",
                        borderRadius: 3.5,
                        border: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                        p: 4,
                    }}
                >
                    <CampaignIcon sx={{ fontSize: 56, color: isDark ? "#3f3f46" : "#cbd5e1", mb: 1.5 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? "#f4f4f5" : "#334155" }}>
                        Tidak Ada Berita / Pengumuman Ditemukan
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? "#71717a" : "#94a3b8", mt: 0.5, mb: 3 }}>
                        {searchQuery
                            ? `Tidak ada pengumuman yang cocok dengan kata kunci "${searchQuery}".`
                            : "Saat ini belum ada pengumuman yang diterbitkan."}
                    </Typography>
                    {searchQuery && (
                        <Button variant="outlined" size="small" onClick={() => setSearchQuery("")} sx={{ borderRadius: 2 }}>
                            Bersihkan Pencarian
                        </Button>
                    )}
                </Box>
            ) : (
                <>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)",
                            },
                            gap: 3,
                        }}
                    >
                        {displayedAnnouncements.map((item) => {
                            return (
                                <Card
                                    key={item.id_announcement}
                                    elevation={0}
                                    onClick={() => setSelectedAnnouncement(item)}
                                    sx={{
                                        borderRadius: 3,
                                        border: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                                        bgcolor: isDark ? "#141416" : "#ffffff",
                                        display: "flex",
                                        flexDirection: "column",
                                        transition: "all 0.25s ease-in-out",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: isDark
                                                ? "0 12px 28px rgba(0, 0, 0, 0.6)"
                                                : "0 12px 24px -10px rgba(0, 0, 0, 0.12)",
                                            borderColor: isDark ? "#3b82f6" : "#93c5fd",
                                        },
                                    }}
                                >
                                    {/* Card Header: Bold Title */}
                                    <Box sx={{ p: 2.5, pb: 1.5 }}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 800,
                                                color: isDark ? "#60a5fa" : "#2563eb",
                                                lineHeight: 1.35,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                minHeight: 36,
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                    </Box>

                                    {/* Card Content: Preview Google Drive Langsung (Deskripsi tidak perlu) */}
                                    <Box sx={{ px: 2, flex: 1, display: "flex", flexDirection: "column" }}>
                                        {item.url_drive ? (
                                            <Box
                                                sx={{
                                                    borderRadius: 2,
                                                    overflow: "hidden",
                                                    border: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                                                    bgcolor: isDark ? "#18181b" : "#f8fafc",
                                                }}
                                            >
                                                <GoogleDrivePreview
                                                    url={item.url_drive}
                                                    height={260}
                                                    showEmptyState={false}
                                                    title={item.title}
                                                />
                                            </Box>
                                        ) : (
                                            <Box
                                                sx={{
                                                    minHeight: 180,
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor: isDark ? "#18181b" : "#f8fafc",
                                                    border: isDark ? "1px solid #27272a" : "1px solid #f1f5f9",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ color: isDark ? "#71717a" : "#94a3b8", fontStyle: "italic" }}>
                                                    Tidak ada berkas lampiran Google Drive
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Card Footer: Date & Baca */}
                                    <Box
                                        sx={{
                                            p: 2.5,
                                            py: 1.5,
                                            mt: "auto",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderTop: isDark ? "1px solid #27272a" : "1px solid #f1f5f9",
                                        }}
                                    >
                                        <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                                            <CalendarTodayIcon sx={{ fontSize: 13, color: isDark ? "#71717a" : "#94a3b8" }} />
                                            <Typography variant="caption" sx={{ color: isDark ? "#a1a1aa" : "#64748b", fontWeight: 600 }}>
                                                {parseDate(item.created_at)}
                                            </Typography>
                                        </Stack>

                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontWeight: 700,
                                                color: isDark ? "#60a5fa" : "#2563eb",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            Baca
                                        </Typography>
                                    </Box>
                                </Card>
                            );
                        })}
                </Box>

                {/* Tombol Selengkapnya... (Menampilkan 2 baris lagi = +6 konten, sesuai permintaan user) */}
                {visibleCount < filteredAnnouncements.length && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setVisibleCount((prev) => prev + 6)}
                            endIcon={<ExpandMoreIcon />}
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                py: 1.2,
                                fontWeight: 700,
                                textTransform: "none",
                                fontSize: "14px",
                                borderColor: isDark ? "#3f3f46" : "#cbd5e1",
                                color: isDark ? "#93c5fd" : "#2563eb",
                                bgcolor: isDark ? "#141416" : "#ffffff",
                                boxShadow: isDark ? "0 4px 14px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.04)",
                                "&:hover": {
                                    borderColor: isDark ? "#60a5fa" : "#2563eb",
                                    bgcolor: isDark ? "#18181b" : "#eff6ff",
                                },
                            }}
                        >
                            Selengkapnya ({filteredAnnouncements.length - visibleCount} lagi)
                        </Button>
                    </Box>
                )}
            </>
            )}

            {/* Floating Scroll-To-Top Action Button (Sesuai Lingkaran Biru di Gambar) */}
            <Zoom in={showScrollTop || true}>
                <Fab
                    color="primary"
                    size="medium"
                    onClick={scrollToTop}
                    sx={{
                        position: "fixed",
                        bottom: 28,
                        right: 28,
                        zIndex: 999,
                        bgcolor: "#2563eb",
                        boxShadow: "0 8px 20px rgba(37, 99, 235, 0.35)",
                        "&:hover": { bgcolor: "#1d4ed8" },
                    }}
                >
                    <KeyboardArrowUpIcon />
                </Fab>
            </Zoom>

            {/* ======================================================== */}
            {/* DETAIL ANNOUNCEMENT PANEL SAMPING (RIGHT DRAWER)         */}
            {/* Sesuai Gambar Screenshot User MDP Portal Slide-over     */}
            {/* ======================================================== */}
            <Drawer
                anchor="right"
                open={Boolean(selectedAnnouncement)}
                onClose={() => setSelectedAnnouncement(null)}
                slotProps={{
                    paper: {
                        sx: {
                            width: { xs: "100%", sm: 540, md: 660, lg: 760 },
                            maxWidth: "100vw",
                            bgcolor: isDark ? "#141416" : "#ffffff",
                            borderLeft: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                            boxShadow: isDark ? "-10px 0 35px rgba(0, 0, 0, 0.7)" : "-10px 0 30px rgba(0, 0, 0, 0.12)",
                            display: "flex",
                            flexDirection: "column",
                            height: "100vh",
                        },
                    },
                }}
            >
                {selectedAnnouncement && (
                    <>
                        {/* Drawer Header (Sesuai Screenshot User: Tombol X, Chevron, Judul, & Link Baru) */}
                        <Box
                            sx={{
                                p: 2.5,
                                bgcolor: isDark ? "#18181b" : "#f8fafc",
                                borderBottom: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.5,
                                flexShrink: 0,
                            }}
                        >
                            {/* Top Action Controls Row */}
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                    {/* Close Button (X) */}
                                    <Tooltip title="Tutup Panel Samping" arrow>
                                        <IconButton
                                            onClick={() => setSelectedAnnouncement(null)}
                                            size="small"
                                            sx={{
                                                bgcolor: isDark ? "#27272a" : "#ffffff",
                                                border: isDark ? "1px solid #3f3f46" : "1px solid #e2e8f0",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                                color: isDark ? "#f4f4f5" : "#0f172a",
                                                "&:hover": { bgcolor: isDark ? "#3f3f46" : "#f1f5f9" },
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    {/* Collapse / Back Chevron Button (<) */}
                                    <Tooltip title="Sembunyikan / Collapse" arrow>
                                        <IconButton
                                            onClick={() => setSelectedAnnouncement(null)}
                                            size="small"
                                            sx={{
                                                bgcolor: isDark ? "#27272a" : "#ffffff",
                                                border: isDark ? "1px solid #3f3f46" : "1px solid #e2e8f0",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                                color: isDark ? "#f4f4f5" : "#0f172a",
                                                "&:hover": { bgcolor: isDark ? "#3f3f46" : "#f1f5f9" },
                                            }}
                                        >
                                            <ChevronLeftIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>

                                {selectedAnnouncement.url_drive && (
                                    <Tooltip title="Buka di Tab Google Drive Baru" arrow>
                                        <IconButton
                                            href={selectedAnnouncement.url_drive}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            size="small"
                                            sx={{
                                                bgcolor: isDark ? "#27272a" : "#ffffff",
                                                border: isDark ? "1px solid #3f3f46" : "1px solid #e2e8f0",
                                                color: isDark ? "#60a5fa" : "#2563eb",
                                                "&:hover": { bgcolor: isDark ? "#3f3f46" : "#eff6ff" },
                                            }}
                                        >
                                            <OpenInNewIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>

                            {/* Announcement Title */}
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        color: isDark ? "#f4f4f5" : "#0f172a",
                                        lineHeight: 1.35,
                                        fontSize: { xs: "16px", sm: "18px" },
                                    }}
                                >
                                    {selectedAnnouncement.title}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Drawer Body: Document & Content */}
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                p: { xs: 2, sm: 2.5 },
                                bgcolor: isDark ? "#141416" : "#ffffff",
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            {/* Email Broadcast Notice Banner */}
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: isDark ? "rgba(22, 101, 52, 0.2)" : "#f0fdf4",
                                    border: isDark ? "1px solid rgba(22, 101, 52, 0.4)" : "1px solid #bbf7d0",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                }}
                            >
                                <EmailIcon sx={{ color: isDark ? "#4ade80" : "#16a34a", fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? "#86efac" : "#166534", display: "block" }}>
                                        Notifikasi Email Telah Disiarkan
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: isDark ? "#bbf7d0" : "#15803d", fontSize: "11px" }}>
                                        Pemberitahuan resmi informasi ini dikirimkan ke Civitas Academica SMK Xaverius Palembang.
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Description (dengan render format Word: Bold, Underline, Italic, List) */}
                            {selectedAnnouncement.description && (
                                <Typography
                                    variant="body2"
                                    component="div"
                                    dangerouslySetInnerHTML={{
                                        __html: selectedAnnouncement.description
                                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                            .replace(/\*(.*?)\*/g, "<em>$1</em>")
                                            .replace(/~~(.*?)~~/g, "<del>$1</del>")
                                            .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>"),
                                    }}
                                    sx={{
                                        color: isDark ? "#d4d4d8" : "#334155",
                                        lineHeight: 1.65,
                                        whiteSpace: "pre-line",
                                        p: 1.5,
                                        bgcolor: isDark ? "#18181b" : "#f8fafc",
                                        borderRadius: 2,
                                        border: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                                    }}
                                />
                            )}

                            {/* Full Height Embedded Document Viewer (Sesuai Gambar Screenshot MDP) */}
                            {selectedAnnouncement.url_drive ? (
                                <Box
                                    sx={{
                                        flex: 1,
                                        minHeight: 480,
                                        display: "flex",
                                        flexDirection: "column",
                                        borderRadius: 2.5,
                                        overflow: "hidden",
                                        border: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                                    }}
                                >
                                    <GoogleDrivePreview
                                        url={selectedAnnouncement.url_drive}
                                        height="calc(100vh - 280px)"
                                        title={selectedAnnouncement.title}
                                    />
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        p: 4,
                                        textAlign: "center",
                                        bgcolor: isDark ? "#18181b" : "#f8fafc",
                                        borderRadius: 2.5,
                                        border: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                                    }}
                                >
                                    <CampaignIcon sx={{ fontSize: 48, color: isDark ? "#52525b" : "#94a3b8", mb: 1 }} />
                                    <Typography variant="body2" sx={{ color: isDark ? "#a1a1aa" : "#64748b" }}>
                                        Tidak ada dokumen lampiran Google Drive untuk pengumuman ini.
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Drawer Footer (Sesuai Screenshot User: Tanggal di Kiri Bawah & Action di Kanan) */}
                        <Box
                            sx={{
                                p: 2,
                                px: 2.5,
                                bgcolor: isDark ? "#18181b" : "#f8fafc",
                                borderTop: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexShrink: 0,
                            }}
                        >
                            {/* Tanggal (Format: YYYY-MM-DD sesuai screenshot user) */}
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                <CalendarTodayIcon sx={{ fontSize: 16, color: isDark ? "#94a3b8" : "#64748b" }} />
                                <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? "#cbd5e1" : "#475569" }}>
                                    {moment(selectedAnnouncement.created_at).format("YYYY-MM-DD")}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1.5}>
                                {selectedAnnouncement.url_drive && (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                                        href={selectedAnnouncement.url_drive}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: 700,
                                            borderRadius: 2,
                                            borderColor: isDark ? "#3f3f46" : "#cbd5e1",
                                            color: isDark ? "#60a5fa" : "#2563eb",
                                        }}
                                    >
                                        Buka di Drive
                                    </Button>
                                )}
                                <Button
                                    onClick={() => setSelectedAnnouncement(null)}
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        textTransform: "none",
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        px: 2.5,
                                    }}
                                >
                                    Tutup
                                </Button>
                            </Stack>
                        </Box>
                    </>
                )}
            </Drawer>
        </Box>
    );
};

export default DashboardPage;
