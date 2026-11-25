import React from 'react';
import {
    Box,
    Stack,
    Typography,
    Button,
    TextField,
    Chip,
    Alert,
    CircularProgress,
    Grid,
} from '@mui/material';
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from '@components/Dialog';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useTheme } from '@mui/material/styles';
import useScanAttendance from './hook/useScanAttendance';

interface ScanAttendanceDialogProps {
    onScanSuccessRefresh: () => Promise<void>;
}

const BARCODE_READER_ID = 'attendance-barcode-reader';

export const ScanAttendanceDialog: React.FC<ScanAttendanceDialogProps> = ({
    onScanSuccessRefresh,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const {
        isOpen,
        settings,
        barcodeValue,
        setBarcodeValue,
        isScanningCamera,
        isSubmitting,
        faceSnapshot,
        setFaceSnapshot,
        faceVideoRef,
        gpsCoords,
        gpsError,
        isFetchingGps,
        lastScanResult,
        startBarcodeScanner,
        stopBarcodeScanner,
        captureFace,
        refreshGps,
        handleSubmitScan,
        handleCloseDialog,
    } = useScanAttendance(onScanSuccessRefresh);

    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={handleCloseDialog}
            maxWidth="md"
        >
            <DialogHeader
                title="Scan Barcode Presensi Siswa"
                description="Scan kartu/barcode siswa dengan opsi verifikasi wajah (DeepFace) & lokasi GPS."
                onClose={handleCloseDialog}
            />

            <DialogBody>
                {/* Active Verification Status Chips */}
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip
                        icon={<QrCodeScannerIcon sx={{ fontSize: '16px !important' }} />}
                        label="Barcode / QR: Aktif"
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 700 }}
                    />
                    <Chip
                        icon={<FaceRetouchingNaturalIcon sx={{ fontSize: '16px !important' }} />}
                        label={`DeepFace Wajah: ${settings.use_face_verification ? 'Aktif' : 'Nonaktif'}`}
                        size="small"
                        color={settings.use_face_verification ? 'success' : 'default'}
                        variant={settings.use_face_verification ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 700 }}
                    />
                    <Chip
                        icon={<LocationOnIcon sx={{ fontSize: '16px !important' }} />}
                        label={`Geolocation GPS: ${settings.use_geolocation ? 'Aktif' : 'Nonaktif'}`}
                        size="small"
                        color={settings.use_geolocation ? 'info' : 'default'}
                        variant={settings.use_geolocation ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 700 }}
                    />
                </Stack>

                {/* Geolocation Status Banner (if enabled) */}
                {settings.use_geolocation && (
                    <Alert
                        severity={gpsCoords ? 'info' : gpsError ? 'error' : 'warning'}
                        sx={{ mb: 2, borderRadius: 2 }}
                        action={
                            <Button
                                size="small"
                                color="inherit"
                                startIcon={isFetchingGps ? <CircularProgress size={14} /> : <MyLocationIcon />}
                                onClick={refreshGps}
                                disabled={isFetchingGps}
                                sx={{ textTransform: 'none', fontWeight: 700 }}
                            >
                                Perbarui GPS
                            </Button>
                        }
                    >
                        {gpsCoords
                            ? `Lokasi GPS terdeteksi: ${gpsCoords.latitude.toFixed(5)}, ${gpsCoords.longitude.toFixed(5)} (±${Math.round(gpsCoords.accuracy)}m)`
                            : gpsError || 'Mengambil koordinat lokasi GPS...'}
                    </Alert>
                )}

                <Grid container spacing={2}>
                    {/* Column 1: Barcode / QR Scanner + Manual / USB Input */}
                    <Grid size={{ xs: 12, md: settings.use_face_verification ? 6 : 12 }}>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2.5,
                                border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                                bgcolor: isDark ? '#27272a' : '#f8fafc',
                                height: '100%',
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
                                1. Scan Barcode / NIS / NISN
                            </Typography>

                            <Box
                                id={BARCODE_READER_ID}
                                sx={{
                                    width: '100%',
                                    minHeight: isScanningCamera ? 210 : 0,
                                    mb: 1.5,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    bgcolor: '#000',
                                    display: isScanningCamera ? 'block' : 'none',
                                }}
                            />

                            <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                                {!isScanningCamera ? (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        startIcon={<QrCodeScannerIcon />}
                                        onClick={() => startBarcodeScanner(BARCODE_READER_ID)}
                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                    >
                                        Buka Kamera Scan Barcode
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        size="small"
                                        fullWidth
                                        onClick={stopBarcodeScanner}
                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                    >
                                        Tutup Kamera Barcode
                                    </Button>
                                )}
                            </Stack>

                            <TextField
                                label="Kode Barcode / NIS / NISN Siswa"
                                fullWidth
                                size="small"
                                value={barcodeValue}
                                onChange={(e) => setBarcodeValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !settings.use_face_verification) {
                                        e.preventDefault();
                                        handleSubmitScan();
                                    }
                                }}
                                placeholder="Arahkan scanner USB atau ketik NIS/NISN..."
                                sx={{
                                    '& .MuiInputBase-root': {
                                        bgcolor: isDark ? '#18181b' : '#ffffff',
                                        borderRadius: 2,
                                    },
                                }}
                            />
                        </Box>
                    </Grid>

                    {/* Column 2: DeepFace Camera Capture (only if enabled) */}
                    {settings.use_face_verification && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2.5,
                                    border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                                    bgcolor: isDark ? '#27272a' : '#f8fafc',
                                    height: '100%',
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
                                    2. Verifikasi Wajah (DeepFace)
                                </Typography>

                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: 210,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        bgcolor: '#09090b',
                                        mb: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {faceSnapshot ? (
                                        <img
                                            src={faceSnapshot}
                                            alt="Snapshot Wajah"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <video
                                            ref={faceVideoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                                        />
                                    )}
                                </Box>

                                {faceSnapshot ? (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        startIcon={<ReplayIcon />}
                                        onClick={() => setFaceSnapshot(null)}
                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                    >
                                        Ambil Ulang Foto Wajah
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        fullWidth
                                        startIcon={<CameraAltIcon />}
                                        onClick={captureFace}
                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                    >
                                        Ambil Foto Wajah
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    )}
                </Grid>

                {/* Last Scan Result */}
                {lastScanResult && (
                    <Alert
                        severity="success"
                        icon={<CheckCircleIcon />}
                        sx={{ mt: 2, borderRadius: 2 }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                            {lastScanResult.name} (NIS: {lastScanResult.nis}) — HADIR
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                            {lastScanResult.notes}
                        </Typography>
                    </Alert>
                )}
            </DialogBody>

            <DialogFooter>
                <Button
                    onClick={handleCloseDialog}
                    color="inherit"
                    sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                    Tutup
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmitScan()}
                    disabled={isSubmitting || !barcodeValue.trim()}
                    startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
                    sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 2, px: 3 }}
                >
                    {isSubmitting ? 'Memverifikasi...' : 'Verifikasi & Catat Hadir'}
                </Button>
            </DialogFooter>
        </BaseDialog>
    );
};

export default ScanAttendanceDialog;
