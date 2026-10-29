import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import { useDetailMajor } from "./hook/useDetailMajor";
import DetailMajorSkeleton from "./DetailMajorSkeleton";
import DetailMajorContent from "./DetailMajorContentDialog";

interface DetailMajorCardDialogProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

const DetailMajorCardDialog: React.FC<DetailMajorCardDialogProps> = ({ id, isOpen, onClose }) => {
    const { detail, isLoading } = useDetailMajor(id, isOpen);

    const renderContent = () => {
        if (isLoading) return <DetailMajorSkeleton />;
        if (!detail) {
            return (
                <Box sx={{ textAlign: "center", py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                        Data jurusan tidak ditemukan
                    </Typography>
                </Box>
            );
        }
        return <DetailMajorContent detail={detail} />;
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader title="Detail Data Jurusan" onClose={onClose} />
            <DialogBody>{renderContent()}</DialogBody>
            <DialogFooter>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClose}
                    sx={{ borderRadius: "8px", textTransform: "none", px: 3 }}
                >
                    Tutup
                </Button>
            </DialogFooter>
        </BaseDialog>
    );
};

export default DetailMajorCardDialog;
