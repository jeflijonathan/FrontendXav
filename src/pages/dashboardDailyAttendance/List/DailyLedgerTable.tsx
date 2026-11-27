import React from "react";
import { Box, Card, Typography, Tooltip, CircularProgress, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type {
    DailyAttendanceStatus,
    DailyMeetingItem,
    DailyMonthlyLedgerResponse,
} from "@api/dailyAttendance/model";

interface DailyLedgerTableProps {
    ledger: DailyMonthlyLedgerResponse | null;
    isLoading: boolean;
    meetings: DailyMeetingItem[];
    canEdit: boolean;
    onSelectDateToEdit: (meeting: DailyMeetingItem) => void;
}

const renderCellSymbol = (
    status: DailyAttendanceStatus | null | undefined,
    isEffective: boolean,
    isDark: boolean
) => {
    if (!status) {
        return (
            <Typography
                variant="caption"
                sx={{
                    color: isEffective
                        ? isDark
                            ? "#52525b"
                            : "#cbd5e1"
                        : isDark
                        ? "#3f3f46"
                        : "#e2e8f0",
                    fontSize: "10px",
                }}
            >
                {isEffective ? "" : "–"}
            </Typography>
        );
    }
    if (status === "HADIR") {
        return (
            <Typography
                component="span"
                sx={{
                    fontWeight: 900,
                    fontSize: "15px",
                    lineHeight: 1,
                    color: isDark ? "#86efac" : "#15803d",
                }}
            >
                •
            </Typography>
        );
    }
    if (status === "SAKIT") {
        return (
            <Typography
                component="span"
                sx={{ fontWeight: 900, fontSize: "11px", color: isDark ? "#fde047" : "#a16207" }}
            >
                S
            </Typography>
        );
    }
    if (status === "IZIN") {
        return (
            <Typography
                component="span"
                sx={{ fontWeight: 900, fontSize: "11px", color: isDark ? "#93c5fd" : "#1d4ed8" }}
            >
                I
            </Typography>
        );
    }
    return (
        <Typography
            component="span"
            sx={{ fontWeight: 900, fontSize: "11px", color: isDark ? "#fca5a5" : "#dc2626" }}
        >
            A
        </Typography>
    );
};

export const DailyLedgerTable: React.FC<DailyLedgerTableProps> = ({
    ledger,
    isLoading,
    meetings,
    canEdit,
    onSelectDateToEdit,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <Stack spacing={1.5} sx={{ alignItems: "center" }}>
                    <CircularProgress size={28} />
                    <Typography variant="caption" sx={{ color: isDark ? "#a1a1aa" : "#64748b" }}>
                        Memuat buku induk kehadiran bulanan...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    if (!ledger || ledger.rows.length === 0) {
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
                    Belum ada data siswa pada kelas atau bulan yang dipilih.
                </Typography>
            </Card>
        );
    }

    const dayColumns = Array.from({ length: ledger.days_in_month }, (_, i) => i + 1);
    const effectiveSet = new Set(ledger.effective_days || []);
    const meetingByDay = new Map<number, DailyMeetingItem>();
    for (const m of meetings) {
        const y = Number(m.date.slice(0, 4));
        const mo = Number(m.date.slice(5, 7));
        const d = Number(m.date.slice(8, 10));
        if (y === ledger.year && mo === ledger.month) {
            meetingByDay.set(d, m);
        }
    }

    const borderClr = isDark ? "#27272a" : "#cbd5e1";
    const headerBg = isDark ? "#18181b" : "#f8fafc";

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 2.5,
                overflow: "hidden",
                bgcolor: isDark ? "#09090b" : "#ffffff",
                borderColor: borderClr,
            }}
        >
            <Box sx={{ overflowX: "auto" }}>
                <Box
                    component="table"
                    sx={{
                        borderCollapse: "collapse",
                        width: "100%",
                        minWidth: 1100,
                        fontSize: "12px",
                    }}
                >
                    <Box component="thead">
                        {/* Baris Header 1 */}
                        <Box component="tr" sx={{ bgcolor: headerBg }}>
                            <Box
                                component="th"
                                rowSpan={2}
                                sx={{ px: 1, py: 1, border: `1px solid ${borderClr}`, textAlign: "center", width: 38 }}
                            >
                                No.
                            </Box>
                            <Box
                                component="th"
                                rowSpan={2}
                                sx={{ px: 1.25, py: 1, border: `1px solid ${borderClr}`, textAlign: "center", width: 88 }}
                            >
                                No. Induk
                            </Box>
                            <Box
                                component="th"
                                rowSpan={2}
                                sx={{
                                    px: 1.5,
                                    py: 1,
                                    border: `1px solid ${borderClr}`,
                                    textAlign: "left",
                                    minWidth: 185,
                                    position: "sticky",
                                    left: 0,
                                    zIndex: 2,
                                    bgcolor: headerBg,
                                }}
                            >
                                Nama Murid
                            </Box>
                            <Box
                                component="th"
                                rowSpan={2}
                                sx={{ px: 0.75, py: 1, border: `1px solid ${borderClr}`, textAlign: "center", width: 38 }}
                            >
                                L/P
                            </Box>
                            <Box
                                component="th"
                                colSpan={dayColumns.length}
                                sx={{
                                    px: 1,
                                    py: 0.75,
                                    border: `1px solid ${borderClr}`,
                                    textAlign: "center",
                                    fontWeight: 900,
                                    letterSpacing: "0.15em",
                                }}
                            >
                                TANGGAL
                            </Box>
                            <Box
                                component="th"
                                colSpan={4}
                                sx={{ px: 1, py: 0.75, border: `1px solid ${borderClr}`, textAlign: "center", fontWeight: 900 }}
                            >
                                Absen
                            </Box>
                            <Box
                                component="th"
                                rowSpan={2}
                                sx={{ px: 1.25, py: 1, border: `1px solid ${borderClr}`, textAlign: "left", minWidth: 130 }}
                            >
                                Ket
                            </Box>
                        </Box>

                        {/* Baris Header 2: Tanggal 1..31 & S I A Jml */}
                        <Box component="tr" sx={{ bgcolor: headerBg }}>
                            {dayColumns.map((d) => {
                                const isEff = effectiveSet.has(d);
                                const meeting = meetingByDay.get(d);
                                const clickable = canEdit && isEff && Boolean(meeting);

                                return (
                                    <Box
                                        key={d}
                                        component="th"
                                        onClick={() => {
                                            if (clickable && meeting) onSelectDateToEdit(meeting);
                                        }}
                                        sx={{
                                            px: 0.25,
                                            py: 0.6,
                                            border: `1px solid ${borderClr}`,
                                            textAlign: "center",
                                            minWidth: 26,
                                            fontSize: "10.5px",
                                            fontWeight: isEff ? 900 : 500,
                                            bgcolor: !isEff
                                                ? isDark
                                                    ? "#141416"
                                                    : "#f1f5f9"
                                                : meeting?.is_recorded
                                                ? isDark
                                                    ? "rgba(37, 99, 235, 0.18)"
                                                    : "#eff6ff"
                                                : headerBg,
                                            color: !isEff
                                                ? isDark
                                                    ? "#52525b"
                                                    : "#94a3b8"
                                                : isDark
                                                ? "#e4e4e7"
                                                : "#0f172a",
                                            cursor: clickable ? "pointer" : "default",
                                            "&:hover": clickable
                                                ? { bgcolor: isDark ? "#2563eb" : "#dbeafe" }
                                                : undefined,
                                        }}
                                    >
                                        <Tooltip
                                            title={
                                                !isEff
                                                    ? `Tgl ${d}: Libur / Non-efektif`
                                                    : clickable
                                                    ? `Klik untuk input/edit Tgl ${d}`
                                                    : `Tgl ${d}`
                                            }
                                            arrow
                                        >
                                            <span>{d}</span>
                                        </Tooltip>
                                    </Box>
                                );
                            })}
                            <Box component="th" sx={{ px: 0.75, py: 0.6, border: `1px solid ${borderClr}`, textAlign: "center", width: 28, color: "#ca8a04" }}>
                                S
                            </Box>
                            <Box component="th" sx={{ px: 0.75, py: 0.6, border: `1px solid ${borderClr}`, textAlign: "center", width: 28, color: "#2563eb" }}>
                                I
                            </Box>
                            <Box component="th" sx={{ px: 0.75, py: 0.6, border: `1px solid ${borderClr}`, textAlign: "center", width: 28, color: "#dc2626" }}>
                                A
                            </Box>
                            <Box component="th" sx={{ px: 0.75, py: 0.6, border: `1px solid ${borderClr}`, textAlign: "center", width: 34 }}>
                                Jml
                            </Box>
                        </Box>
                    </Box>

                    <Box component="tbody">
                        {ledger.rows.map((row) => (
                            <Box
                                key={row.id_student}
                                component="tr"
                                sx={{
                                    "&:hover td": {
                                        bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                                    },
                                }}
                            >
                                <Box component="td" sx={{ px: 1, py: 0.75, border: `1px solid ${borderClr}`, textAlign: "center", fontWeight: 700 }}>
                                    {row.no}
                                </Box>
                                <Box component="td" sx={{ px: 1, py: 0.75, border: `1px solid ${borderClr}`, textAlign: "center", fontSize: "11px" }}>
                                    {row.nis}
                                </Box>
                                <Box
                                    component="td"
                                    sx={{
                                        px: 1.5,
                                        py: 0.75,
                                        border: `1px solid ${borderClr}`,
                                        fontWeight: 700,
                                        position: "sticky",
                                        left: 0,
                                        zIndex: 1,
                                        bgcolor: isDark ? "#09090b" : "#ffffff",
                                    }}
                                >
                                    {row.name}
                                </Box>
                                <Box component="td" sx={{ px: 0.75, py: 0.75, border: `1px solid ${borderClr}`, textAlign: "center", fontWeight: 700 }}>
                                    {row.gender}
                                </Box>

                                {dayColumns.map((d) => {
                                    const isEff = effectiveSet.has(d);
                                    const val = row.days[String(d)];
                                    return (
                                        <Box
                                            key={d}
                                            component="td"
                                            sx={{
                                                px: 0.25,
                                                py: 0.5,
                                                border: `1px solid ${borderClr}`,
                                                textAlign: "center",
                                                bgcolor: !isEff
                                                    ? isDark
                                                        ? "#121215"
                                                        : "#f8fafc"
                                                    : undefined,
                                            }}
                                        >
                                            {renderCellSymbol(val, isEff, isDark)}
                                        </Box>
                                    );
                                })}

                                <Box component="td" sx={{ px: 0.75, py: 0.75, border: `1px solid ${borderClr}`, textAlign: "center", fontWeight: 800, color: row.sakit > 0 ? "#ca8a04" : undefined }}>
                                    {row.sakit || ""}
                                </Box>
                                <Box component="td" sx={{ px: 0.75, py: 0.75, border: `1px solid ${borderClr}`, textAlign: "center", fontWeight: 800, color: row.izin > 0 ? "#2563eb" : undefined }}>
                                    {row.izin || ""}
                                </Box>
                                <Box component="td" sx={{ px: 0.75, py: 0.75, border: `1px solid ${borderClr}`, textAlign: "center", fontWeight: 800, color: row.alpa > 0 ? "#dc2626" : undefined }}>
                                    {row.alpa || ""}
                                </Box>
                                <Box component="td" sx={{ px: 0.75, py: 0.75, border: `1px solid ${borderClr}`, textAlign: "center", fontWeight: 900 }}>
                                    {row.total_absent || ""}
                                </Box>
                                <Box component="td" sx={{ px: 1.25, py: 0.75, border: `1px solid ${borderClr}`, fontSize: "11px", color: isDark ? "#a1a1aa" : "#64748b" }}>
                                    {row.ket}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default DailyLedgerTable;
