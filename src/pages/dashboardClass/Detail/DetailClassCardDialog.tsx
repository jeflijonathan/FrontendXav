import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import { useDetailClass } from "./hook/useDetailClass";
import DetailClassSkeleton from "./DetailClassSkeleton";
import DetailClassContentDialog from "./DetailClassContentDialog";

interface DetailClassCardDialogProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

const DetailClassCardDialog: React.FC<DetailClassCardDialogProps> = ({ id, isOpen, onClose }) => {
    const { detail, isLoading, isLoadingStudents } = useDetailClass(id, isOpen);

    const renderContent = (): React.ReactNode => {
        if (isLoading) return <DetailClassSkeleton />;
        if (!detail) {
            return (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                        Data kelas tidak ditemukan
                    </Typography>
                </Box>
            );
        }
        return <DetailClassContentDialog detail={detail} isLoadingStudents={isLoadingStudents} />;
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose} maxWidth="md">
            <DialogHeader title="Detail Kelas" onClose={onClose} />
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

export default DetailClassCardDialog;
