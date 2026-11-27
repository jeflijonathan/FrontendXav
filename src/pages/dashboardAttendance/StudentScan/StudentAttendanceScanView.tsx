import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
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
    session_token?: string;
}

interface StudentAttendanceScanViewProps {
    onScanSuccess?: () => void;
    onClose?: () => void;
}

// ─── Native QR Scanner hook using getUserMedia + jsQR ───────────────────────
// jsQR is loaded dynamically to keep bundle lean for non-student roles
let jsQRModule: any = null;
const loadJsQR = async () => {
    if (!jsQRModule) {
        jsQRModule = (await import('jsqr')).default;
    }
    return jsQRModule;
};

export const StudentAttendanceScanView: React.FC<StudentAttendanceScanViewProps> = ({
    onScanSuccess,
    onClose,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { user } = useAuthStore();

    // Steps: 1 = Scan QR Guru, 2 = Selfie DeepFace + Anti-Spoofing, 3 = Sukses/Hasil
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [scannedSession, setScannedSession] = useState<ScannedSessionData | null>(null);

    // ── QR scan state (native getUserMedia) ──
    const qrVideoRef = useRef<HTMLVideoElement | null>(null);
    const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const qrStreamRef = useRef<MediaStream | null>(null);
    const qrRafRef = useRef<number | null>(null);
    const isProcessingQRRef = useRef(false);
    const qrFileInputRef = useRef<HTMLInputElement | null>(null);

    const [isScanningQR, setIsScanningQR] = useState(false);
    const [isStartingQR, setIsStartingQR] = useState(false);
    const [qrScannerError, setQrScannerError] = useState<string | null>(null);
    const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCameraId, setSelectedCameraId] = useState<string>('');

    // ── Face camera state ──
    const faceVideoRef = useRef<HTMLVideoElement | null>(null);
    const faceStreamRef = useRef<MediaStream | null>(null);
    const [faceReady, setFaceReady] = useState(false);
    const [faceSnapshot, setFaceSnapshot] = useState<string | null>(null);

    // ── Submission state ──
    const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [successResult, setSuccessResult] = useState<any | null>(null);

    // ── GPS ──
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setGpsCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                () => {},
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    }, []);

    // ── Enumerate cameras ──
    useEffect(() => {
        if (!navigator?.mediaDevices?.enumerateDevices) return;
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const cams = devices.filter((d) => d.kind === 'videoinput');
            setAvailableCameras(cams);
        }).catch(() => {});
    }, []);

    // ── QR frame decode loop ──
    const qrScanLoop = useCallback(async () => {
        const video = qrVideoRef.current;
        const canvas = qrCanvasRef.current;
        if (!video || !canvas || isProcessingQRRef.current) {
            qrRafRef.current = requestAnimationFrame(qrScanLoop);
            return;
        }
        if (video.readyState < video.HAVE_ENOUGH_DATA) {
            qrRafRef.current = requestAnimationFrame(qrScanLoop);
            return;
        }

        const { videoWidth: vw, videoHeight: vh } = video;
        if (!vw || !vh) {
            qrRafRef.current = requestAnimationFrame(qrScanLoop);
            return;
        }

        canvas.width = vw;
        canvas.height = vh;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
            qrRafRef.current = requestAnimationFrame(qrScanLoop);
            return;
        }
        ctx.drawImage(video, 0, 0, vw, vh);
        const imageData = ctx.getImageData(0, 0, vw, vh);

        try {
            const jsQR = await loadJsQR();
            const code = jsQR(imageData.data, vw, vh, { inversionAttempts: 'dontInvert' });
            if (code && code.data) {
                isProcessingQRRef.current = true;
                handleQRDecoded(code.data);
                return; // stop loop on success
            }
        } catch {/* ignore decode errors */}

        qrRafRef.current = requestAnimationFrame(qrScanLoop);
    }, []); // eslint-disable-line

    const stopQRStream = useCallback(() => {
        if (qrRafRef.current !== null) {
            cancelAnimationFrame(qrRafRef.current);
            qrRafRef.current = null;
        }
        if (qrStreamRef.current) {
            qrStreamRef.current.getTracks().forEach((t) => t.stop());
            qrStreamRef.current = null;
        }
        if (qrVideoRef.current) {
            qrVideoRef.current.srcObject = null;
        }
        setIsScanningQR(false);
    }, []);

    const startQRScanner = async (overrideCameraId?: string) => {
        setQrScannerError(null);
        setIsStartingQR(true);
        isProcessingQRRef.current = false;

        // Stop old stream first
        stopQRStream();

        if (!navigator?.mediaDevices?.getUserMedia) {
            setQrScannerError('Akses kamera membutuhkan koneksi HTTPS. Silakan buka melalui https://192.168.1.10:8443 (atau localhost).');
            setIsStartingQR(false);
            return;
        }

        try {
            // Determine camera constraint
            let videoConstraint: MediaStreamConstraints['video'];
            const camId = overrideCameraId || selectedCameraId;
            if (camId) {
                videoConstraint = { deviceId: { exact: camId }, width: { ideal: 1280 }, height: { ideal: 720 } };
            } else {
                // prefer back camera on mobile
                videoConstraint = { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } };
            }

            const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraint, audio: false });
            qrStreamRef.current = stream;

            // Re-enumerate to get labels (requires permission)
            const devices = navigator.mediaDevices.enumerateDevices
                ? await navigator.mediaDevices.enumerateDevices().catch(() => [])
                : [];
            const cams = devices.filter((d) => d.kind === 'videoinput');
            if (cams.length > 0) setAvailableCameras(cams);

            // Identify which camera is active
            const activeTrack = stream.getVideoTracks()[0];
            const activeDeviceId = activeTrack?.getSettings()?.deviceId;
            if (activeDeviceId) setSelectedCameraId(activeDeviceId);

            setIsScanningQR(true);

            // Wait for DOM paint before assigning srcObject
            await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

            if (qrVideoRef.current) {
                qrVideoRef.current.srcObject = stream;
                await qrVideoRef.current.play();
            }

            // Load jsQR in background while camera warms up
            loadJsQR().catch(() => {});

            // Start decode loop
            qrRafRef.current = requestAnimationFrame(qrScanLoop);
        } catch (err: any) {
            const msg = err?.name === 'NotAllowedError'
                ? 'Izin kamera ditolak. Aktifkan izin kamera di pengaturan browser Anda.'
                : err?.name === 'NotFoundError'
                    ? 'Tidak ada kamera yang ditemukan pada perangkat ini.'
                    : err?.message || 'Gagal membuka kamera. Pastikan tidak digunakan aplikasi lain.';
            setQrScannerError(msg);
            setIsScanningQR(false);
        } finally {
            setIsStartingQR(false);
        }
    };

    const handleQRDecoded = (decodedText: string) => {
        // Stop scan loop immediately
        if (qrRafRef.current !== null) {
            cancelAnimationFrame(qrRafRef.current);
            qrRafRef.current = null;
        }
        stopQRStream();

        try {
            const data: ScannedSessionData = JSON.parse(decodedText);
            if (data.type !== 'PRESENSI_KBM' || !data.id_school_information || !data.id_class) {
                setQrScannerError('QR Code tidak valid. Pastikan Anda memindai QR Presensi Resmi dari Guru.');
                isProcessingQRRef.current = false;
                return;
            }
            setScannedSession(data);
            setStep(2);
            startFaceCamera();
        } catch {
            setQrScannerError('Gagal membaca format QR Code. Silakan coba lagi.');
            isProcessingQRRef.current = false;
        }
    };

    const handleScanQRFromFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        setQrScannerError(null);
        try {
            const jsQR = await loadJsQR();
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.src = url;
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('Gagal memuat gambar'));
            });
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const code = jsQR(imageData.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
            if (code?.data) {
                handleQRDecoded(code.data);
            } else {
                setQrScannerError('QR Code tidak terdeteksi pada gambar tersebut. Pastikan gambar QR jelas dan tidak terpotong.');
            }
        } catch (err: any) {
            setQrScannerError(err?.message || 'Gagal membaca gambar.');
        }
    };

    // ── Stop all streams on unmount ──
    useEffect(() => {
        return () => {
            stopQRStream();
            if (faceStreamRef.current) {
                faceStreamRef.current.getTracks().forEach((t) => t.stop());
            }
        };
    }, [stopQRStream]);

    // ── Face camera ──
    const attachFaceStream = useCallback((stream: MediaStream) => {
        const video = faceVideoRef.current;
        if (!video) return;
        if (video.srcObject !== stream) {
            video.srcObject = stream;
        }
        const markReady = () => {
            video.play().catch(() => {});
            setFaceReady(true);
        };
        if (video.readyState >= 1 || video.videoWidth > 0) {
            markReady();
            return;
        }
        video.onloadedmetadata = markReady;
        video.onloadeddata = markReady;
        video.oncanplay = markReady;
        video.play().then(() => {
            if (video.readyState >= 1 || video.videoWidth > 0) {
                setFaceReady(true);
            }
        }).catch(() => {});
    }, []);

    const startFaceCamera = async (overrideCameraId?: string) => {
        setSubmitError(null);
        setFaceSnapshot(null);
        setFaceReady(false);

        if (faceStreamRef.current) {
            faceStreamRef.current.getTracks().forEach((t) => t.stop());
            faceStreamRef.current = null;
        }
        if (faceVideoRef.current) {
            faceVideoRef.current.srcObject = null;
        }

        if (!navigator?.mediaDevices?.getUserMedia) {
            setSubmitError('Akses kamera depan membutuhkan koneksi HTTPS. Silakan buka melalui https://192.168.1.10:8443 (atau localhost).');
            return;
        }

        // Pastikan QR stream benar-benar berhenti dan beri jeda agar driver webcam melepas perangkat
        stopQRStream();
        await new Promise<void>((r) => setTimeout(r, 450));

        const tryAcquireStream = async (): Promise<MediaStream | null> => {
            const devices = navigator.mediaDevices.enumerateDevices
                ? await navigator.mediaDevices.enumerateDevices().catch(() => [])
                : [];
            const videoInputs = devices.filter((d) => d.kind === 'videoinput');
            if (videoInputs.length > 0) setAvailableCameras(videoInputs);

            const attempts: MediaStreamConstraints[] = [];
            if (overrideCameraId) {
                attempts.push({ video: { deviceId: { exact: overrideCameraId } }, audio: false });
            } else {
                attempts.push({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
                if (selectedCameraId) {
                    attempts.push({ video: { deviceId: { exact: selectedCameraId } }, audio: false });
                }
                attempts.push({ video: true, audio: false });
                // Coba semua kamera yang tersedia satu per satu (lewati kamera virtual/rusak yang gagal dibuka)
                const ordered = [...videoInputs].sort((a, b) => {
                    const score = (label: string) =>
                        /obs|virtual|snap|manycam|droidcam/i.test(label) ? 2 :
                        /front|user|integrated|webcam|hd|usb/i.test(label) ? 0 : 1;
                    return score(a.label || '') - score(b.label || '');
                });
                for (const cam of ordered) {
                    if (cam.deviceId && cam.deviceId !== selectedCameraId) {
                        attempts.push({ video: { deviceId: { exact: cam.deviceId } }, audio: false });
                    }
                }
            }

            let lastErr: any = null;
            for (const constraint of attempts) {
                try {
                    return await navigator.mediaDevices.getUserMedia(constraint);
                } catch (e: any) {
                    lastErr = e;
                }
            }
            if (lastErr) throw lastErr;
            return null;
        };

        try {
            let stream: MediaStream | null = null;
            try {
                stream = await tryAcquireStream();
            } catch (firstErr: any) {
                // Retry sekali lagi setelah jeda 650ms jika driver webcam Windows masih sibuk
                await new Promise<void>((r) => setTimeout(r, 650));
                stream = await tryAcquireStream();
                if (!stream) throw firstErr;
            }

            if (!stream) {
                throw new Error('Kamera tidak tersedia.');
            }

            faceStreamRef.current = stream;
            // Wait for DOM paint so faceVideoRef.current is mounted (step=2)
            await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
            attachFaceStream(stream);
        } catch (err: any) {
            const detail = err?.message || 'Izin ditolak';
            setSubmitError(
                /not found|Requested device|Could not start video source|NotReadableError/i.test(detail)
                    ? 'Kamera sedang digunakan aplikasi lain atau masih terkunci oleh sistem. Tutup aplikasi kamera lain / tab lain yang memakai kamera, lalu klik "Muat Ulang Kamera Depan".'
                    : `Gagal mengakses kamera depan: ${detail}`
            );
        }
    };

    // Attach stream when faceVideoRef becomes available (step transition or retake)
    useEffect(() => {
        if (step === 2 && faceVideoRef.current && faceStreamRef.current && !faceSnapshot) {
            attachFaceStream(faceStreamRef.current);
        }
    }, [step, faceSnapshot, attachFaceStream]);

    const captureCurrentFrame = (): string | null => {
        const video = faceVideoRef.current;
        if (!video) return null;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d')!;
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.95);
    };

    const captureFaceSnapshot = () => {
        const frame = captureCurrentFrame();
        if (!frame) return;
        setFaceSnapshot(frame);
    };

    const retakeFace = () => {
        setFaceSnapshot(null);
        setSubmitError(null);
    };

    // ── Submit attendance ──
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
                jp: scannedSession.jp !== undefined && scannedSession.jp !== null ? String(scannedSession.jp) : undefined,
                time_range: scannedSession.time_range,
                teacher_name: scannedSession.teacher_name,
                barcode_value: user?.identifier || user?.username || '',
                session_token: scannedSession.session_token,
                face_image_base64: faceSnapshot,
                latitude: gpsCoords?.latitude,
                longitude: gpsCoords?.longitude,
            };
            const response = await attendanceService.scan(payload as any);
            setSuccessResult(response.data);
            setStep(3);
            onScanSuccess?.();
            if (faceStreamRef.current) {
                faceStreamRef.current.getTracks().forEach((t) => t.stop());
                faceStreamRef.current = null;
            }
        } catch (err: any) {
            const rawDetail = err?.response?.data?.detail ?? err?.details ?? err?.message;
            let msg = 'Gagal memverifikasi presensi. Silakan coba lagi.';
            if (typeof rawDetail === 'string' && rawDetail.trim()) {
                msg = rawDetail;
            } else if (Array.isArray(rawDetail) && rawDetail.length > 0) {
                msg = rawDetail
                    .map((item: any) =>
                        typeof item === 'string' ? item : item?.message || item?.msg || JSON.stringify(item)
                    )
                    .join('; ');
            } else if (rawDetail && typeof rawDetail === 'object') {
                msg = rawDetail.message || rawDetail.msg || JSON.stringify(rawDetail);
            }
            setSubmitError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetAll = () => {
        stopQRStream();
        if (faceStreamRef.current) {
            faceStreamRef.current.getTracks().forEach((t) => t.stop());
            faceStreamRef.current = null;
        }
        setStep(1);
        setScannedSession(null);
        setFaceSnapshot(null);
        setFaceReady(false);
        setSubmitError(null);
        setSuccessResult(null);
        isProcessingQRRef.current = false;
    };

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <Box sx={{ maxWidth: 720, mx: 'auto', p: { xs: 0, sm: 2 } }}>
            {/* Header Informasi */}
            <Card
                variant="outlined"
                sx={{
                    p: { xs: 1.5, sm: 2.5 },
                    mb: { xs: 1.5, sm: 2.5 },
                    borderRadius: { xs: 2, sm: 3 },
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
                            Pindai Barcode Guru di kelas &amp; verifikasi wajah asli dengan teknologi <b>Anti-Spoofing</b>.
                        </Typography>
                    </Box>
                </Stack>

                {/* Step indicators */}
                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                        icon={<QrCodeScannerIcon sx={{ fontSize: '15px !important' }} />}
                        label="1. Scan Barcode Guru"
                        color={step === 1 ? 'primary' : step > 1 ? 'success' : 'default'}
                        variant={step === 1 ? 'filled' : step > 1 ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 800 }}
                    />
                    <Chip
                        icon={<FaceRetouchingNaturalIcon sx={{ fontSize: '15px !important' }} />}
                        label="2. Verifikasi Wajah Asli"
                        color={step === 2 ? 'primary' : step > 2 ? 'success' : 'default'}
                        variant={step === 2 ? 'filled' : step > 2 ? 'filled' : 'outlined'}
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

            {/* ═══ LANGKAH 1: SCAN QR ═══ */}
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

                    {/* Camera selector */}
                    {isScanningQR && availableCameras.length > 1 && (
                        <FormControl size="small" sx={{ mb: 2, minWidth: 220 }}>
                            <InputLabel>Pilih Kamera</InputLabel>
                            <Select
                                value={selectedCameraId}
                                label="Pilih Kamera"
                                onChange={(e) => {
                                    setSelectedCameraId(e.target.value);
                                    startQRScanner(e.target.value);
                                }}
                            >
                                {availableCameras.map((cam, idx) => (
                                    <MenuItem key={cam.deviceId} value={cam.deviceId}>
                                        {cam.label || `Kamera ${idx + 1}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    {/* Video viewfinder */}
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: { xs: '3/4', sm: '16/9' },
                            mb: 2,
                            borderRadius: 2.5,
                            overflow: 'hidden',
                            bgcolor: '#09090b',
                            display: isScanningQR ? 'block' : 'none',
                        }}
                    >
                        {isStartingQR && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    zIndex: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1,
                                    bgcolor: 'rgba(9,9,11,0.85)',
                                    color: '#ffffff',
                                }}
                            >
                                <CircularProgress size={32} color="inherit" />
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                    Membuka kamera...
                                </Typography>
                            </Box>
                        )}

                        {/* Hidden canvas for jsQR decoding */}
                        <canvas ref={qrCanvasRef} style={{ display: 'none' }} />

                        {/* Actual video element */}
                        <video
                            ref={qrVideoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                            }}
                        />

                        {/* QR scan overlay guide */}
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pointerEvents: 'none',
                            }}
                        >
                            <Box
                                sx={{
                                    width: '55%',
                                    aspectRatio: '1',
                                    border: '3px solid rgba(59,130,246,0.85)',
                                    borderRadius: 2,
                                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)',
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Hidden file input for image upload */}
                    <input
                        ref={qrFileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleScanQRFromFile}
                    />

                    {!isScanningQR ? (
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={isStartingQR ? <CircularProgress size={18} color="inherit" /> : <QrCodeScannerIcon />}
                                disabled={isStartingQR}
                                onClick={() => startQRScanner()}
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
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="large"
                                onClick={() => qrFileInputRef.current?.click()}
                                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2.5, px: 3, py: 1.5 }}
                            >
                                Upload Gambar QR
                            </Button>
                        </Stack>
                    ) : (
                        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={stopQRStream}
                                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                            >
                                Tutup Kamera Barcode
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => qrFileInputRef.current?.click()}
                                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                            >
                                Upload Gambar QR
                            </Button>
                        </Stack>
                    )}
                </Card>
            )}

            {/* ═══ LANGKAH 2: VERIFIKASI WAJAH ═══ */}
            {step === 2 && scannedSession && (
                <Card
                    variant="outlined"
                    sx={{
                        p: { xs: 1.5, sm: 3 },
                        borderRadius: { xs: 2, sm: 3 },
                        bgcolor: isDark ? '#18181b' : '#ffffff',
                        borderColor: isDark ? '#27272a' : '#e2e8f0',
                    }}
                >
                    {/* Ringkasan sesi terpindai */}
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

                    {/* Anti-Spoofing info */}
                    <Alert severity="info" icon={<ShieldIcon />} sx={{ mb: 2.5, borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>Anti-Spoofing Aktif</Typography>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                            Posisikan wajah Anda pada jarak ±40–50 cm agar pas di dalam oval dan area sekitar terlihat.
                            Dilarang menggunakan foto kertas, layar smartphone lain, atau manipulasi gambar.
                        </Typography>
                    </Alert>

                    {submitError && (
                        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>Verifikasi Gagal</Typography>
                            <Typography variant="caption">{submitError}</Typography>
                        </Alert>
                    )}

                    {/* Face viewfinder */}
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: { xs: '100%', sm: 480 },
                            aspectRatio: { xs: '3 / 4', sm: '4 / 3' },
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
                                {!faceReady && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            zIndex: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                            bgcolor: 'rgba(9,9,11,0.85)',
                                            color: '#ffffff',
                                        }}
                                    >
                                        <CircularProgress size={32} color="inherit" />
                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                            Membuka kamera depan...
                                        </Typography>
                                    </Box>
                                )}
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
                                {/* Oval face guide (proporsional jarak ±40-50 cm) */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        width: { xs: 185, sm: 155 },
                                        height: { xs: 245, sm: 205 },
                                        borderRadius: '50%',
                                        border: '3px dashed #3b82f6',
                                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                                        pointerEvents: 'none',
                                    }}
                                />
                            </>
                        )}
                    </Box>

                    {/* Action buttons */}
                    <Stack spacing={1.5} sx={{ maxWidth: 380, mx: 'auto' }}>
                        {!faceSnapshot ? (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<CameraAltIcon />}
                                    disabled={!faceReady}
                                    onClick={captureFaceSnapshot}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 800,
                                        borderRadius: 2.5,
                                        py: 1.25,
                                        bgcolor: '#2563eb',
                                    }}
                                >
                                    {faceReady ? 'Ambil Foto Wajah' : 'Menyiapkan Kamera...'}
                                </Button>
                                {!faceReady && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<ReplayIcon />}
                                        onClick={() => startFaceCamera()}
                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2.5 }}
                                    >
                                        Muat Ulang Kamera Depan
                                    </Button>
                                )}
                            </>
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

            {/* ═══ LANGKAH 3: SUKSES ═══ */}
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
                        Kehadiran Anda telah berhasil diverifikasi secara sah menggunakan DeepFace &amp; Anti-Spoofing.
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
                                    {successResult.notes || '-'}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Paper>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center' }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleResetAll}
                            sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 2, px: 3, py: 1 }}
                        >
                            Scan Sesi Lain
                        </Button>
                        {onClose && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onClose}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 800,
                                    borderRadius: 2,
                                    px: 3.5,
                                    py: 1,
                                    bgcolor: '#2563eb',
                                }}
                            >
                                Selesai &amp; Lihat Rekap
                            </Button>
                        )}
                    </Stack>
                </Card>
            )}
        </Box>
    );
};

export default StudentAttendanceScanView;
