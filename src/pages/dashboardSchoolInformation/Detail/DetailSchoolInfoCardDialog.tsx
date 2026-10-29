import React, { useEffect } from 'react';
import {
    Button,
    Box,
    Typography
} from '@mui/material';
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from '@components/Dialog';
import useDetailSchoolInfo from './hook/useDetailSchoolInfo';
import { LoadingSpinner } from '@components/feedback';
import DetailSchoolInfoContentDialog from './DetailSchoolInfoContentDialog';

interface DetailSchoolInfoCardDialogProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

const DetailSchoolInfoCardDialog: React.FC<DetailSchoolInfoCardDialogProps> = ({ id, isOpen, onClose }) => {
    const { detail, isLoading, fetchDetail } = useDetailSchoolInfo();

    useEffect(() => {
        fetchDetail(id);
    }, []);

    const EmptyComponent = () => (
        <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body2" color="text.secondary">
                Data tidak ditemukan
            </Typography>
        </Box>
    );

    const renderComponents = [
        <Box key="loading" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <LoadingSpinner isLoading={isLoading} />
        </Box>,
        <DetailSchoolInfoContentDialog key="detail" detail={detail!} />,
        <EmptyComponent key="empty" />
    ];

    const activeIndex = isLoading ? 0 : detail ? 1 : 2;

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader title="Detail Informasi Sekolah" onClose={onClose} />

            <DialogBody>
                {renderComponents[activeIndex]}
            </DialogBody>

            <DialogFooter>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClose}
                    disableElevation
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        px: 3,
                        py: 1
                    }}
                >
                    Tutup
                </Button>
            </DialogFooter>
        </BaseDialog>
    );
};

export default DetailSchoolInfoCardDialog;