import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import VerifiedIcon from '@mui/icons-material/Verified';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import LinkIcon from '@mui/icons-material/Link';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { useScheduleStore } from '../store/useScheduleStore';
import { useAuthStore } from '@common/store/useAuthStore';
import { GoogleDrivePreview } from '@components/GoogleDrivePreview/GoogleDrivePreview';
import { parseGoogleDriveUrl } from '@utils/googleDrive';
import GuruPiketFormDialog from './GuruPiketFormDialog';
import type { GuruPiketEntry } from '../types';

export const GuruPiketAndApprovalCard: React.FC = () => {
    const {
        guruPiket,
        deleteGuruPiket,
        conflicts,
        approvalData,
        confirmApproval,
        revokeApproval,
        schoolInformations,
        idSchoolInformation,
    } = useScheduleStore();

    const { user, activeRole } = useAuthStore();

    // Dialog form guru piket
    const [isPiketDialogOpen, setIsPiketDialogOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // Form pengesahan kepala sekolah
    const [driveUrlInput, setDriveUrlInput] = useState(approvalData?.googleDriveUrl || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validasi wewenang Kepala Sekolah (Role Based Access Control)
    const isKepalaSekolah =
        activeRole === 'kepala_sekolah' ||
        user?.roles?.some((r) => r.name === 'kepala_sekolah') ||
        activeRole === 'admin' ||
        user?.roles?.some((r) => r.name === 'admin');

    // Data kepala sekolah aktif dari schoolInformation
    const activeSchoolInfo = schoolInformations.find(
        (i) => i.id_school_information === idSchoolInformation
    );
    const headmaster = activeSchoolInfo?.headmaster;
    const headmasterName = headmaster
        ? `${headmaster.first_name} ${headmaster.last_name || ''}`.trim()
        : approvalData?.approvedBy || 'Merly Puspita, S.Pd.';
    const headmasterNiy = headmaster?.niy || approvalData?.headmasterNiy || '19840214 200801 2 001';

    // Helper: Hitung bentrok piket untuk setiap guru piket
    const getPiketConflicts = (piket: GuruPiketEntry) => {
        return conflicts.filter((c) => {
            if (c.conflictType !== 'PIKET_CONFLICT') return false;
            if (c.day !== piket.hari) return false;
            if (piket.teacherCode && c.teacherCode === piket.teacherCode) return true;
            if (piket.name && c.teacherName && (
                c.teacherName.toLowerCase().includes(piket.name.toLowerCase()) ||
                piket.name.toLowerCase().includes(c.teacherName.toLowerCase())
            )) return true;
            return false;
        });
    };

    const handleOpenAddPiket = () => {
        setEditingIndex(null);
        setIsPiketDialogOpen(true);
    };

    const handleOpenEditPiket = (index: number) => {
        setEditingIndex(index);
        setIsPiketDialogOpen(true);
    };

    const handleDeletePiket = (index: number, name: string) => {
        if (window.confirm(`Hapus jadwal piket untuk ${name}?`)) {
            deleteGuruPiket(index);
        }
    };

    // Handler konfirmasi pengesahan Kepala Sekolah
    const handleConfirmApproval = async () => {
        if (!isKepalaSekolah) return;
        setIsSubmitting(true);
        try {
            await confirmApproval(driveUrlInput.trim());
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRevokeApproval = async () => {
        if (!isKepalaSekolah) return;
        if (window.confirm('Yakin ingin membatalkan status pengesahan dokumen jadwal ini?')) {
            setIsSubmitting(true);
            try {
                await revokeApproval();
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const driveParse = parseGoogleDriveUrl(driveUrlInput || approvalData?.googleDriveUrl);

    return (
        <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* 1. DAFTAR GURU PIKET HARIAN & DETEKSI BENTROK */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: '1px solid #cbd5e1',
                            p: 2.5,
                            bgcolor: '#ffffff',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Header Guru Piket */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 2,
                                        bgcolor: '#fef3c7',
                                        color: '#b45309',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AssignmentIndIcon fontSize="small" />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                        DAFTAR GURU PIKET HARIAN
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                        Aturan: Piket N JP = slot KBM 1-N bentrok jika mengajar
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={handleOpenAddPiket}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    bgcolor: '#2563eb',
                                    '&:hover': { bgcolor: '#1d4ed8' },
                                }}
                            >
                                Tambah Piket
                            </Button>
                        </Box>

                        {/* Banner Logika Bentrok */}
                        <Alert severity="info" sx={{ mb: 2, py: 0.5, borderRadius: 2 }}>
                            <Typography variant="caption" sx={{ color: '#1e3a8a', lineHeight: 1.4, display: 'block' }}>
                                📌 <strong>Mekanisme Bentrok:</strong> Guru piket otomatis terdeteksi <strong>BENTROK</strong> pada slot KBM 1 s/d {`<jumlah JP>`}. Slot KBM setelahnya bebas mengajar tanpa bentrok.
                            </Typography>
                        </Alert>

                        {/* Tabel Guru Piket */}
                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, flex: 1 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 800, width: 40, textAlign: 'center' }}>NO</TableCell>
                                        <TableCell sx={{ fontWeight: 800, width: 85 }}>HARI</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }}>NAMA GURU PIKET</TableCell>
                                        <TableCell sx={{ fontWeight: 800, width: 95, textAlign: 'center' }}>DURASI JP</TableCell>
                                        <TableCell sx={{ fontWeight: 800, width: 140, textAlign: 'center' }}>STATUS BENTROK</TableCell>
                                        <TableCell sx={{ fontWeight: 800, width: 80, textAlign: 'center' }}>AKSI</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {guruPiket.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3, color: '#94a3b8' }}>
                                                Belum ada guru piket yang ditambahkan. Klik "Tambah Piket" di atas.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        guruPiket.map((piket, idx) => {
                                            const piketConflicts = getPiketConflicts(piket);
                                            const hasConflict = piketConflicts.length > 0;
                                            const maxJp = piket.jumlahJp || 4;

                                            return (
                                                <TableRow
                                                    key={piket.id || idx}
                                                    sx={{
                                                        '&:hover': { bgcolor: hasConflict ? '#fef2f2' : '#f8fafc' },
                                                        bgcolor: hasConflict ? '#fff5f5' : 'inherit',
                                                    }}
                                                >
                                                    <TableCell sx={{ textAlign: 'center', fontWeight: 700 }}>
                                                        {idx + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={piket.hari}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 700,
                                                                fontSize: '11px',
                                                                bgcolor: '#f1f5f9',
                                                                color: '#334155',
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                            {piket.name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                                                            {piket.role || 'Guru Piket'} {piket.notes ? `• ${piket.notes}` : ''}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: 'center' }}>
                                                        <Chip
                                                            label={`${maxJp} JP`}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                            sx={{ fontWeight: 800 }}
                                                        />
                                                        <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontSize: '10px', mt: 0.25 }}>
                                                            Slot KBM 1-{maxJp}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: 'center' }}>
                                                        {hasConflict ? (
                                                            <Tooltip
                                                                title={
                                                                    <Box sx={{ p: 0.5 }}>
                                                                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                                                                            ⚠️ Bentrok Mengajar Saat Piket ({piketConflicts.length} Slot):
                                                                        </Typography>
                                                                        {piketConflicts.map((c, ci) => (
                                                                            <Typography key={ci} variant="caption" sx={{ display: 'block' }}>
                                                                                • {c.day} JP {c.jp} ({c.timeRange}): Kelas {c.conflictedClasses.join(', ')}
                                                                            </Typography>
                                                                        ))}
                                                                    </Box>
                                                                }
                                                            >
                                                                <Chip
                                                                    icon={<WarningAmberIcon sx={{ fontSize: '14px !important' }} />}
                                                                    label={`Bentrok (${piketConflicts.length})`}
                                                                    size="small"
                                                                    color="error"
                                                                    sx={{ fontWeight: 800, cursor: 'help' }}
                                                                />
                                                            </Tooltip>
                                                        ) : (
                                                            <Chip
                                                                icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                                                                label="Bebas Bentrok"
                                                                size="small"
                                                                color="success"
                                                                variant="outlined"
                                                                sx={{ fontWeight: 700 }}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: 'center' }}>
                                                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleOpenEditPiket(idx)}
                                                                title="Edit Guru Piket"
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDeletePiket(idx, piket.name)}
                                                                title="Hapus Guru Piket"
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>

                {/* 2. LEMBAR PENGESAHAN DOKUMEN (KHUSUS KEPALA SEKOLAH) */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: approvalData?.isApproved ? '2px solid #16a34a' : '1px solid #cbd5e1',
                            p: 2.5,
                            bgcolor: '#ffffff',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                        }}
                    >
                        {/* Header Pengesahan */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 2,
                                        bgcolor: approvalData?.isApproved ? '#dcfce7' : '#e0e7ff',
                                        color: approvalData?.isApproved ? '#15803d' : '#4338ca',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <VerifiedIcon fontSize="small" />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                        LEMBAR PENGESAHAN DOKUMEN
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                        Berlaku sah untuk kegiatan belajar mengajar semester berjalan
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Status Chip */}
                            {approvalData?.isApproved ? (
                                <Chip
                                    icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                                    label="Disahkan Kepala Sekolah"
                                    color="success"
                                    size="small"
                                    sx={{ fontWeight: 800 }}
                                />
                            ) : (
                                <Chip
                                    icon={<LockIcon sx={{ fontSize: '14px !important' }} />}
                                    label="Menunggu Pengesahan"
                                    size="small"
                                    sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 700 }}
                                />
                            )}
                        </Box>

                        {/* RBAC Notice jika BUKAN Kepala Sekolah */}
                        {!isKepalaSekolah && (
                            <Alert severity="warning" icon={<LockIcon fontSize="inherit" />} sx={{ mb: 2, borderRadius: 2 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                                    Akses Khusus Kepala Sekolah:
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block' }}>
                                    Fitur input link Google Drive dan tombol konfirmasi pengesahan jadwal ini hanya dapat digunakan oleh <strong>Kepala Sekolah</strong>.
                                </Typography>
                            </Alert>
                        )}

                        {/* Section Upload & Input Link Google Drive */}
                        <Box sx={{ mb: 2.5, p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', display: 'block', mb: 1 }}>
                                LINK DOKUMEN GOOGLE DRIVE (SURAT KEPUTUS / ROSTER JADWAL RESMI)
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="https://drive.google.com/file/d/... atau docs.google.com/..."
                                    value={driveUrlInput}
                                    onChange={(e) => setDriveUrlInput(e.target.value)}
                                    disabled={!isKepalaSekolah}
                                    slotProps={{
                                        input: {
                                            startAdornment: <LinkIcon sx={{ color: '#94a3b8', mr: 1, fontSize: 18 }} />,
                                        },
                                    }}
                                />

                                {driveParse.isValid && driveParse.originalUrl && (
                                    <IconButton
                                        size="small"
                                        onClick={() => window.open(driveParse.originalUrl, '_blank')}
                                        title="Buka Dokumen di Google Drive"
                                        color="primary"
                                    >
                                        <OpenInNewIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>

                            {/* Pratinjau Dokumen Google Drive Langsung (Deskripsi tidak perlu) */}
                            {driveParse.isValid ? (
                                <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                    <GoogleDrivePreview
                                        url={driveUrlInput || approvalData?.googleDriveUrl}
                                        height={340}
                                        title="Dokumen Pengesahan Resmi"
                                    />
                                </Box>
                            ) : (
                                (driveUrlInput || approvalData?.googleDriveUrl) ? (
                                    <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, bgcolor: '#fef2f2', border: '1px solid #fecaca' }}>
                                        <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>
                                            ⚠️ Format URL Google Drive belum valid atau belum dapat disematkan.
                                        </Typography>
                                    </Box>
                                ) : null
                            )}
                        </Box>

                        {/* Kotak Lembar Pengesahan Tanda Tangan Sesuai Format Resmi Sekolah */}
                        <Box
                            sx={{
                                p: 2.5,
                                borderRadius: 2.5,
                                border: approvalData?.isApproved ? '2px solid #86efac' : '1px dashed #cbd5e1',
                                bgcolor: approvalData?.isApproved ? '#f0fdf4' : '#fafafa',
                                textAlign: 'right',
                                position: 'relative',
                                mb: 2,
                            }}
                        >
                            {/* Stempel sah jika sudah disahkan */}
                            {approvalData?.isApproved && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: 20,
                                        top: 20,
                                        border: '2px solid #16a34a',
                                        color: '#16a34a',
                                        borderRadius: 2,
                                        px: 1.5,
                                        py: 0.5,
                                        fontWeight: 900,
                                        fontSize: '12px',
                                        letterSpacing: 1,
                                        textTransform: 'uppercase',
                                        transform: 'rotate(-8deg)',
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                    }}
                                >
                                    ✓ SAH & TERVERIFIKASI
                                </Box>
                            )}

                            <Typography variant="body2" sx={{ color: '#475569', mb: 0.5 }}>
                                Palembang, {approvalData?.approvedAt
                                    ? new Date(approvalData.approvedAt).toLocaleDateString('id-ID', {
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric',
                                      })
                                    : '10 Juli 2026'}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', mb: 6 }}>
                                Kepala Sekolah SMK Xaverius Palembang
                            </Typography>

                            <Box sx={{ display: 'inline-block', textAlign: 'center' }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 800, color: '#0f172a', textDecoration: 'underline' }}
                                >
                                    {headmasterName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                                    NIY. {headmasterNiy}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Tombol Konfirmasi Pengesahan (Khusus Kepala Sekolah) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
                            {isKepalaSekolah ? (
                                approvalData?.isApproved ? (
                                    <>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={handleRevokeApproval}
                                            disabled={isSubmitting}
                                            sx={{ textTransform: 'none', fontWeight: 700 }}
                                        >
                                            Batalkan Pengesahan
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={handleConfirmApproval}
                                            disabled={isSubmitting}
                                            startIcon={<CheckCircleIcon />}
                                            sx={{ textTransform: 'none', fontWeight: 800 }}
                                        >
                                            Perbarui Link & Pengesahan
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="medium"
                                        onClick={handleConfirmApproval}
                                        disabled={isSubmitting}
                                        startIcon={<CheckCircleIcon />}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 800,
                                            px: 3,
                                            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                                        }}
                                    >
                                        Konfirmasi & Sahkan Jadwal
                                    </Button>
                                )
                            ) : (
                                <Tooltip title="Hanya Kepala Sekolah yang memiliki wewenang untuk menandatangani dan mengesahkan jadwal ini">
                                    <span>
                                        <Button
                                            variant="contained"
                                            disabled
                                            startIcon={<LockIcon />}
                                            sx={{ textTransform: 'none', fontWeight: 700 }}
                                        >
                                            Konfirmasi Pengesahan (Terkunci)
                                        </Button>
                                    </span>
                                </Tooltip>
                            )}
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Dialog Form Tambah / Edit Guru Piket */}
            <GuruPiketFormDialog
                open={isPiketDialogOpen}
                onClose={() => setIsPiketDialogOpen(false)}
                editingIndex={editingIndex}
            />
        </>
    );
};

export default GuruPiketAndApprovalCard;
