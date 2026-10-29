import React, { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, Box, IconButton, Typography, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export interface ImagePreviewModalProps {
    open: boolean;
    onClose: () => void;
    src?: string | null;
    title?: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
    open,
    onClose,
    src,
    title,
}) => {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const posStart = useRef({ x: 0, y: 0 });

    // Reset state when opening or when src changes
    useEffect(() => {
        if (open) {
            setZoom(1);
            setPosition({ x: 0, y: 0 });
        }
    }, [open, src]);

    const handleZoomIn = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setZoom((prev) => Math.min(prev + 0.25, 5));
    }, []);

    const handleZoomOut = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setZoom((prev) => Math.max(prev - 0.25, 0.5));
    }, []);

    const handleReset = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.stopPropagation();
        const delta = e.deltaY < 0 ? 0.15 : -0.15;
        setZoom((prev) => Math.max(0.5, Math.min(5, prev + delta)));
    }, []);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (zoom <= 1) return;
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
            dragStart.current = { x: e.clientX, y: e.clientY };
            posStart.current = { ...position };
        },
        [zoom, position]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!isDragging) return;
            e.stopPropagation();
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            setPosition({
                x: posStart.current.x + dx,
                y: posStart.current.y + dy,
            });
        },
        [isDragging]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    if (!src) return null;

    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            fullScreen
            slotProps={{
                backdrop: {
                    sx: {
                        bgcolor: "rgba(0, 0, 0, 0.85)",
                        backdropFilter: "blur(6px)",
                    },
                },
                paper: {
                    sx: {
                        bgcolor: "rgba(0, 0, 0, 0)",
                        background: "none",
                        boxShadow: "none",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        userSelect: "none",
                    },
                },
            }}
        >
            {/* Top bar: close button */}
            <Box
                sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 20,
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{
                        bgcolor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                        boxShadow: 3,
                        "&:hover": {
                            bgcolor: "error.main",
                            color: "white",
                            transform: "scale(1.05)",
                        },
                        transition: "all 0.2s ease",
                    }}
                    title="Tutup (Esc)"
                    size="medium"
                >
                    <CloseIcon fontSize="medium" />
                </IconButton>
            </Box>

            {/* Image area with zoom & pan */}
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <Box
                    component="img"
                    src={src}
                    alt={title || "Pratinjau Foto"}
                    sx={{
                        maxWidth: "90vw",
                        maxHeight: "85vh",
                        objectFit: "contain",
                        borderRadius: 2,
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                        transition: isDragging ? "none" : "transform 0.15s ease-out",
                        pointerEvents: "none",
                    }}
                    draggable={false}
                />
            </Box>

            {/* Bottom controls: zoom slider + title */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 24,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                {/* Zoom Controls */}
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{
                        bgcolor: "rgba(0, 0, 0, 0.75)",
                        borderRadius: 3,
                        px: 2,
                        py: 0.75,
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <IconButton
                        onClick={handleZoomOut}
                        size="small"
                        sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}
                        title="Perkecil (Zoom Out)"
                    >
                        <ZoomOutIcon fontSize="small" />
                    </IconButton>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "white",
                            minWidth: 50,
                            textAlign: "center",
                            fontWeight: 600,
                            fontFamily: "monospace",
                        }}
                    >
                        {Math.round(zoom * 100)}%
                    </Typography>

                    <IconButton
                        onClick={handleZoomIn}
                        size="small"
                        sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}
                        title="Perbesar (Zoom In)"
                    >
                        <ZoomInIcon fontSize="small" />
                    </IconButton>

                    <Box sx={{ width: 1, height: 20, bgcolor: "rgba(255,255,255,0.2)", mx: 0.5 }} />

                    <IconButton
                        onClick={handleReset}
                        size="small"
                        sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}
                        title="Reset Zoom"
                    >
                        <RestartAltIcon fontSize="small" />
                    </IconButton>
                </Stack>

                {/* Title / File name */}
                {title && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: "white",
                            bgcolor: "rgba(0, 0, 0, 0.65)",
                            px: 2,
                            py: 0.5,
                            borderRadius: 1.5,
                            maxWidth: "80vw",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            textAlign: "center",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                    >
                        {title}
                    </Typography>
                )}

                {/* Hint */}
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                    Scroll untuk zoom • Drag untuk geser
                </Typography>
            </Box>
        </Dialog>
    );
};

export default ImagePreviewModal;
