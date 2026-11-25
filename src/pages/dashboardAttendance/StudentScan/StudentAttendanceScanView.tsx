import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Card,
    Stack,
    Typography,
    Button,
    Chip,
    Alert,
    CircularProgress,
    Paper,
    Divider,
} from '@mui/material';
import { Html5Qrcode } from 'html5-qrcode';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import ShieldIcon from '@mui/icons-material/Shield';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTheme } from '@mui/material/styles';
import { attendanceService } from '@api/attendance/service';
import useAuthStore from '../../../common/store/useAuthStore';

interface ScannedSessionData {
    app?: string;
    type?: string;
    id_school_information: string;
    id_class: string;
    class_name?: string;
    subject_name?: string;
    date: string;
    day: string;
    jp?: string;
    time_range?: string;
    teacher_name?: string;
    session_code?: string;
}

const STUDENT_QR_READER_ID = 'student-qr-code-reader';

export const StudentAttendanceScanView: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { user } = useAuthStore();

    // Steps: 1 = Scan QR Guru, 2 = Selfie DeepFace + Anti-Spoofing, 3 = Sukses/Hasil
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [scannedSession, setScannedSession] = useState<ScannedSessionData | null>(null);

    // QR scanner state
    const [isScanningQR, setIsScanningQR] = useState(false);
    const [qrScannerError, setQrScannerError] = useState<string | null>(null);
    const qrScannerRef = useRef<Html5Qrcode | null>(null);

    // Selfie camera state
    const faceVideoRef = useRef<HTMLVideoElement | null>(null);
    const [faceStream, setFaceStream] = useState<MediaStream | null>(null);
    const [faceSnapshot, setFaceSnapshot] = useState<string | null>(null);

    // Geolocation & submission state
    const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [successResult, setSuccessResult] = useState<any | null>(null);

    // Ambil GPS otomatis
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setGpsCoords({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    });
                },
                () => {},
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    }, []);

    // 1. Inisialisasi scanner QR Guru
    const startQRScanner = async () => {
        setQrScannerError(null);
        try {
            if (qrScannerRef.current) {
                try {
                    await qrScannerRef.current.stop();
                } catch {}
            }

            const scanner = new Html5Qrcode(STUDENT_QR_READER_ID);
            qrScannerRef.current = scanner;

            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    handleQRScannedSuccess(decodedText);
                },
                () => {}
            );
            setIsScanningQR(true);
        } catch (err: any) {
            setQrScannerError(
                err?.message || 'Gagal mengakses kamera belakang. Pastikan izin kamera telah diberikan.'
            );
            setIsScanningQR(false);
        }
    };

    const stopQRScanner = async () => {
        if (qrScannerRef.current) {
            try {
                if (qrScannerRef.current.isScanning) {
                    await qrScannerRef.current.stop();
                }
                qrScannerRef.current.clear();
            } catch {}
            qrScannerRef.current = null;
        }
        setIsScanningQR(false);
    };

    // Bersihkan scanner saat unmount
    useEffect(() => {
        return () => {
            if (qrScannerRef.current) {
                try {
                    if (qrScannerRef.current.isScanning) {
                        qrScannerRef.current.stop();
                    }
                } catch {}
            }
            if (faceStream) {
                faceStream.getTracks().forEach((t) => t.stop());
            }
        };
    }, [faceStream]);

    const handleQRScannedSuccess = async (decodedText: string) => {
        try {
            const data: ScannedSessionData = JSON.parse(decodedText);
            if (data.type !== 'PRESENSI_KBM' || !data.id_school_information || !data.id_class) {
                setQrScannerError('QR Code tidak valid. Pastikan Anda memindai QR Presensi Resmi dari Guru.');
                return;
            }

            await stopQRScanner();
            setScannedSession(data);
            setStep(2);
            startFaceCamera();
        } catch {
            setQrScannerError('Gagal membaca format QR Code. Silakan coba lagi.');
        }
    };

    // 2. Inisialisasi kamera depan untuk Verifikasi Wajah Anti-Spoofing
    const startFaceCamera = async () => {
        setSubmitError(null);
        setFaceSnapshot(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                },
            });
            setFaceStream(stream);
            if (faceVideoRef.current) {
                faceVideoRef.current.srcObject = stream;
            }
        } catch (err: any) {
            setSubmitError('Gagal mengakses kamera depan: ' + (err?.message || 'Izin ditolak'));
        }
    };

    const captureFaceSnapshot = () => {
        if (!faceVideoRef.current) return;
        const video = faceVideoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Cerminkan snapshot selfie agar sesuai tampilan pengguna
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const b64 = canvas.toDataURL('image/jpeg', 0.85);
        setFaceSnapshot(b64);
    };

    const retakeFace = () => {
        setFaceSnapshot(null);
        setSubmitError(null);
    };

    // 3. Submit Presensi dengan Verifikasi Wajah + Anti-Spoofing
    const handleSubmitAttendance = async () => {
        if (!scannedSession || !faceSnapshot) {
            setSubmitError('Foto wajah diperlukan untuk verifikasi presensi.');
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const payload = {
                id_school_information: scannedSession.id_school_information,
                id_class: scannedSession.id_class,
                subject_name: scannedSession.subject_name,
                date: scannedSession.date,
                day: scannedSession.day,
                jp: scannedSession.jp,
                time_range: scannedSession.time_range,
                teacher_name: scannedSession.teacher_name,
                barcode_value: user?.identifier || user?.email || '',
                face_image_base64: faceSnapshot,
                latitude: gpsCoords?.latitude,
                longitude: gpsCoords?.longitude,
            };

            const response = await attendanceService.scan(payload as any);
            setSuccessResult(response.data);
            setStep(3);

            // Matikan stream kamera
            if (faceStream) {
                faceStream.getTracks().forEach((t) => t.stop());
                setFaceStream(null);
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.detail ||
                err?.message ||
                'Gagal memverifikasi presensi. Silakan coba lagi.';
            setSubmitError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetAll = () => {
        setStep(1);
        setScannedSession(null);
        setFaceSnapshot(null);
        setSubmitError(null);
        setSuccessResult(null);
    };

    return (
        <Box sx={{ maxWidth: 720, mx: 'auto', p: { xs: 2, sm: 3 } }}>
            {/* Header Informasi */}
            <Card
                variant="outlined"
                sx={{
                    p: { xs: 2.5, sm: 3 },
                    mb: 3,
                    borderRadius: 3,
                    bgcolor: isDark ? '#18181b' : '#ffffff',
                    borderColor: isDark ? '#27272a' : '#e2e8f0',
                }}
            >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2.5,
                            bgcolor: '#2563eb',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <FaceRetouchingNaturalIcon />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                            Presensi Mandiri Siswa
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                            Pindai Barcode Guru di kelas & verifikasi wajah asli dengan teknologi <b>Anti-Spoofing</b>.
                        </Typography>
                    </Box>
                </Stack>

                {/* Indikator Langkah */}
                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                        icon={<QrCodeScannerIcon sx={{ fontSize: '15px !important' }} />}
                        label="1. Scan Barcode Guru"
                        color={step === 1 ? 'primary' : 'default'}
                        variant={step === 1 ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 800 }}
                    />
                    <Chip
                        icon={<FaceRetouchingNaturalIcon sx={{ fontSize: '15px !important' }} />}
                        label="2. Verifikasi Wajah Asli"
                        color={step === 2 ? 'primary' : 'default'}
                        variant={step === 2 ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 800 }}
                    />
                    <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: '15px !important' }} />}
                        label="3. Presensi Tercatat"
                        color={step === 3 ? 'success' : 'default'}
                        variant={step === 3 ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 800 }}
                    />
                </Stack>
            </Card>

            {/* LANGKAH 1: SCAN BARCODE GURU */}
            {step === 1 && (
                <Card
                    variant="outlined"
                    sx={{
                        p: { xs: 2.5, sm: 3.5 },
                        borderRadius: 3,
                        textAlign: 'center',
                        bgcolor: isDark ? '#18181b' : '#ffffff',
                        borderColor: isDark ? '#27272a' : '#e2e8f0',
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
                        Langkah 1: Arahkan Kamera ke Barcode Guru
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#a1a1aa' : '#64748b', mb: 2.5, fontSize: '13px' }}>
                        Guru Anda sedang menampilkan Barcode Presensi di layar proyektor / laptop di depan kelas.
                    </Typography>

                    {qrScannerError && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2, textAlign: 'left' }}>
                            {qrScannerError}
                        </Alert>
                    )}

                    <Box
                        id={STUDENT_QR_READER_ID}
                        sx={{
                            width: '100%',
                            minHeight: isScanningQR ? 280 : 0,
                            mb: 2,
                            borderRadius: 2.5,
                            overflow: 'hidden',
                            bgcolor: '#000000',
                            display: isScanningQR ? 'block' : 'none',
                        }}
                    />

                    {!isScanningQR ? (
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<QrCodeScannerIcon />}
                            onClick={startQRScanner}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 800,
                                borderRadius: 2.5,
                                px: 4,
                                py: 1.5,
                                bgcolor: '#2563eb',
                                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                            }}
                        >
                            Buka Kamera Pemindai Barcode
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={stopQRScanner}
                            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                        >
                            Tutup Kamera Barcode
                        </Button>
                    )}
                </Card>
            )}

            {/* LANGKAH 2: VERIFIKASI WAJAH ASLI (DEEPFACE + ANTI-SPOOFING) */}
            {step === 2 && scannedSession && (
                <Card
                    variant="outlined"
                    sx={{
                        p: { xs: 2.5, sm: 3.5 },
                        borderRadius: 3,
                        bgcolor: isDark ? '#18181b' : '#ffffff',
                        borderColor: isDark ? '#27272a' : '#e2e8f0',
                    }}
                >
                    {/* Ringkasan Sesi yang Terpindai */}
                    <Box
                        sx={{
                            p: 2,
                            mb: 2.5,
                            borderRadius: 2.5,
                            bgcolor: isDark ? '#27272a' : '#f0fdf4',
                            border: isDark ? '1px solid #3f3f46' : '1px solid #bbf7d0',
                        }}
                    >
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                            <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDark ? '#86efac' : '#166534' }}>
                                Barcode Sesi Berhasil Terdeteksi
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                            <Chip
                                icon={<SchoolIcon sx={{ fontSize: '14px !important' }} />}
                                label={`Kelas: ${scannedSession.class_name || '-'}`}
                                size="small"
                                sx={{ fontWeight: 800 }}
                            />
                            <Chip
                                icon={<MenuBookIcon sx={{ fontSize: '14px !important' }} />}
                                label={scannedSession.subject_name || '-'}
                                size="small"
                                color="primary"
                                sx={{ fontWeight: 800 }}
                            />
                            <Chip
                                icon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
                                label={`${scannedSession.jp || ''} (${scannedSession.time_range || ''})`}
                                size="small"
                                sx={{ fontWeight: 700 }}
                            />
                        </Stack>
                    </Box>

                    {/* Instruksi Anti-Spoofing */}
                    <Alert
                        severity="info"
                        icon={<ShieldIcon />}
                        sx={{ mb: 2.5, borderRadius: 2 }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                            Anti-Spoofing Aktif
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                            Posisikan wajah Anda secara langsung menghadap kamera. Dilarang menggunakan foto kertas, layar smartphone lain, atau manipulasi gambar.
                        </Typography>
                    </Alert>

                    {submitError && (
                        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                Verifikasi Gagal
                            </Typography>
                            <Typography variant="caption">{submitError}</Typography>
                        </Alert>
                    )}

                    {/* Viewfinder Kamera Wajah dengan Bingkai Oval */}
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: 380,
                            height: 380,
                            mx: 'auto',
                            mb: 2.5,
                            borderRadius: 3,
                            overflow: 'hidden',
                            bgcolor: '#09090b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        }}
                    >
                        {faceSnapshot ? (
                            <img
                                src={faceSnapshot}
                                alt="Selfie Wajah Siswa"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <>
                                <video
                                    ref={faceVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transform: 'scaleX(-1)',
                                    }}
                                />
                                {/* Bingkai Oval Panduan Wajah */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        width: 220,
                                        height: 290,
                                        borderRadius: '50%',
                                        border: '3px dashed #3b82f6',
                                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                                        pointerEvents: 'none',
                                    }}
                                />
                            </>
                        )}
                    </Box>

                    {/* Tombol Aksi Snapshot & Verifikasi */}
                    <Stack spacing={1.5} sx={{ maxWidth: 380, mx: 'auto' }}>
                        {!faceSnapshot ? (
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<CameraAltIcon />}
                                onClick={captureFaceSnapshot}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 800,
                                    borderRadius: 2.5,
                                    py: 1.25,
                                    bgcolor: '#2563eb',
                                }}
                            >
                                Ambil Foto Wajah
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    disabled={isSubmitting}
                                    startIcon={
                                        isSubmitting ? (
                                            <CircularProgress size={18} color="inherit" />
                                        ) : (
                                            <CheckCircleIcon />
                                        )
                                    }
                                    onClick={handleSubmitAttendance}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 800,
                                        borderRadius: 2.5,
                                        py: 1.25,
                                        bgcolor: '#16a34a',
                                        '&:hover': { bgcolor: '#15803d' },
                                    }}
                                >
                                    {isSubmitting
                                        ? 'Memverifikasi Wajah (Anti-Spoofing)...'
                                        : 'Verifikasi Wajah & Catat Hadir'}
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    disabled={isSubmitting}
                                    startIcon={<ReplayIcon />}
                                    onClick={retakeFace}
                                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2.5 }}
                                >
                                    Ambil Ulang Foto Wajah
                                </Button>
                            </>
                        )}

                        <Button
                            variant="text"
                            color="inherit"
                            onClick={handleResetAll}
                            disabled={isSubmitting}
                            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '12px' }}
                        >
                            Batal & Scan Ulang Barcode Guru
                        </Button>
                    </Stack>
                </Card>
            )}

            {/* LANGKAH 3: SUKSES / TERVERIFIKASI HADIR */}
            {step === 3 && successResult && (
                <Card
                    variant="outlined"
                    sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: 3,
                        textAlign: 'center',
                        bgcolor: isDark ? '#18181b' : '#ffffff',
                        borderColor: isDark ? '#16a34a' : '#bbf7d0',
                    }}
                >
                    <Box
                        sx={{
                            width: 68,
                            height: 68,
                            borderRadius: '50%',
                            bgcolor: isDark ? 'rgba(22, 101, 52, 0.2)' : '#dcfce7',
                            color: '#16a34a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                        }}
                    >
                        <CheckCircleIcon sx={{ fontSize: 44 }} />
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#16a34a', mb: 0.5 }}>
                        Presensi Berhasil Dicatat: HADIR
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#a1a1aa' : '#64748b', mb: 3 }}>
                        Kehadiran Anda telah berhasil diverifikasi secara sah menggunakan DeepFace & Anti-Spoofing.
                    </Typography>

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2.5,
                            borderRadius: 2.5,
                            textAlign: 'left',
                            bgcolor: isDark ? '#27272a' : '#f8fafc',
                            borderColor: isDark ? '#3f3f46' : '#e2e8f0',
                            maxWidth: 420,
                            mx: 'auto',
                            mb: 3,
                        }}
                    >
                        <Stack spacing={1.25}>
                            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                                <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 700 }}>
                                    Nama Siswa:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                    {successResult.name}
                                </Typography>
                            </Stack>
                            <Divider />
                            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                                <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 700 }}>
                                    NIS:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                    {successResult.nis || '-'}
                                </Typography>
                            </Stack>
                            <Divider />
                            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                                <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 700 }}>
                                    Anti-Spoofing:
                                </Typography>
                                <Chip
                                    label="ASLI (Lolos Verifikasi)"
                                    color="success"
                                    size="small"
                                    sx={{ fontWeight: 800, fontSize: '11px' }}
                                />
                            </Stack>
                            <Divider />
                            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                                <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 700 }}>
                                    Catatan:
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? '#d4d4d8' : '#334155' }}>
                                    {successResult.notes}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Paper>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleResetAll}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 800,
                            borderRadius: 2,
                            px: 3.5,
                            py: 1,
                            bgcolor: '#2563eb',
                        }}
                    >
                        Selesai / Scan Sesi Lain
                    </Button>
                </Card>
            )}
        </Box>
    );
};

export default StudentAttendanceScanView;
