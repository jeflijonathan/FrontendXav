import React from "react";
import { BaseDialog, DialogHeader } from "@components/Dialog";
import { FormProvider, useForm } from "react-hook-form";
import UpdateAnnouncementContentDialog from "./UpdateAnnouncementContentDIalog";
import UpdateAnnouncementFooterDialog from "./UpdateAnnoncementFooterDialog";
import {
    UpdateAnnouncementDefaultValues,
    UpdateAnnouncementValidations,
    type UpdateAnnouncementFormValues,
} from "./utils/updateAnnouncementForm";
import useDashboardAnnouncementStore from "../store";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    announcementId: string | null;
};

const UpdateAnnouncementCardDialog: React.FC<Props> = ({
    isOpen,
    onClose,
    announcementId,
}) => {
    const { setState } = useDashboardAnnouncementStore();

    const methods = useForm<UpdateAnnouncementFormValues>({
        resolver: UpdateAnnouncementValidations,
        defaultValues: UpdateAnnouncementDefaultValues,
        mode: "onTouched",
    });

    const handleClose = () => {
        methods.reset(UpdateAnnouncementDefaultValues);
        setState((prev) => ({ ...prev, updateAnnouncementReqDetails: null }));
        onClose();
    };

    return (
        <FormProvider {...methods}>
            <BaseDialog isOpen={isOpen} onClose={handleClose} maxWidth="md">
                <DialogHeader
                    title="Ubah Pengumuman"
                    description="Perbarui judul, isi pengumuman, dan tautan dokumen Google Drive."
                    onClose={handleClose}
                />
                <UpdateAnnouncementContentDialog
                    announcementId={announcementId}
                    isOpen={isOpen}
                />
                <UpdateAnnouncementFooterDialog
                    announcementId={announcementId}
                    onClose={handleClose}
                />
            </BaseDialog>
        </FormProvider>
    );
};

export default UpdateAnnouncementCardDialog;
