import React from 'react';
import { Button, ButtonGroup, Stack, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material/styles';
import type { AttendanceStatus } from '@api/attendance/model';
import { ATTENDANCE_STATUS_OPTIONS } from './utils/attendanceStatusHelper';

interface AttendanceStatusControlProps {
    status: AttendanceStatus;
    notes?: string;
    onStatusChange: (status: AttendanceStatus) => void;
    onNotesChange: (notes: string) => void;
    disabled?: boolean;
    fullWidthButtons?: boolean;
    showNotesInline?: boolean;
}

const STATUS_ICONS: Record<AttendanceStatus, React.ReactNode> = {
    HADIR: <CheckCircleIcon sx={{ fontSize: 15 }} />,
    IZIN: <InfoIcon sx={{ fontSize: 15 }} />,
    SAKIT: <LocalHospitalIcon sx={{ fontSize: 15 }} />,
    ALPA: <CancelIcon sx={{ fontSize: 15 }} />,
};

export const AttendanceStatusControl: React.FC<AttendanceStatusControlProps> = ({
    status,
    notes = '',
    onStatusChange,
    onNotesChange,
    disabled = false,
    fullWidthButtons = false,
    showNotesInline = false,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const buttonGroup = (
        <ButtonGroup
            variant="outlined"
            size="small"
            fullWidth={fullWidthButtons}
            disabled={disabled}
            sx={{ borderRadius: 2, overflow: 'hidden' }}
        >
            {ATTENDANCE_STATUS_OPTIONS.map((opt) => {
                const isActive = status === opt.value;
                return (
                    <Button
                        key={opt.value}
                        onClick={() => onStatusChange(opt.value)}
                        startIcon={STATUS_ICONS[opt.value]}
                        sx={{
                            fontWeight: 800,
                            fontSize: '11.5px',
                            textTransform: 'none',
                            px: { xs: 1, sm: 1.25 },
                            bgcolor: isActive ? opt.activeBg : 'transparent',
                            color: isActive ? '#ffffff' : isDark ? opt.darkColor : opt.lightColor,
                            borderColor: isDark ? opt.darkBorder : opt.lightBorder,
                            '&:hover': {
                                bgcolor: isActive ? opt.hoverBg : isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc',
                            },
                        }}
                    >
                        {opt.label}
                    </Button>
                );
            })}
        </ButtonGroup>
    );

    if (!showNotesInline) {
        return buttonGroup;
    }

    return (
        <Stack spacing={1.25}>
            {buttonGroup}
            <TextField
                size="small"
                fullWidth
                disabled={disabled}
                placeholder={status === 'HADIR' ? 'Catatan opsional...' : 'Alasan / keterangan...'}
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                sx={{
                    '& .MuiInputBase-root': {
                        fontSize: '12px',
                        bgcolor: isDark ? '#27272a' : '#ffffff',
                        borderRadius: 1.5,
                    },
                }}
            />
        </Stack>
    );
};

export default AttendanceStatusControl;
