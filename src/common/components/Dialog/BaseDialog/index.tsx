import React, { type ReactNode } from 'react';
import { Dialog } from '@mui/material';

interface BaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const BaseDialog: React.FC<BaseDialogProps> = ({ isOpen, onClose, children }) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            {children}
        </Dialog>
    );
};

export default BaseDialog;