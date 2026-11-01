import React, { useState } from "react";
import {
    Box,
    Typography,
    Chip,
    Avatar,
    Tooltip,
} from "@mui/material";
import type { EmployeeResponseModel } from "@api/employee/model";
import ImagePreviewModal from "@components/feedback/ImagePreviewModal";
import getProfilePhotoUrl from "@utils/getProfilePhotoUrl";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WcIcon from "@mui/icons-material/Wc";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import SecurityIcon from "@mui/icons-material/Security";
import NotesIcon from "@mui/icons-material/Notes";
import ScheduleIcon from "@mui/icons-material/Schedule";

interface DetailEmployeeContentProps {
    detail: EmployeeResponseModel;
}

const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return d.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    } catch {
        return dateString;
    }
};

const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return "-";
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return d.toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return dateString;
    }
};

const getAge = (birthDateString?: string | null) => {
    if (!birthDateString) return null;
    try {
        const birthDate = new Date(birthDateString);
        if (isNaN(birthDate.getTime())) return null;
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age > 0 ? `${age} tahun` : null;
    } catch {
        return null;
    }
};

const DetailItem = ({
    icon,
    label,
    value,
    fullWidth = false,
}: {
    icon?: React.ReactNode;
    label: string;
    value?: React.ReactNode;
    fullWidth?: boolean;
}) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            gridColumn: fullWidth ? { xs: "span 1", sm: "span 2" } : undefined,
        }}
    >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            {icon && (
                <Box
                    sx={{
                        color: "text.secondary",
                        display: "flex",
                        alignItems: "center",
                        "& svg": { fontSize: 16 },
                    }}
                >
                    {icon}
                </Box>
            )}
            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                {label}
            </Typography>
        </Box>
        <Typography
            variant="body2"
            sx={{
                fontWeight: 500,
                color: value && value !== "-" ? "text.primary" : "text.secondary",
                wordBreak: "break-word",
            }}
        >
            {value || "-"}
        </Typography>
    </Box>
);

const SectionCard = ({
    title,
    icon,
    children,
}: {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) => (
    <Box
        sx={{
            p: 2.5,
            borderRadius: 2.5,
            bgcolor: (theme) => (theme.palette.mode === "dark" ? "background.paper" : "#ffffff"),
            border: 1,
            borderColor: "divider",
            boxShadow: (theme) =>
                theme.palette.mode === "dark"
                    ? "0 1px 3px rgba(0,0,0,0.3)"
                    : "0 1px 3px rgba(0,0,0,0.04)",
        }}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                pb: 1,
                borderBottom: 1,
                borderColor: "divider",
            }}
        >
            {icon && <Box sx={{ color: "primary.main", display: "flex", "& svg": { fontSize: 20 } }}>{icon}</Box>}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main", letterSpacing: 0.3 }}>
                {title}
            </Typography>
        </Box>
        {children}
    </Box>
);

const DetailEmployeeContent: React.FC<DetailEmployeeContentProps> = ({ detail }) => {
    const [isPhotoPreviewOpen, setIsPhotoPreviewOpen] = useState(false);

    const fullName = [detail.first_name, detail.last_name].filter(Boolean).join(" ") || detail.user?.full_name || "-";
    const photoSrc = getProfilePhotoUrl(detail.profile_url);
    const age = getAge(detail.detail?.birth_date);
    const genderLabel = detail.detail?.gender === "L" ? "Laki-laki" : detail.detail?.gender === "P" ? "Perempuan" : "-";

    return (
        <div className="flex flex-col gap-4">
            {/* Header Profile Hero Card */}
            <Box
                sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: (theme) =>
                        theme.palette.mode === "dark" ? "grey.900" : "#f8fafc",
                    border: 1,
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    gap: 3,
                }}
            >
                {/* Foto Profil dengan Zoom Indicator */}
                <Box sx={{ position: "relative" }}>
                    {photoSrc ? (
                        <Box
                            onClick={() => setIsPhotoPreviewOpen(true)}
                            sx={{
                                position: "relative",
                                cursor: "pointer",
                                borderRadius: "50%",
                                overflow: "hidden",
                                width: 100,
                                height: 100,
                                border: 3,
                                borderColor: "primary.main",
                                "&:hover .zoom-overlay": { opacity: 1 },
                            }}
                        >
                            <img
                                src={photoSrc}
                                alt={fullName}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <Box
                                className="zoom-overlay"
                                sx={{
                                    position: "absolute",
                                    inset: 0,
                                    bgcolor: "rgba(0,0,0,0.45)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    opacity: 0,
                                    transition: "opacity 0.2s",
                                }}
                            >
                                <ZoomInIcon sx={{ color: "white", fontSize: 28 }} />
                            </Box>
                        </Box>
                    ) : (
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                bgcolor: "primary.main",
                                fontSize: "2.25rem",
                                fontWeight: 700,
                            }}
                        >
                            {detail.first_name ? detail.first_name[0].toUpperCase() : "P"}
                        </Avatar>
                    )}
                </Box>

                {/* Info Utama Pegawai */}
                <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                        {fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        Username: @{detail.user?.username || "-"}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            justifyContent: { xs: "center", sm: "flex-start" },
                        }}
                    >
                        <Chip
                            icon={<BadgeIcon sx={{ "&&": { fontSize: 16 } }} />}
                            label={`NIY: ${detail.niy || "-"}`}
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                        <Chip
                            label={detail.status ? "Aktif" : "Non-Aktif"}
                            color={detail.status ? "success" : "error"}
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                        {detail.user?.roles && detail.user.roles.length > 0 ? (
                            detail.user.roles.map((role) => (
                                <Chip
                                    key={role.id}
                                    label={role.name}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                />
                            ))
                        ) : (
                            <Chip label="Pegawai" size="small" variant="outlined" />
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Grid 2 Kolom untuk Section Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Biodata Pribadi */}
                <SectionCard title="Biodata & Informasi Pribadi" icon={<PersonIcon />}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <DetailItem label="Nama Depan" value={detail.first_name} />
                        <DetailItem label="Nama Belakang" value={detail.last_name || "-"} />
                        <DetailItem
                            icon={<WcIcon />}
                            label="Jenis Kelamin"
                            value={genderLabel}
                        />
                        <DetailItem
                            icon={<CalendarTodayIcon />}
                            label="Tanggal Lahir"
                            value={
                                detail.detail?.birth_date ? (
                                    <span>
                                        {formatDate(detail.detail.birth_date)}
                                        {age && (
                                            <Typography
                                                component="span"
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ ml: 0.75 }}
                                            >
                                                ({age})
                                            </Typography>
                                        )}
                                    </span>
                                ) : (
                                    "-"
                                )
                            }
                        />
                        <DetailItem
                            label="Tempat Lahir"
                            value={detail.detail?.birth_place || "-"}
                            fullWidth
                        />
                    </div>
                </SectionCard>

                {/* 2. Kontak & Alamat */}
                <SectionCard title="Kontak & Domisili" icon={<HomeIcon />}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <DetailItem
                            icon={<EmailIcon />}
                            label="Email"
                            value={detail.email}
                            fullWidth
                        />
                        <DetailItem
                            icon={<PhoneIcon />}
                            label="Nomor Telepon"
                            value={detail.detail?.phone_number || "-"}
                            fullWidth
                        />
                        <DetailItem
                            icon={<HomeIcon />}
                            label="Alamat Lengkap"
                            value={detail.detail?.address || "-"}
                            fullWidth
                        />
                        <DetailItem
                            label="RT / RW"
                            value={`${detail.detail?.RT || "-"} / ${detail.detail?.RW || "-"}`}
                        />
                        <DetailItem
                            label="Kode Pos"
                            value={detail.detail?.zip_code || "-"}
                        />
                    </div>
                </SectionCard>

                {/* 3. Informasi Akun & Akses */}
                <SectionCard title="Akun & Hak Akses" icon={<SecurityIcon />}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <DetailItem label="Username" value={detail.user?.username || "-"} />
                        <DetailItem label="NIY" value={detail.niy || "-"} />
                        <DetailItem
                            label="Role / Hak Akses"
                            value={
                                detail.user?.roles && detail.user.roles.length > 0 ? (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {detail.user.roles.map((r) => (
                                            <Chip
                                                key={r.id}
                                                label={r.name}
                                                size="small"
                                                sx={{ fontSize: "0.75rem", height: 22 }}
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    "-"
                                )
                            }
                            fullWidth
                        />
                        <DetailItem
                            label="Employee ID"
                            value={
                                <Tooltip title="Klik untuk salin" arrow>
                                    <span
                                        style={{ cursor: "pointer", fontFamily: "monospace", fontSize: "0.8rem" }}
                                        onClick={() => navigator.clipboard.writeText(detail.id)}
                                    >
                                        {detail.id}
                                    </span>
                                </Tooltip>
                            }
                            fullWidth
                        />
                        <DetailItem
                            label="User ID"
                            value={
                                <Tooltip title="Klik untuk salin" arrow>
                                    <span
                                        style={{ cursor: "pointer", fontFamily: "monospace", fontSize: "0.8rem" }}
                                        onClick={() => navigator.clipboard.writeText(detail.user_id)}
                                    >
                                        {detail.user_id}
                                    </span>
                                </Tooltip>
                            }
                            fullWidth
                        />
                    </div>
                </SectionCard>

                {/* 4. Aktivitas & Metadata Sistem */}
                <SectionCard title="Aktivitas & Log Sistem" icon={<ScheduleIcon />}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <DetailItem
                            label="Dibuat Pada"
                            value={formatDateTime(detail.created_at)}
                        />
                        <DetailItem
                            label="Terakhir Diperbarui"
                            value={formatDateTime(detail.updated_at)}
                        />
                        <DetailItem
                            label="Status Akun"
                            value={
                                <Chip
                                    label={detail.status ? "Aktif" : "Non-Aktif"}
                                    color={detail.status ? "success" : "error"}
                                    size="small"
                                    sx={{ height: 22, fontSize: "0.75rem" }}
                                />
                            }
                        />
                        <DetailItem
                            label="Status Terhapus"
                            value={detail.deleted_at ? formatDateTime(detail.deleted_at) : "Tidak (Aktif)"}
                        />
                    </div>
                </SectionCard>
            </div>

            {/* 5. Catatan / Deskripsi (jika ada) */}
            {detail.detail?.description && (
                <SectionCard title="Catatan / Deskripsi Tambahan" icon={<NotesIcon />}>
                    <Typography variant="body2" sx={{ color: "text.primary", whiteSpace: "pre-line" }}>
                        {detail.detail.description}
                    </Typography>
                </SectionCard>
            )}

            {/* Modal Zoom Foto */}
            {photoSrc && (
                <ImagePreviewModal
                    open={isPhotoPreviewOpen}
                    onClose={() => setIsPhotoPreviewOpen(false)}
                    src={photoSrc}
                    title={fullName}
                />
            )}
        </div>
    );
};

export default DetailEmployeeContent;
