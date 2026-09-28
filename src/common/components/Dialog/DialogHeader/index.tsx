import React from 'react';
import { DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DialogHeaderProps {
    title: string;
    onClose?: () => void;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ title, onClose }) => {
    return (
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {title}
            {onClose && (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            )}
        </DialogTitle>
    );
};
export default DialogHeader;