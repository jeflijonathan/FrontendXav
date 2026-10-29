import React, { useState, useCallback, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Slider,
    Typography,
    IconButton,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import CropIcon from "@mui/icons-material/Crop";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CropPortraitIcon from "@mui/icons-material/CropPortrait";
import CropLandscapeIcon from "@mui/icons-material/CropLandscape";
import Crop169Icon from "@mui/icons-material/Crop169";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { getCroppedImg, type CroppedArea } from "@utils/cropImage";

export interface ImageCropDialogProps {
    open: boolean;
    imageSrc: string | null;
    onClose: () => void;
    onCropComplete: (croppedFile: File) => void;
    onUseOriginal?: () => void;
    /** Default aspect ratio. Default 1 (square) */
    aspect?: number;
    /** Original filename for the cropped result */
    fileName?: string;
}

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({
    open,
    imageSrc,
    onClose,
    onCropComplete,
    onUseOriginal,
    aspect = 1,
    fileName = "cropped-image.jpg",
}) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [aspectMode, setAspectMode] = useState<string>("portrait");
    // Key to force re-mount Cropper when aspect mode changes (resets crop area)
    const [cropperKey, setCropperKey] = useState(0);

    useEffect(() => {
        if (open) {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
            setCroppedAreaPixels(null);
            setAspectMode("portrait");
            setCropperKey((k) => k + 1);
        }
    }, [open]);

    // When aspect mode changes, reset crop position and re-mount Cropper
    const handleAspectModeChange = useCallback((newMode: string) => {
        setAspectMode(newMode);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        // Force Cropper to remount so initialCroppedAreaPercentages is applied fresh
        setCropperKey((k) => k + 1);
    }, []);

    const onCropChange = useCallback((location: Point) => {
        setCrop(location);
    }, []);

    const onZoomChange = useCallback((z: number) => {
        setZoom(z);
    }, []);

    const handleCropComplete = useCallback((_croppedArea: Area, croppedAreaPx: Area) => {
        setCroppedAreaPixels(croppedAreaPx);
    }, []);

    const handleSaveCrop = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, fileName, rotation);
            onCropComplete(croppedFile);
            handleReset();
        } catch (err) {
            console.error("Error cropping image:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleUseFull = () => {
        handleReset();
        if (onUseOriginal) {
            onUseOriginal();
        } else {
            onClose();
        }
    };

    const getAspectValue = (): number => {
        switch (aspectMode) {
            case "1:1":
                return 1;
            case "4:3":
                return 4 / 3;
            case "16:9":
                return 16 / 9;
            case "9:16":
                return 9 / 16;
            case "portrait":
            default:
                return 3 / 4;   // Potret 3:4 (default profil)
        }
    };

    if (!imageSrc) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        overflow: "hidden",
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1.5,
                    px: 2.5,
                    bgcolor: "primary.main",
                    color: "white",
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1}>
                    <CropIcon />
                    <Typography variant="h6" fontWeight={600}>
                        Potong / Sesuaikan Gambar
                    </Typography>
                </Stack>
                <IconButton onClick={handleClose} sx={{ color: "white" }} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    p: 0,
                    position: "relative",
                    bgcolor: "#1a1a1a",
                }}
            >
                {/* Crop Area */}
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: { xs: 300, sm: 380 },
                    }}
                >
                    <Cropper
                        key={cropperKey}
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={getAspectValue()}
                        onCropChange={onCropChange}
                        onCropComplete={handleCropComplete}
                        onZoomChange={onZoomChange}
                        cropShape="rect"
                        showGrid
                        style={{
                            containerStyle: {
                                backgroundColor: "#1a1a1a",
                            },
                        }}
                    />
                </Box>

                {/* Controls Area */}
                <Box sx={{ px: 3, py: 2, bgcolor: "background.paper" }}>
                    {/* Mode Rasio Pilihan: Potret 3:4, Persegi 1:1, 4:3, 16:9, 9:16 */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75, fontWeight: 600 }}>
                            Pilihan Rasio Potong:
                        </Typography>
                        <ToggleButtonGroup
                            value={aspectMode}
                            exclusive
                            onChange={(_, newMode) => {
                                if (newMode !== null) handleAspectModeChange(newMode);
                            }}
                            size="small"
                            fullWidth
                        >
                            <ToggleButton value="portrait" sx={{ textTransform: "none", py: 0.75, px: 0.5, flexDirection: "column", gap: 0.25 }}>
                                <CropPortraitIcon sx={{ fontSize: 18 }} />
                                <Typography variant="caption" lineHeight={1} fontSize="0.75rem">Potret 3:4</Typography>
                            </ToggleButton>
                            <ToggleButton value="1:1" sx={{ textTransform: "none", py: 0.75, px: 0.5, flexDirection: "column", gap: 0.25 }}>
                                <CropSquareIcon sx={{ fontSize: 18 }} />
                                <Typography variant="caption" lineHeight={1} fontSize="0.75rem">Persegi 1:1</Typography>
                            </ToggleButton>
                            <ToggleButton value="4:3" sx={{ textTransform: "none", py: 0.75, px: 0.5, flexDirection: "column", gap: 0.25 }}>
                                <CropLandscapeIcon sx={{ fontSize: 18 }} />
                                <Typography variant="caption" lineHeight={1} fontSize="0.75rem">4:3</Typography>
                            </ToggleButton>
                            <ToggleButton value="16:9" sx={{ textTransform: "none", py: 0.75, px: 0.5, flexDirection: "column", gap: 0.25 }}>
                                <Crop169Icon sx={{ fontSize: 18 }} />
                                <Typography variant="caption" lineHeight={1} fontSize="0.75rem">16:9</Typography>
                            </ToggleButton>
                            <ToggleButton value="9:16" sx={{ textTransform: "none", py: 0.75, px: 0.5, flexDirection: "column", gap: 0.25 }}>
                                <CropPortraitIcon sx={{ fontSize: 18 }} />
                                <Typography variant="caption" lineHeight={1} fontSize="0.75rem">9:16</Typography>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    {/* Zoom Slider */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
                        <IconButton
                            size="small"
                            onClick={() => setZoom((prev) => Math.max(1, prev - 0.1))}
                            color="primary"
                        >
                            <ZoomOutIcon />
                        </IconButton>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                Zoom ({Math.round(zoom * 100)}%)
                            </Typography>
                            <Slider
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.05}
                                onChange={(_, value) => setZoom(value as number)}
                                size="small"
                                sx={{
                                    "& .MuiSlider-thumb": {
                                        width: 16,
                                        height: 16,
                                    },
                                }}
                            />
                        </Box>
                        <IconButton
                            size="small"
                            onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}
                            color="primary"
                        >
                            <ZoomInIcon />
                        </IconButton>
                    </Stack>

                    {/* Rotation Slider */}
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <IconButton
                            size="small"
                            onClick={() => setRotation((prev) => prev - 90)}
                            color="primary"
                        >
                            <RotateLeftIcon />
                        </IconButton>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                Rotasi ({rotation}°)
                            </Typography>
                            <Slider
                                value={rotation}
                                min={-180}
                                max={180}
                                step={1}
                                onChange={(_, value) => setRotation(value as number)}
                                size="small"
                                sx={{
                                    "& .MuiSlider-thumb": {
                                        width: 16,
                                        height: 16,
                                    },
                                }}
                            />
                        </Box>
                        <IconButton
                            size="small"
                            onClick={() => setRotation((prev) => prev + 90)}
                            color="primary"
                        >
                            <RotateRightIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => {
                                setRotation(0);
                                setZoom(1);
                                setCrop({ x: 0, y: 0 });
                            }}
                            title="Reset"
                        >
                            <RestartAltIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 2.5,
                    py: 1.5,
                    bgcolor: "background.paper",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                }}
            >
                <Button onClick={handleClose} color="inherit" variant="outlined" size="small">
                    Batal
                </Button>

                <Stack direction="row" spacing={1}>
                    {onUseOriginal && (
                        <Button
                            onClick={handleUseFull}
                            variant="outlined"
                            color="secondary"
                            startIcon={<FullscreenIcon />}
                            size="small"
                            title="Gunakan seluruh gambar tanpa memotong"
                        >
                            Full Layar (Tanpa Crop)
                        </Button>
                    )}
                    <Button
                        onClick={handleSaveCrop}
                        variant="contained"
                        disabled={isProcessing || !croppedAreaPixels}
                        startIcon={<CropIcon />}
                        size="small"
                    >
                        {isProcessing ? "Memproses..." : "Terapkan Crop"}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

export default ImageCropDialog;
