import React, { useEffect, useState } from "react";
import {
    Button,
    Box,
    Typography,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
} from "@mui/material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import { LoadingSpinner, ImagePreviewModal } from "@components/feedback";
import useDashboardStudentStore from "../store";
import StudentService from "@api/student/service";
import type { StudentResponseModel } from "@api/student/model";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WcIcon from "@mui/icons-material/Wc";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import WorkIcon from "@mui/icons-material/Work";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import InfoIcon from "@mui/icons-material/Info";

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
                color: value ? "text.primary" : "text.disabled",
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
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
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

const DetailStudentCardDialog: React.FC<{ id: string; isOpen: boolean; onClose: () => void }> = ({
    id,
    isOpen,
    onClose,
}) => {
    const { state } = useDashboardStudentStore();
    const [detail, setDetail] = useState<StudentResponseModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPhotoPreviewOpen, setIsPhotoPreviewOpen] = useState(false);

    useEffect(() => {
        if (id && isOpen) {
            const student = state.data.find((std) => std.id === id);
            if (student) {
                setDetail(student);
            } else {
                setIsLoading(true);
            }

            // Always fetch complete fresh data including relations from backend
            new StudentService().getById(id, {
                onSuccess: (res) => {
                    setDetail(res);
                },
                onError: (err) => {
                    console.error("Failed to load student detail:", err);
                    if (!student) setDetail(null);
                },
                onFullfilled: () => setIsLoading(false),
            });
        }
    }, [id, isOpen]);

    const photoSrc = detail?.profile_url
        ? `${import.meta.env.VITE_BACKEND_URL}/api/upload/${detail.profile_url}`
        : null;

    const age = getAge(detail?.birth_date);

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose} maxWidth="md">
            <DialogHeader title="Detail Lengkap Siswa" onClose={onClose} />
            <DialogBody>
                {isLoading && !detail ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <LoadingSpinner isLoading={isLoading} />
                    </Box>
                ) : !detail ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                        <Typography variant="body2" color="text.secondary">
                            Data siswa tidak ditemukan
                        </Typography>
                    </Box>
                ) : (
                    <div className="flex flex-col gap-4">
                        {/* Header Profile Box */}
                        <Box
                            sx={{
                                p: 3,
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
                                            width: 110,
                                            height: 110,
                                            border: "3px solid",
                                            borderColor: "primary.main",
                                            boxShadow: 2,
                                            "&:hover .zoom-overlay": {
                                                opacity: 1,
                                            },
                                        }}
                                        title="Klik untuk memperbesar foto"
                                    >
                                        <img
                                            src={photoSrc}
                                            alt={`${detail.first_name} ${detail.last_name}`}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
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
                                                transition: "opacity 0.2s ease-in-out",
                                                color: "white",
                                            }}
                                        >
                                            <ZoomInIcon />
                                        </Box>
                                    </Box>
                                ) : (
                                    <Avatar
                                        sx={{
                                            width: 110,
                                            height: 110,
                                            bgcolor: "primary.main",
                                            fontSize: "2.5rem",
                                            fontWeight: 700,
                                            border: "3px solid #e0e0e0",
                                        }}
                                    >
                                        {detail.first_name?.[0]?.toUpperCase() || "?"}
                                    </Avatar>
                                )}
                            </Box>

                            {/* Nama, Status, Roles & Identitas */}
                            <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        justifyContent: { xs: "center", sm: "flex-start" },
                                        gap: 1,
                                        mb: 0.75,
                                    }}
                                >
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                                        {detail.first_name} {detail.last_name}
                                    </Typography>

                                    <Chip
                                        label={detail.status ? "Aktif" : "Non Aktif"}
                                        color={detail.status ? "success" : "error"}
                                        size="small"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Box>

                                {/* Peran / Roles */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        justifyContent: { xs: "center", sm: "flex-start" },
                                        gap: 0.75,
                                        mb: 1.5,
                                    }}
                                >
                                    {detail.roles && detail.roles.length > 0 ? (
                                        detail.roles.map((r) => (
                                            <Chip
                                                key={r.id}
                                                label={
                                                    r.name === "siswa"
                                                        ? "Siswa"
                                                        : r.name === "pengurus_kelas"
                                                        ? "Pengurus Kelas"
                                                        : r.name
                                                }
                                                color={r.name === "pengurus_kelas" ? "primary" : "default"}
                                                size="small"
                                                variant={r.name === "pengurus_kelas" ? "filled" : "outlined"}
                                                sx={{ fontWeight: 500 }}
                                            />
                                        ))
                                    ) : (
                                        <Chip label="Siswa" size="small" variant="outlined" />
                                    )}
                                </Box>

                                {/* Badge Identitas Cepat */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 1.5,
                                        justifyContent: { xs: "center", sm: "flex-start" },
                                    }}
                                >
                                    <Box sx={{ bgcolor: "background.paper", px: 1.5, py: 0.5, borderRadius: 1.5, border: 1, borderColor: "divider" }}>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            NIS
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {detail.nis || "-"}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: "background.paper", px: 1.5, py: 0.5, borderRadius: 1.5, border: 1, borderColor: "divider" }}>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            NISN
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {detail.nisn || "-"}
                                        </Typography>
                                    </Box>
                                    {detail.user?.username && (
                                        <Box sx={{ bgcolor: "background.paper", px: 1.5, py: 0.5, borderRadius: 1.5, border: 1, borderColor: "divider" }}>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Username
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                {detail.user.username}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        {/* Section 1: Data Pribadi Siswa */}
                        <SectionCard title="Data Pribadi Siswa" icon={<PersonIcon />}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailItem label="Nama Depan" value={detail.first_name} />
                                <DetailItem label="Nama Belakang" value={detail.last_name} />
                                <DetailItem
                                    icon={<WcIcon />}
                                    label="Jenis Kelamin"
                                    value={
                                        detail.gender === "L"
                                            ? "Laki-laki (L)"
                                            : detail.gender === "P"
                                            ? "Perempuan (P)"
                                            : "-"
                                    }
                                />
                                <DetailItem
                                    icon={<CalendarTodayIcon />}
                                    label="Tempat & Tanggal Lahir"
                                    value={
                                        detail.birth_place || detail.birth_date
                                            ? `${detail.birth_place || "-"}, ${formatDate(detail.birth_date)}${
                                                  age ? ` (${age})` : ""
                                              }`
                                            : "-"
                                    }
                                />
                            </div>
                        </SectionCard>

                        {/* Section 2: Informasi Akademik & Kontak Siswa */}
                        <SectionCard title="Kontak & Akun Siswa" icon={<SchoolIcon />}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailItem icon={<EmailIcon />} label="Email Siswa" value={detail.email} />
                                <DetailItem icon={<PhoneIcon />} label="Nomor Telepon / WhatsApp" value={detail.phone_number} />
                                <DetailItem icon={<BadgeIcon />} label="NIS" value={detail.nis} />
                                <DetailItem icon={<BadgeIcon />} label="NISN" value={detail.nisn} />
                                {detail.user?.username && (
                                    <DetailItem label="Username Akun" value={detail.user.username} />
                                )}
                                <DetailItem label="Status Akun" value={detail.status ? "Aktif" : "Non Aktif"} />
                            </div>
                        </SectionCard>

                        {/* Section 3: Alamat & Domisili */}
                        <SectionCard title="Alamat & Domisili" icon={<HomeIcon />}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailItem
                                    label="Alamat Lengkap"
                                    value={detail.address}
                                    fullWidth
                                />
                                <div className="grid grid-cols-3 gap-2 col-span-1 sm:col-span-2">
                                    <DetailItem label="RT" value={detail.rt} />
                                    <DetailItem label="RW" value={detail.rw} />
                                    <DetailItem label="Kode Pos" value={detail.zip_code} />
                                </div>
                            </div>
                        </SectionCard>

                        {/* Section 4: Data Orang Tua / Wali */}
                        <SectionCard title="Data Orang Tua / Wali" icon={<FamilyRestroomIcon />}>
                            {detail.parents && detail.parents.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {detail.parents.map((parent, idx) => (
                                        <Box
                                            key={parent.id || idx}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: (theme) =>
                                                    theme.palette.mode === "dark"
                                                        ? "grey.800"
                                                        : "#f1f5f9",
                                                border: 1,
                                                borderColor: "divider",
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle2"
                                                fontWeight={700}
                                                color="primary.main"
                                                sx={{ mb: 1.5 }}
                                            >
                                                {parent.name || `Orang Tua / Wali #${idx + 1}`}
                                            </Typography>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <DetailItem label="Nama Lengkap" value={parent.name} />
                                                <DetailItem label="NIK" value={parent.nik} />
                                                <DetailItem
                                                    icon={<PhoneIcon />}
                                                    label="No. Telepon / WhatsApp"
                                                    value={parent.phone_number}
                                                />
                                                <DetailItem
                                                    icon={<EmailIcon />}
                                                    label="Email"
                                                    value={parent.email}
                                                />
                                                <DetailItem
                                                    icon={<WorkIcon />}
                                                    label="Pekerjaan"
                                                    value={parent.occupation}
                                                />
                                                <DetailItem
                                                    icon={<AttachMoneyIcon />}
                                                    label="Penghasilan Bulanan"
                                                    value={parent.income}
                                                />
                                            </div>
                                        </Box>
                                    ))}
                                </div>
                            ) : (
                                <Box
                                    sx={{
                                        py: 3,
                                        textAlign: "center",
                                        bgcolor: (theme) =>
                                            theme.palette.mode === "dark" ? "grey.800" : "#f8fafc",
                                        borderRadius: 2,
                                        border: "1px dashed",
                                        borderColor: "divider",
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        Belum ada data orang tua / wali yang dicatat untuk siswa ini.
                                    </Typography>
                                </Box>
                            )}
                        </SectionCard>

                        {/* Section 5: Informasi Sistem & Waktu */}
                        <SectionCard title="Informasi Sistem" icon={<InfoIcon />}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailItem label="ID Siswa (UUID)" value={detail.id} />
                                <DetailItem label="User ID Akun" value={detail.user_id} />
                                <DetailItem
                                    label="Terdaftar Pada"
                                    value={formatDateTime(detail.created_at)}
                                />
                                <DetailItem
                                    label="Terakhir Diperbarui"
                                    value={formatDateTime(detail.updated_at)}
                                />
                            </div>
                        </SectionCard>
                    </div>
                )}
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClose}
                    disableElevation
                    sx={{ borderRadius: "8px", textTransform: "none", px: 3 }}
                >
                    Tutup
                </Button>
            </DialogFooter>

            {photoSrc && (
                <ImagePreviewModal
                    open={isPhotoPreviewOpen}
                    onClose={() => setIsPhotoPreviewOpen(false)}
                    src={photoSrc}
                    title={`Foto Profil: ${detail?.first_name} ${detail?.last_name}`}
                />
            )}
        </BaseDialog>
    );
};

export default DetailStudentCardDialog;
