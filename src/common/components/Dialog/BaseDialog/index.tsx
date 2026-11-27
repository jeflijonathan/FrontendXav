import React, { type ReactNode } from 'react';
import { Dialog, useMediaQuery, useTheme } from '@mui/material';

interface BaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
    fullScreen?: boolean;
    fullScreenOnMobile?: boolean;
}

const BaseDialog: React.FC<BaseDialogProps> = ({
    isOpen,
    onClose,
    children,
    maxWidth = "sm",
    fullScreen = false,
    fullScreenOnMobile = false,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const effectiveFullScreen = fullScreen || (fullScreenOnMobile && isMobile);

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth={maxWidth}
            fullScreen={effectiveFullScreen}
            sx={{
                // Menargetkan kontainer kertas internal MUI secara langsung
                '& .MuiPaper-root': {
                    borderRadius: effectiveFullScreen ? 0 : '25px',
                    overflowX: 'hidden',
                },
                '& .MuiDialogContent-root': {
                    overflowX: 'hidden',
                },
            }}
            fullWidth
        >
            {children}
        </Dialog>
    );
};

export default BaseDialog;