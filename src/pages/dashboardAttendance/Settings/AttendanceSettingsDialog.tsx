import React from 'react';
import {
    Box,
    Stack,
    Typography,
    Switch,
    FormControlLabel,
    TextField,
    Button,
    CircularProgress,
    Grid,
    Divider,
} from '@mui/material';
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from '@components/Dialog';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useTheme } from '@mui/material/styles';
import useAttendanceSettings from './hook/useAttendanceSettings';

export const AttendanceSettingsDialog: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const {
        draft,
        setDraft,
        isOpen,
        isSavingSettings,
        isGettingLocation,
        closeSettings,
        handleUseCurrentLocation,
        handleSaveSettings,
    } = useAttendanceSettings();

    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={closeSettings}
            maxWidth="sm"
        >
            <DialogHeader
                title="Pengaturan Verifikasi Presensi"
                description="Aktifkan atau nonaktifkan verifikasi wajah (DeepFace) & Geolocation saat scan barcode."
                onClose={closeSettings}
            />

            <DialogBody>
                <Stack spacing={2.5}>
                    {/* Toggle Face Verification (DeepFace) */}
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2.5,
                            border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                            bgcolor: isDark ? '#27272a' : '#f8fafc',
                        }}
                    >
                        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                                <FaceRetouchingNaturalIcon color={draft.use_face_verification ? 'success' : 'disabled'} />
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                        Verifikasi Wajah (DeepFace)
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', display: 'block' }}>
                                        Cocokkan foto kamera dengan foto profil siswa saat scan barcode. Matikan jika ingin scan barcode saja.
                                    </Typography>
                                </Box>
                            </Stack>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={draft.use_face_verification}
                                        onChange={(e) =>
                                             setDraft((prev) => ({ ...prev, use_face_verification: e.target.checked }))
                                        }
                                        color="success"
                                    />
                                }
                                label=""
                                sx={{ m: 0 }}
                            />
                        </Stack>
                    </Box>

                    {/* Toggle Geolocation */}
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2.5,
                            border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                            bgcolor: isDark ? '#27272a' : '#f8fafc',
                        }}
                    >
                        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                                <LocationOnIcon color={draft.use_geolocation ? 'info' : 'disabled'} />
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                        Validasi Lokasi (Geolocation GPS)
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', display: 'block' }}>
                                        Wajibkan lokasi GPS berada dalam radius sekolah saat melakukan scan presensi.
                                    </Typography>
                                </Box>
                            </Stack>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={draft.use_geolocation}
                                        onChange={(e) =>
                                            setDraft((prev) => ({ ...prev, use_geolocation: e.target.checked }))
                                        }
                                        color="info"
                                    />
                                }
                                label=""
                                sx={{ m: 0 }}
                            />
                        </Stack>

                        {draft.use_geolocation && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? '#d4d4d8' : '#334155' }}>
                                        Titik Koordinat Sekolah (Opsional — kosongkan jika hanya mencatat koordinat)
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={isGettingLocation ? <CircularProgress size={14} /> : <MyLocationIcon />}
                                        onClick={handleUseCurrentLocation}
                                        disabled={isGettingLocation}
                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, fontSize: '11.5px' }}
                                    >
                                        Gunakan Lokasi Saat Ini
                                    </Button>
                                </Stack>

                                <Grid container spacing={1.5}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <TextField
                                            label="Latitude"
                                            type="number"
                                            size="small"
                                            fullWidth
                                            value={draft.school_latitude ?? ''}
                                            onChange={(e) =>
                                                setDraft((prev) => ({
                                                    ...prev,
                                                    school_latitude: e.target.value === '' ? null : Number(e.target.value),
                                                }))
                                            }
                                            sx={{ '& .MuiInputBase-root': { bgcolor: isDark ? '#18181b' : '#ffffff', borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <TextField
                                            label="Longitude"
                                            type="number"
                                            size="small"
                                            fullWidth
                                            value={draft.school_longitude ?? ''}
                                            onChange={(e) =>
                                                setDraft((prev) => ({
                                                    ...prev,
                                                    school_longitude: e.target.value === '' ? null : Number(e.target.value),
                                                }))
                                            }
                                            sx={{ '& .MuiInputBase-root': { bgcolor: isDark ? '#18181b' : '#ffffff', borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <TextField
                                            label="Radius Maks (meter)"
                                            type="number"
                                            size="small"
                                            fullWidth
                                            value={draft.max_radius_meters}
                                            onChange={(e) =>
                                                setDraft((prev) => ({
                                                    ...prev,
                                                    max_radius_meters: Number(e.target.value) || 200,
                                                }))
                                            }
                                            sx={{ '& .MuiInputBase-root': { bgcolor: isDark ? '#18181b' : '#ffffff', borderRadius: 2 } }}
                                        />
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Box>
                </Stack>
            </DialogBody>

            <DialogFooter
                onCancel={closeSettings}
                cancelText="Batal"
                onSubmit={handleSaveSettings}
                submitText="Simpan Pengaturan"
                isLoading={isSavingSettings}
            />
        </BaseDialog>
    );
};

export default AttendanceSettingsDialog;
