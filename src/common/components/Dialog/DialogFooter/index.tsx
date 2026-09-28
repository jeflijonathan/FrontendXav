import React, { type ReactNode } from 'react';
import { DialogActions, Button } from '@mui/material';

interface DialogFooterProps {
    onCancel?: () => void;
    onSubmit?: () => void;
    cancelText?: string;
    submitText?: string;
    isLoading?: boolean;
    children?: ReactNode;
}

const DialogFooter: React.FC<DialogFooterProps> = ({
    onCancel,
    onSubmit,
    cancelText = 'Batal',
    submitText = 'Simpan',
    isLoading = false,
    children,
}) => {
    return (
        <DialogActions sx={{ px: 3, py: 2 }}>
            {children ? (
                children
            ) : (
                <>
                    {onCancel && (
                        <Button onClick={onCancel} disabled={isLoading} color="inherit">
                            {cancelText}
                        </Button>
                    )}
                    {onSubmit && (
                        <Button
                            onClick={onSubmit}
                            disabled={isLoading}
                            variant="contained"
                            disableElevation
                        >
                            {isLoading ? 'Menyimpan...' : submitText}
                        </Button>
                    )}
                </>
            )}
        </DialogActions>
    );
};
export default DialogFooter;