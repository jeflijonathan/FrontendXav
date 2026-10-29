import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import { useDetailUploadFile } from "./hook/useDetailUploadFile";
import DetailUploadFileContent from "./DetailUploadFileContentDialog";

interface DetailUploadFileCardDialogProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

const DetailUploadFileCardDialog: React.FC<DetailUploadFileCardDialogProps> = ({ id, isOpen, onClose }) => {
    const { detail, isLoading } = useDetailUploadFile(id, isOpen);

    const renderContent = (): React.ReactNode => {
        if (isLoading) {
            return (
                <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        Loading...
                    </Typography>
                </Box>
            );
        }
        if (!detail) {
            return (
                <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        Data tidak ditemukan
                    </Typography>
                </Box>
            );
        }
        return <DetailUploadFileContent detail={detail} />;
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader title="Detail File" onClose={onClose} />
            <DialogBody>
                {renderContent()}
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClose}
                    disableElevation
                    sx={{ borderRadius: "8px", textTransform: "none", px: 3 }}
                >
                    Tutup
                </Button>
            </DialogFooter>
        </BaseDialog>
    );
};

export default DetailUploadFileCardDialog;
