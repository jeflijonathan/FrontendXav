import React, { type ReactNode } from 'react';
import { DialogContent } from '@mui/material';

interface DialogBodyProps {
    children: ReactNode;
}

const DialogBody: React.FC<DialogBodyProps> = ({ children }) => {
    return <DialogContent dividers>{children}</DialogContent>;
};
export default DialogBody;