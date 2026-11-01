import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import { useDetailEmployee } from "./hook/useDetailEmployee";
import DetailEmployeeSkeleton from "./DetailEmployeeSkeleton";
import DetailEmployeeContent from "./DetailEmployeeContentDialog";

interface DetailEmployeeCardDialogProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

const DetailEmployeeCardDialog: React.FC<DetailEmployeeCardDialogProps> = ({ id, isOpen, onClose }) => {
    const { detail, isLoading } = useDetailEmployee(id, isOpen);

    const renderComponentDialog = {
        isLoading: <DetailEmployeeSkeleton />,
        noData: (
            <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="body2" color="text.secondary">
                    Data pegawai tidak ditemukan
                </Typography>
            </Box>
        ),
        data: detail ? <DetailEmployeeContent detail={detail} /> : null,
    };

    const renderContent = (): React.ReactNode => {
        if (isLoading && !detail) return renderComponentDialog.isLoading;
        if (!detail) return renderComponentDialog.noData;
        return renderComponentDialog.data;
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose} maxWidth="md">
            <DialogHeader title="Detail Lengkap Pegawai" onClose={onClose} />
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

export default DetailEmployeeCardDialog;
