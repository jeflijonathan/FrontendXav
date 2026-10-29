import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CropIcon from '@mui/icons-material/Crop';
import ImagePreviewModal from '@components/feedback/ImagePreviewModal';
import ImageCropDialog from './ImageCropDialog';

interface UploadFileDropzoneProps {
    onFileChange: (file: File | null) => void;
    accept?: string;
    value?: File | null;
    label?: string;
    helperText?: string;
    initialUrl?: string | null;
    /** Enable crop dialog on file select. Default true for image/* */
    enableCrop?: boolean;
    /** Crop aspect ratio. Default 1 (square) */
    cropAspect?: number;
}

const UploadFileDropzone: React.FC<UploadFileDropzoneProps> = ({
    onFileChange,
    accept = "image/*",
    value,
    label = "Upload File",
    helperText = "Drag and drop an image file here or click",
    initialUrl,
    enableCrop = true,
    cropAspect = 1,
}) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isInitialRemoved, setIsInitialRemoved] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Crop state
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [cropFileName, setCropFileName] = useState<string>("cropped-image.jpg");
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setIsInitialRemoved(false);
        setImageError(false);
    }, [initialUrl]);

    // Generate local preview URL when a File is selected
    useEffect(() => {
        if (value && value.type.startsWith("image/")) {
            const objectUrl = URL.createObjectURL(value);
            setPreviewUrl(objectUrl);
            setImageError(false);
            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        } else {
            setPreviewUrl(null);
        }
    }, [value]);

    const isImageFile = (file: File) => file.type.startsWith("image/");

    /**
     * Open crop dialog with the selected file, or pass through if crop disabled.
     */
    const handleFileSelected = useCallback(
        (file: File) => {
            if (enableCrop && isImageFile(file)) {
                const url = URL.createObjectURL(file);
                setCropImageSrc(url);
                setCropFileName(file.name);
                setOriginalFile(file);
                setIsCropOpen(true);
            } else {
                onFileChange(file);
            }
        },
        [enableCrop, onFileChange]
    );

    const handleCropComplete = useCallback(
        (croppedFile: File) => {
            // Cleanup crop src
            if (cropImageSrc) {
                URL.revokeObjectURL(cropImageSrc);
            }
            setCropImageSrc(null);
            setIsCropOpen(false);
            setOriginalFile(null);
            onFileChange(croppedFile);
        },
        [cropImageSrc, onFileChange]
    );

    const handleUseOriginal = useCallback(() => {
        if (cropImageSrc) {
            URL.revokeObjectURL(cropImageSrc);
        }
        setCropImageSrc(null);
        setIsCropOpen(false);
        if (originalFile) {
            onFileChange(originalFile);
        }
        setOriginalFile(null);
    }, [cropImageSrc, originalFile, onFileChange]);

    const handleCropClose = useCallback(() => {
        if (cropImageSrc) {
            URL.revokeObjectURL(cropImageSrc);
        }
        setCropImageSrc(null);
        setIsCropOpen(false);
        setOriginalFile(null);
        // Reset the file input so user can pick the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [cropImageSrc]);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelected(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    }, [handleFileSelected]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelected(e.target.files[0]);
        }
    }, [handleFileSelected]);

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsInitialRemoved(true);
        onFileChange(null);
        // Reset the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleOpenZoom = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsPreviewModalOpen(true);
    };

    const handleOpenCropExisting = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (previewUrl && value) {
            const url = URL.createObjectURL(value);
            setCropImageSrc(url);
            setCropFileName(value.name);
            setOriginalFile(value);
            setIsCropOpen(true);
        }
    };

    // Determine the image src to display: newly picked file preview OR existing server url
    const resolvedInitialUrl = initialUrl
        ? initialUrl.startsWith("http") || initialUrl.startsWith("blob:") || initialUrl.startsWith("data:")
            ? initialUrl
            : `${import.meta.env.VITE_BACKEND_URL}/api/upload/${initialUrl}`
        : null;

    const displayImageSrc = previewUrl || (!value && !isInitialRemoved && !imageError && resolvedInitialUrl ? resolvedInitialUrl : null);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
            {label && <Typography variant="caption" color="text.secondary">{label}</Typography>}

            <Box
                onDragEnter={handleDragEnter}
                onDragOver={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                component="label"
                sx={{
                    position: 'relative',
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.400',
                    borderRadius: 1,
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minHeight: '140px',
                    '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main',
                    }
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept={accept}
                    onChange={handleChange}
                />

                {displayImageSrc ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'inline-block',
                                borderRadius: 2,
                                overflow: 'visible',
                                '&:hover .zoom-overlay': {
                                    opacity: 1,
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={displayImageSrc}
                                alt="Preview"
                                onClick={handleOpenZoom}
                                onError={() => setImageError(true)}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 2,
                                    objectFit: 'cover',
                                    border: '2px solid',
                                    borderColor: 'grey.300',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                    display: 'block',
                                    cursor: 'zoom-in',
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                        transform: 'scale(1.03)',
                                    },
                                }}
                            />

                            {/* Tombol Zoom Icon di sudut kanan bawah foto */}
                            <IconButton
                                size="small"
                                onClick={handleOpenZoom}
                                sx={{
                                    position: 'absolute',
                                    bottom: -8,
                                    right: -8,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    boxShadow: 2,
                                    p: 0.5,
                                    '&:hover': { bgcolor: 'primary.dark' },
                                }}
                                title="Perbesar foto"
                            >
                                <ZoomInIcon sx={{ fontSize: 18 }} />
                            </IconButton>

                            {/* Tombol Crop ulang di sudut kiri bawah foto */}
                            {enableCrop && value && (
                                <IconButton
                                    size="small"
                                    onClick={handleOpenCropExisting}
                                    sx={{
                                        position: 'absolute',
                                        bottom: -8,
                                        left: -8,
                                        bgcolor: 'secondary.main',
                                        color: 'white',
                                        boxShadow: 2,
                                        p: 0.5,
                                        '&:hover': { bgcolor: 'secondary.dark' },
                                    }}
                                    title="Potong ulang"
                                >
                                    <CropIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            )}

                            {/* Tombol Hapus Gambar di sudut kanan atas foto */}
                            <IconButton
                                size="small"
                                onClick={handleRemove}
                                color="error"
                                sx={{
                                    position: 'absolute',
                                    top: -10,
                                    right: -10,
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: 2,
                                    p: 0.5,
                                    '&:hover': { bgcolor: 'error.main', color: 'white' },
                                }}
                                title="Hapus gambar"
                            >
                                <CloseIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Box>

                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 500,
                                maxWidth: '220px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                                mt: 0.5,
                            }}
                        >
                            {value ? value.name : 'Foto saat ini'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Klik foto untuk memperbesar • Klik area luar untuk ganti
                        </Typography>
                    </Box>
                ) : value ? (
                    // Fallback for non-image files
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {value.name}
                        </Typography>
                        <IconButton size="small" onClick={handleRemove} color="error">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ) : (
                    <>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
                            {helperText}
                        </Typography>
                        <CloudUploadIcon color="action" fontSize="large" />
                    </>
                )}
            </Box>

            {/* Modal Popup Fullscreen Image Preview with Zoom */}
            <ImagePreviewModal
                open={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                src={displayImageSrc}
                title={value?.name || (initialUrl ? "Foto Profil" : undefined)}
            />

            {/* Crop Dialog */}
            <ImageCropDialog
                open={isCropOpen}
                imageSrc={cropImageSrc}
                onClose={handleCropClose}
                onCropComplete={handleCropComplete}
                onUseOriginal={handleUseOriginal}
                aspect={cropAspect}
                fileName={cropFileName}
            />
        </Box>
    );
};

export default UploadFileDropzone;
