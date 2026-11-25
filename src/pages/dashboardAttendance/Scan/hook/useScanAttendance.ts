import { useState, useRef, useCallback, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import attendanceService from '@api/attendance/service';
import type { ScanAttendanceResponse } from '@api/attendance/model';
import { snackbar } from '@utils/snackbar';
import useDashboardAttendanceStore from '../../store';
import { captureVideoFrameBase64, getBrowserPosition } from '../utils/scanMediaHelper';

export function useScanAttendance(onScanSuccessRefresh: () => Promise<void>) {
    const { state, setState } = useDashboardAttendanceStore();
    const {
        isScanDialogOpen,
        selectedSchoolInfoId,
        selectedClassId,
        selectedMeeting,
        settings,
    } = state;

    const [barcodeValue, setBarcodeValue] = useState<string>('');
    const [isScanningCamera, setIsScanningCamera] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [faceSnapshot, setFaceSnapshot] = useState<string | null>(null);
    const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
    const [gpsError, setGpsError] = useState<string | null>(null);
    const [isFetchingGps, setIsFetchingGps] = useState<boolean>(false);
    const [lastScanResult, setLastScanResult] = useState<ScanAttendanceResponse | null>(null);

    const qrScannerRef = useRef<Html5Qrcode | null>(null);
    const faceVideoRef = useRef<HTMLVideoElement | null>(null);
    const faceStreamRef = useRef<MediaStream | null>(null);

    const stopFaceCamera = useCallback(() => {
        if (faceStreamRef.current) {
            faceStreamRef.current.getTracks().forEach((t) => t.stop());
            faceStreamRef.current = null;
        }
        if (faceVideoRef.current) {
            faceVideoRef.current.srcObject = null;
        }
    }, []);

    const stopBarcodeScanner = useCallback(async () => {
        if (qrScannerRef.current) {
            try {
                if (qrScannerRef.current.isScanning) {
                    await qrScannerRef.current.stop();
                }
                qrScannerRef.current.clear();
            } catch {
                // ignore stop error
            }
            qrScannerRef.current = null;
        }
        setIsScanningCamera(false);
    }, []);

    const startFaceCamera = useCallback(async () => {
        if (!settings.use_face_verification) return;
        try {
            stopFaceCamera();
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
                audio: false,
            });
            faceStreamRef.current = stream;
            if (faceVideoRef.current) {
                faceVideoRef.current.srcObject = stream;
            }
        } catch (err: any) {
            snackbar.error(`Kamera wajah tidak dapat diakses: ${err?.message || 'Periksa izin kamera'}`);
        }
    }, [settings.use_face_verification, stopFaceCamera]);

    const startBarcodeScanner = useCallback(
        async (elementId: string) => {
            try {
                await stopBarcodeScanner();
                const scanner = new Html5Qrcode(elementId);
                qrScannerRef.current = scanner;
                setIsScanningCamera(true);
                await scanner.start(
                    { facingMode: 'environment' },
                    { fps: 10, qrbox: { width: 220, height: 140 } },
                    (decodedText) => {
                        setBarcodeValue(decodedText.trim());
                        snackbar.info(`Barcode terdeteksi: ${decodedText.trim()}`);
                    },
                    () => {}
                );
            } catch (err: any) {
                setIsScanningCamera(false);
                snackbar.warning(`Kamera barcode tidak tersedia (${err?.message || 'gunakan input manual/USB scanner'}).`);
            }
        },
        [stopBarcodeScanner]
    );

    const refreshGps = useCallback(async () => {
        if (!settings.use_geolocation) {
            setGpsCoords(null);
            setGpsError(null);
            return;
        }
        setIsFetchingGps(true);
        setGpsError(null);
        try {
            const pos = await getBrowserPosition();
            setGpsCoords(pos);
        } catch (err: any) {
            setGpsCoords(null);
            setGpsError(err?.message || 'Gagal mengambil lokasi GPS');
        } finally {
            setIsFetchingGps(false);
        }
    }, [settings.use_geolocation]);

    const captureFace = useCallback(() => {
        const frame = captureVideoFrameBase64(faceVideoRef.current);
        if (!frame) {
            snackbar.warning('Kamera wajah belum siap.');
            return;
        }
        setFaceSnapshot(frame);
    }, []);

    const handleSubmitScan = useCallback(
        async (overrideCode?: string) => {
            const code = (overrideCode ?? barcodeValue).trim();
            if (!code) {
                snackbar.warning('Silakan scan atau masukkan NIS / NISN / Kode Siswa.');
                return;
            }
            if (!selectedSchoolInfoId || !selectedClassId || !selectedMeeting) {
                snackbar.warning('Pilih kelas dan pertemuan terlebih dahulu.');
                return;
            }

            let faceImage = faceSnapshot;
            if (settings.use_face_verification && !faceImage) {
                faceImage = captureVideoFrameBase64(faceVideoRef.current);
                if (!faceImage) {
                    snackbar.warning('Ambil foto wajah terlebih dahulu atau aktifkan kamera wajah.');
                    return;
                }
            }

            let currentGps = gpsCoords;
            if (settings.use_geolocation && !currentGps) {
                try {
                    currentGps = await getBrowserPosition();
                    setGpsCoords(currentGps);
                } catch (err: any) {
                    snackbar.error(err?.message || 'Lokasi GPS diperlukan untuk scan presensi.');
                    return;
                }
            }

            setIsSubmitting(true);
            try {
                const res = await attendanceService.scanAttendance({
                    id_school_information: selectedSchoolInfoId,
                    id_class: selectedClassId,
                    id_teacher: selectedMeeting.teacher_id,
                    teacher_name: selectedMeeting.teacher_name,
                    subject_name: selectedMeeting.subject_name,
                    date: selectedMeeting.date,
                    day: selectedMeeting.day,
                    jp: String(selectedMeeting.jp),
                    time_range: selectedMeeting.time_range,
                    barcode_value: code,
                    face_image_base64: settings.use_face_verification ? faceImage : null,
                    latitude: settings.use_geolocation ? currentGps?.latitude : null,
                    longitude: settings.use_geolocation ? currentGps?.longitude : null,
                });
                setLastScanResult(res);
                setBarcodeValue('');
                setFaceSnapshot(null);
                snackbar.success(`Presensi ${res.name} berhasil dicatat (HADIR).`);
                await onScanSuccessRefresh();
            } catch (err: any) {
                snackbar.error(err?.message || 'Gagal memproses scan presensi.');
            } finally {
                setIsSubmitting(false);
            }
        },
        [
            barcodeValue,
            selectedSchoolInfoId,
            selectedClassId,
            selectedMeeting,
            faceSnapshot,
            settings.use_face_verification,
            settings.use_geolocation,
            gpsCoords,
            onScanSuccessRefresh,
        ]
    );

    const handleCloseDialog = useCallback(async () => {
        await stopBarcodeScanner();
        stopFaceCamera();
        setBarcodeValue('');
        setFaceSnapshot(null);
        setLastScanResult(null);
        setState({ isScanDialogOpen: false });
    }, [stopBarcodeScanner, stopFaceCamera, setState]);

    useEffect(() => {
        if (isScanDialogOpen) {
            if (settings.use_geolocation) {
                refreshGps();
            }
            if (settings.use_face_verification) {
                startFaceCamera();
            }
        } else {
            stopBarcodeScanner();
            stopFaceCamera();
        }
    }, [isScanDialogOpen, settings.use_geolocation, settings.use_face_verification, refreshGps, startFaceCamera, stopBarcodeScanner, stopFaceCamera]);

    return {
        isOpen: isScanDialogOpen,
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
        startFaceCamera,
        captureFace,
        refreshGps,
        handleSubmitScan,
        handleCloseDialog,
    };
}

export default useScanAttendance;
