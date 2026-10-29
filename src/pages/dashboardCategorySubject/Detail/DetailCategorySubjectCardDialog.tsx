/**
 * DetailCategorySubjectCardDialog — Representation Logic
 *
 * BaseDialog modal wrapper for Category Subject details.
 *
 * Layer: Representation Logic
 */
import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import useDetailCategorySubject from "./hook/useDetailCategorySubject";
import DetailCategorySubjectSkeleton from "./DetailCategorySubjectSkeleton";
import DetailCategorySubjectContentDialog from "./DetailCategorySubjectContentDialog";

interface Props {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

const DetailCategorySubjectCardDialog: React.FC<Props> = ({ id, isOpen, onClose }) => {
    const { detail, isLoading } = useDetailCategorySubject(id, isOpen);

    const renderContent = (): React.ReactNode => {
        if (isLoading) return <DetailCategorySubjectSkeleton />;
        if (!detail) {
            return (
                <Box sx={{ textAlign: "center", py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                        Data kategori mata pelajaran tidak ditemukan
                    </Typography>
                </Box>
            );
        }
        return <DetailCategorySubjectContentDialog detail={detail} />;
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose} maxWidth="sm">
            <DialogHeader title="Detail Kategori Mata Pelajaran" onClose={onClose} />
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

export default DetailCategorySubjectCardDialog;

