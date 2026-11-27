import React from "react";
import {
    Box,
    Card,
    Grid,
    Typography,
    Stack,
    Chip,
    Divider,
    Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "@mui/material/styles";
import type { DailyMeetingItem } from "@api/dailyAttendance/model";
import { formatIndonesianShortDate } from "./utils/dailyAttendanceMapper";

interface DailySummaryCardsProps {
    meetings: DailyMeetingItem[];
}

export const DailySummaryCards: React.FC<DailySummaryCardsProps> = ({
    meetings,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    if (meetings.length === 0) {
        return (
            <Card
                variant="outlined"
                sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 2.5,
                    bgcolor: isDark ? "#18181b" : "#ffffff",
                    borderColor: isDark ? "#27272a" : "#e2e8f0",
                }}
            >
                <Typography variant="body2" sx={{ color: isDark ? "#a1a1aa" : "#64748b", fontWeight: 700 }}>
                    Tidak ada pertemuan efektif pada filter semester/bulan ini.
                </Typography>
            </Card>
        );
    }

    return (
        <Grid container spacing={2}>
            {meetings.map((m) => {
                const absentList = m.absent_students || [];
                const isRecorded = m.is_recorded;

                return (
                    <Grid key={m.date} size={{ xs: 12, md: 6, lg: 4 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 2.5,
                                overflow: "hidden",
                                bgcolor: isDark ? "#18181b" : "#ffffff",
                                borderColor: isRecorded
                                    ? isDark
                                        ? "#27272a"
                                        : "#cbd5e1"
                                    : isDark
                                    ? "#3f3f46"
                                    : "#e2e8f0",
                            }}
                        >
                            {/* Header ala buku absensi Gambar 1 */}
                            <Box
                                sx={{
                                    px: 2,
                                    py: 1.25,
                                    bgcolor: isDark ? "#27272a" : "#f8fafc",
                                    borderBottom: `1px solid ${isDark ? "#3f3f46" : "#e2e8f0"}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: 800,
                                            color: isDark ? "#a1a1aa" : "#64748b",
                                            display: "block",
                                            fontSize: "10.5px",
                                        }}
                                    >
                                        Pertemuan #{m.pertemuan_ke} · {m.semester}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 900,
                                            color: isDark ? "#f4f4f5" : "#0f172a",
                                        }}
                                    >
                                        Hari / Tanggal : {m.day} / {formatIndonesianShortDate(m.date)}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={
                                        !isRecorded
                                            ? "Belum Diisi"
                                            : m.is_nihil
                                            ? "Nihil"
                                            : `${absentList.length} Tidak Hadir`
                                    }
                                    size="small"
                                    color={
                                        !isRecorded
                                            ? "default"
                                            : m.is_nihil
                                            ? "success"
                                            : "warning"
                                    }
                                    variant={isRecorded ? "filled" : "outlined"}
                                    sx={{ fontWeight: 800, fontSize: "10.5px" }}
                                />
                            </Box>

                            {/* Tabel S / I / Tanpa Keterangan ala Gambar 1 */}
                            <Box sx={{ flex: 1, overflowX: "auto" }}>
                                <Box
                                    component="table"
                                    sx={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        fontSize: "12px",
                                    }}
                                >
                                    <Box component="thead">
                                        <Box
                                            component="tr"
                                            sx={{
                                                bgcolor: isDark ? "#1f1f23" : "#f1f5f9",
                                                borderBottom: `1px solid ${isDark ? "#3f3f46" : "#cbd5e1"}`,
                                            }}
                                        >
                                            <Box component="th" sx={{ px: 1.25, py: 0.75, textAlign: "center", width: 34, fontWeight: 800 }}>
                                                No
                                            </Box>
                                            <Box component="th" sx={{ px: 1.25, py: 0.75, textAlign: "left", fontWeight: 800 }}>
                                                Nama Siswa
                                            </Box>
                                            <Box component="th" sx={{ px: 1, py: 0.75, textAlign: "center", width: 32, fontWeight: 800 }}>
                                                S
                                            </Box>
                                            <Box component="th" sx={{ px: 1, py: 0.75, textAlign: "center", width: 32, fontWeight: 800 }}>
                                                I
                                            </Box>
                                            <Box component="th" sx={{ px: 1, py: 0.75, textAlign: "center", width: 78, fontWeight: 800, fontSize: "10.5px" }}>
                                                Tanpa Ket.
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box component="tbody">
                                        {!isRecorded ? (
                                            <Box component="tr">
                                                <Box
                                                    component="td"
                                                    colSpan={5}
                                                    sx={{
                                                        py: 3.5,
                                                        textAlign: "center",
                                                        color: isDark ? "#71717a" : "#94a3b8",
                                                        fontStyle: "italic",
                                                    }}
                                                >
                                                    Belum ada input kehadiran harian
                                                </Box>
                                            </Box>
                                        ) : m.is_nihil ? (
                                            <Box component="tr">
                                                <Box
                                                    component="td"
                                                    colSpan={5}
                                                    sx={{
                                                        py: 3.5,
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <Stack direction="row" spacing={0.75} sx={{ justifyContent: "center", alignItems: "center" }}>
                                                        <CheckCircleIcon sx={{ fontSize: 18, color: "#16a34a" }} />
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                fontWeight: 900,
                                                                letterSpacing: "0.06em",
                                                                color: isDark ? "#86efac" : "#15803d",
                                                            }}
                                                        >
                                                            NIHIL
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant="caption" sx={{ color: isDark ? "#a1a1aa" : "#64748b" }}>
                                                        Seluruh {m.hadir_count} siswa hadir
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ) : (
                                            absentList.map((st, idx) => (
                                                <Box
                                                    key={st.id_student}
                                                    component="tr"
                                                    sx={{
                                                        borderBottom: `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`,
                                                    }}
                                                >
                                                    <Box component="td" sx={{ px: 1.25, py: 0.75, textAlign: "center", fontWeight: 700 }}>
                                                        {idx + 1}
                                                    </Box>
                                                    <Box component="td" sx={{ px: 1.25, py: 0.75 }}>
                                                        <Tooltip title={st.notes ? `Catatan: ${st.notes}` : ""} arrow>
                                                            <Typography variant="caption" sx={{ fontWeight: 700, display: "block" }}>
                                                                {st.name}
                                                            </Typography>
                                                        </Tooltip>
                                                        {st.notes && (
                                                            <Typography variant="caption" sx={{ fontSize: "10px", color: isDark ? "#a1a1aa" : "#64748b" }}>
                                                                {st.notes}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    <Box component="td" sx={{ px: 1, py: 0.75, textAlign: "center", fontWeight: 900, color: "#ca8a04" }}>
                                                        {st.status === "SAKIT" ? "✓" : ""}
                                                    </Box>
                                                    <Box component="td" sx={{ px: 1, py: 0.75, textAlign: "center", fontWeight: 900, color: "#2563eb" }}>
                                                        {st.status === "IZIN" ? "✓" : ""}
                                                    </Box>
                                                    <Box component="td" sx={{ px: 1, py: 0.75, textAlign: "center", fontWeight: 900, color: "#dc2626" }}>
                                                        {st.status === "ALPA" ? "✓" : ""}
                                                    </Box>
                                                </Box>
                                            ))
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            <Divider />

                            {/* Footer Kartu: Petugas (Mode Lihat) */}
                            <Box
                                sx={{
                                    px: 2,
                                    py: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    bgcolor: isDark ? "#18181b" : "#fafafa",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: isDark ? "#a1a1aa" : "#64748b",
                                        fontSize: "10.5px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {m.last_updated_by
                                        ? `Oleh: ${m.last_updated_by}`
                                        : "Ketua/Pengurus Kelas"}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default DailySummaryCards;
