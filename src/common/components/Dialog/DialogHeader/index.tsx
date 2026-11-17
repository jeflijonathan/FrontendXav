import React from 'react';
import { DialogTitle, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DialogHeaderProps {
    title: string;
    description?: string;
    onClose?: () => void;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ title, description, onClose }) => {
    return (
        <DialogTitle sx={{ m: 0, p: 2, pr: onClose ? 6 : 2, position: 'relative' }}>
            <Box component="div">
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600, lineClamp: 1 }}>
                    {title}
                </Typography>

                {description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {description}
                    </Typography>
                )}
            </Box>

            {onClose && (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    size="small"
                    sx={{
                        position: 'absolute',
                        right: 12,
                        top: 12,
                        color: (theme) => theme.palette.grey[500],
                        '&:hover': {
                            color: (theme) => theme.palette.text.primary,
                            backgroundColor: (theme) => theme.palette.action.hover,
                        },
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            )}
        </DialogTitle>
    );
};

export default DialogHeader;