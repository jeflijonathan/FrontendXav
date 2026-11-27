import React, { type ReactNode } from 'react';
import { DialogContent, type SxProps, type Theme } from '@mui/material';

interface DialogBodyProps {
    children: ReactNode;
    sx?: SxProps<Theme>;
}

const DialogBody: React.FC<DialogBodyProps> = ({ children, sx }) => {
    return <DialogContent dividers sx={sx}>{children}</DialogContent>;
};
export default DialogBody;