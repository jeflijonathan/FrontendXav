import React, { type ReactNode } from 'react';
import { Dialog } from '@mui/material';

interface BaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

const BaseDialog: React.FC<BaseDialogProps> = ({ isOpen, onClose, children, maxWidth = "sm" }) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth={maxWidth}
            sx={{
                // Menargetkan kontainer kertas internal MUI secara langsung
                '& .MuiPaper-root': {
                    borderRadius: '25px',
                },
            }}
            fullWidth
        >
            {children}
        </Dialog>
    );
};

export default BaseDialog;