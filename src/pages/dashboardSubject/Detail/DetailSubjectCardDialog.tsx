/**
 * DetailSubjectCardDialog — Representation Logic
 *
 * BaseDialog modal wrapper for Subject details.
 *
 * Layer: Representation Logic
 */
import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import useDetailSubject from "./hook/useDetailSubject";
import DetailSubjectSkeleton from "./DetailSubjectSkeleton";
import DetailSubjectContentDialog from "./DetailSubjectContentDialog";

interface Props {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

const DetailSubjectCardDialog: React.FC<Props> = ({ id, isOpen, onClose }) => {
    const { detail, isLoading } = useDetailSubject(id, isOpen);

    const renderContent = (): React.ReactNode => {
        if (isLoading) return <DetailSubjectSkeleton />;
        if (!detail) {
            return (
                <Box sx={{ textAlign: "center", py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                        Data mata pelajaran tidak ditemukan
                    </Typography>
                </Box>
            );
        }
        return <DetailSubjectContentDialog detail={detail} />;
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose} maxWidth="sm">
            <DialogHeader title="Detail Mata Pelajaran" onClose={onClose} />
            <DialogBody>{renderContent()}</DialogBody>
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

export default DetailSubjectCardDialog;

