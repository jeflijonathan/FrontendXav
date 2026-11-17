import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import TableChartIcon from '@mui/icons-material/TableChart';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { parseGoogleDriveUrl } from '@utils/googleDrive';

interface GoogleDrivePreviewProps {
    url?: string | null;
    height?: number | string;
    showEmptyState?: boolean;
    title?: string;
}

export const GoogleDrivePreview: React.FC<GoogleDrivePreviewProps> = ({
    url,
    height = 420,
    showEmptyState = true,
    title = 'Pratinjau Dokumen Lampiran',
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [iframeKey, setIframeKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    if (!url || !url.trim()) {
        if (!showEmptyState) return null;
        return (
            <Card
                elevation={0}
                sx={{
                    p: 3,
                    bgcolor: isDark ? '#141416' : '#f8fafc',
                    border: isDark ? '1px dashed #3f3f46' : '1px dashed #cbd5e1',
                    borderRadius: 2.5,
                    textAlign: 'center',
                }}
            >
                <CloudQueueIcon sx={{ fontSize: 36, color: isDark ? '#71717a' : '#94a3b8', mb: 1 }} />
                <Typography variant="body2" sx={{ color: isDark ? '#f4f4f5' : '#64748b', fontWeight: 600 }}>
                    Tidak Ada Dokumen Google Drive
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#94a3b8' }}>
                    Lampiran dokumen tidak disertakan pada pengumuman ini.
                </Typography>
            </Card>
        );
    }

    const parsed = parseGoogleDriveUrl(url);

    if (!parsed.isValid || !parsed.embedUrl) {
        return (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
                <b>Format URL Tidak Valid:</b> Tautan &quot;{url}&quot; tidak dapat di-embed secara langsung.
                <Box sx={{ mt: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<OpenInNewIcon />}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        Buka Tautan Langsung di Tab Baru
                    </Button>
                </Box>
            </Alert>
        );
    }

    const getTypeIcon = () => {
        switch (parsed.type) {
            case 'document':
                return <DescriptionIcon fontSize="small" sx={{ color: '#2563eb' }} />;
            case 'spreadsheet':
                return <TableChartIcon fontSize="small" sx={{ color: '#16a34a' }} />;
            case 'presentation':
                return <SlideshowIcon fontSize="small" sx={{ color: '#ea580c' }} />;
            case 'folder':
                return <FolderIcon fontSize="small" sx={{ color: '#ca8a04' }} />;
            default:
                return <DescriptionIcon fontSize="small" sx={{ color: '#4f46e5' }} />;
        }
    };

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 2.5,
                border: isDark ? '1px solid #27272a' : '1px solid #cbd5e1',
                overflow: 'hidden',
                bgcolor: isDark ? '#141416' : '#ffffff',
                boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.5)' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            }}
        >
            {/* Header bar */}
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    bgcolor: isDark ? '#18181b' : '#f8fafc',
                    borderBottom: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                }}
            >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    {getTypeIcon()}
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                        {title}
                    </Typography>
                    <Chip
                        icon={<CheckCircleOutlineIcon sx={{ fontSize: '13px !important' }} />}
                        label={parsed.typeLabel}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ height: 22, fontSize: '11px', fontWeight: 700 }}
                    />
                </Stack>

                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Tooltip title="Muat Ulang Pratinjau Dokumen">
                        <IconButton
                            size="small"
                            onClick={() => {
                                setIsLoading(true);
                                setIframeKey((k) => k + 1);
                            }}
                            sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}
                        >
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<OpenInNewIcon />}
                        href={parsed.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 1.5,
                            boxShadow: 'none',
                        }}
                    >
                        Buka di Google Drive
                    </Button>
                </Stack>
            </Box>

            {/* Embedded Iframe Container */}
            <Box sx={{ position: 'relative', width: '100%', height, bgcolor: isDark ? '#18181b' : '#f1f5f9' }}>
                {isLoading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: isDark ? 'rgba(20, 20, 22, 0.9)' : 'rgba(248, 250, 252, 0.9)',
                            zIndex: 2,
                            gap: 1.5,
                        }}
                    >
                        <CircularProgress size={32} />
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 600 }}>
                            Memuat dokumen dari Google Drive...
                        </Typography>
                    </Box>
                )}

                <iframe
                    key={iframeKey}
                    src={parsed.embedUrl}
                    title="Pratinjau Dokumen Google Drive"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allow="autoplay"
                    onLoad={() => setIsLoading(false)}
                />
            </Box>

            {/* Permissions hint footer */}
            <Box
                sx={{
                    px: 2,
                    py: 1,
                    bgcolor: isDark ? 'rgba(217, 119, 6, 0.15)' : '#fffbeb',
                    borderTop: isDark ? '1px solid rgba(217, 119, 6, 0.3)' : '1px solid #fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <InfoOutlinedIcon sx={{ fontSize: 16, color: isDark ? '#fbbf24' : '#b45309', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: isDark ? '#fde68a' : '#92400e', fontSize: '11px', lineHeight: 1.3 }}>
                    <b>Tips Akses:</b> Pastikan izin berbagi file di Google Drive diatur ke{' '}
                    <b>&quot;Siapa saja yang memiliki link&quot; (Anyone with the link)</b> agar siswa dan pegawai dapat membaca dokumen ini tanpa terkendala izin akses.
                </Typography>
            </Box>
        </Card>
    );
};

export default GoogleDrivePreview;

