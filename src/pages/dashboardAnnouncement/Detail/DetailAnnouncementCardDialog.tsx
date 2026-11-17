import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    DialogActions,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemAvatar,
    Paper,
    Chip,
    CircularProgress,
    Stack,
    Avatar,
    useTheme,
} from "@mui/material";
import { BaseDialog } from "@components/Dialog";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import CampaignIcon from "@mui/icons-material/Campaign";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import AnnouncementService from "@api/announcement";
import GoogleDrivePreview from "@components/GoogleDrivePreview/GoogleDrivePreview";
import getProfilePhotoUrl from "@utils/getProfilePhotoUrl";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    announcementId: string | null;
};

const DetailAnnouncementCardDialog: React.FC<Props> = ({
    isOpen,
    onClose,
    announcementId,
}) => {
    const [data, setData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const service = new AnnouncementService();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    useEffect(() => {
        if (isOpen && announcementId) {
            setIsLoading(true);
            service.fetchAnnouncementByIdRequest(announcementId, {
                onSuccess: (res: any) => {
                    const item = res?.data || res;
                    setData(item);
                },
                onError: () => {},
                onFullfilled: () => {
                    setIsLoading(false);
                },
            });
        }
    }, [isOpen, announcementId]);

    const logs = data?.user_logs || [];

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose} maxWidth="md">
            <Box sx={{ p: { xs: 2, sm: 3 }, width: "100%", overflowX: "hidden" }}>
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8, gap: 1.5, alignItems: "center" }}>
                        <CircularProgress size={32} />
                        <Typography variant="body2" color="text.secondary">
                            Memuat rincian pengumuman...
                        </Typography>
                    </Box>
                ) : data ? (
                    <Box>
                        {/* Title and Date */}
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 2,
                                    bgcolor: isDark ? "rgba(37,99,235,0.15)" : "#eff6ff",
                                    color: "#2563eb",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <CampaignIcon fontSize="medium" />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a" }}>
                                    {data.title}
                                </Typography>
                                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mt: 0.5 }}>
                                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: isDark ? "#94a3b8" : "#64748b" }}>
                                        <CalendarTodayIcon sx={{ fontSize: 14 }} />
                                        <Typography variant="caption">
                                            {data.created_at ? new Date(data.created_at).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }) : "-"}
                                        </Typography>
                                    </Stack>
                                    <Chip label="Aktif" size="small" color="success" sx={{ height: 20, fontSize: "10px", fontWeight: 700 }} />
                                </Stack>
                            </Box>
                        </Box>

                        {/* Description */}
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2.5,
                                mb: 3,
                                bgcolor: isDark ? "rgba(30,41,59,0.5)" : "#f8fafc",
                                borderRadius: 2,
                                border: isDark ? "1px solid rgba(51,65,85,0.5)" : "1px solid #e2e8f0",
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? "#cbd5e1" : "#334155", mb: 1 }}>
                                Deskripsi Pengumuman:
                            </Typography>
                            {data.description ? (
                                <Box
                                    sx={{
                                        color: isDark ? "#e2e8f0" : "#1e293b",
                                        lineHeight: 1.7,
                                        fontSize: "14px",
                                        wordBreak: "break-word",
                                        "& strong, & b": { fontWeight: 700 },
                                        "& em, & i": { fontStyle: "italic" },
                                        "& u": { textDecoration: "underline" },
                                        "& del, & strike, & s": { textDecoration: "line-through" },
                                        "& ul": { pl: 3, my: 1, listStyleType: "disc" },
                                        "& ol": { pl: 3, my: 1, listStyleType: "decimal" },
                                        "& li": { my: 0.5 },
                                        "& h2, & h3": {
                                            fontWeight: 800,
                                            fontSize: "16px",
                                            my: 1,
                                            color: isDark ? "#93c5fd" : "#1e40af",
                                        },
                                        "& blockquote": {
                                            borderLeft: "3px solid #3b82f6",
                                            pl: 2,
                                            my: 1,
                                            py: 0.5,
                                            color: isDark ? "#93c5fd" : "#1d4ed8",
                                            bgcolor: isDark ? "rgba(59,130,246,0.1)" : "#eff6ff",
                                            borderRadius: "0 6px 6px 0",
                                            fontStyle: "italic",
                                        },
                                        "& a": {
                                            color: "#2563eb",
                                            textDecoration: "underline",
                                        },
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: (data.description || "")
                                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                            .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
                                            .replace(/~~(.*?)~~/g, "<del>$1</del>")
                                            .replace(/\n/g, "<br>"),
                                    }}
                                />
                            ) : (
                                <Typography variant="body2" sx={{ color: isDark ? "#94a3b8" : "#64748b", fontStyle: "italic" }}>
                                    (Tidak ada deskripsi)
                                </Typography>
                            )}
                        </Paper>

                        {/* Document Google Drive Viewer */}
                        <Box sx={{ mb: 3 }}>
                            <GoogleDrivePreview
                                url={data.url_drive}
                                height={380}
                                title="Dokumen Lampiran Google Drive"
                            />
                        </Box>

                        {/* User Activity Logs */}
                        {logs.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                                    <HistoryIcon fontSize="small" sx={{ color: isDark ? "#94a3b8" : "#64748b" }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a" }}>
                                        Riwayat Pembuatan & Perubahan
                                    </Typography>
                                </Box>

                                <List sx={{
                                    bgcolor: isDark ? "rgba(30,41,59,0.5)" : "#ffffff",
                                    borderRadius: 2,
                                    border: isDark ? "1px solid rgba(51,65,85,0.5)" : "1px solid #e2e8f0",
                                    p: 0,
                                }}>
                                    {logs.map((log: any, index: number) => {
                                        const photoUrl = getProfilePhotoUrl(log.profile_url);
                                        const displayName = log.user_name || "Admin";
                                        const displayId = log.identifier || (log.id_user ? log.id_user.substring(0, 8) + "..." : "-");
                                        const formattedDate = log.created_at
                                            ? new Date(log.created_at).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                            })
                                            : "-";

                                        return (
                                            <ListItem
                                                key={log.id_log || index}
                                                divider={index !== logs.length - 1}
                                                sx={{
                                                    py: 1.5,
                                                    px: 2,
                                                    borderColor: isDark ? "rgba(51,65,85,0.3)" : undefined,
                                                }}
                                            >
                                                <ListItemAvatar sx={{ minWidth: 48 }}>
                                                    <Avatar
                                                        src={photoUrl}
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            bgcolor: log.action === "created" ? "#22c55e" : "#3b82f6",
                                                            fontSize: 14,
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {!photoUrl && (
                                                            <PersonIcon sx={{ fontSize: 20 }} />
                                                        )}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                                            <Typography variant="body2" fontWeight={700} sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
                                                                {displayName}
                                                            </Typography>
                                                            <Chip
                                                                label={displayId}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: "10px",
                                                                    fontWeight: 600,
                                                                    color: isDark ? "#94a3b8" : "#64748b",
                                                                    borderColor: isDark ? "rgba(100,116,139,0.4)" : "#cbd5e1",
                                                                }}
                                                            />
                                                            <Chip
                                                                label={log.action === "created" ? "Dibuat" : "Diperbarui"}
                                                                size="small"
                                                                color={log.action === "created" ? "success" : "info"}
                                                                variant="outlined"
                                                                sx={{ height: 20, fontSize: "10px", fontWeight: 700 }}
                                                            />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Typography variant="caption" sx={{ color: isDark ? "#64748b" : "#94a3b8", mt: 0.25, display: "block" }}>
                                                            {formattedDate}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Typography color="error">Data pengumuman tidak ditemukan.</Typography>
                )}
            </Box>

            <DialogActions sx={{
                p: 2,
                bgcolor: isDark ? "rgba(30,41,59,0.8)" : "#f8fafc",
                borderTop: isDark ? "1px solid rgba(51,65,85,0.5)" : "1px solid #e2e8f0",
            }}>
                <Button onClick={onClose} variant="contained" color="inherit">
                    Tutup
                </Button>
            </DialogActions>
        </BaseDialog>
    );
};

export default DetailAnnouncementCardDialog;
