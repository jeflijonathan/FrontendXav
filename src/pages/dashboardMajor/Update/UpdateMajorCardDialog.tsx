import { useEffect } from "react";
import { BaseDialog, DialogHeader } from "@components/Dialog";
import { FormProvider } from "react-hook-form";
import useUpdateMajorForm from "./hook/useUpdateMajorForm";
import UpdateMajorFormDialog from "./UpdateMajorFormDialog";
import UpdateMajorFooterDialog from "./UpdateMajorFooterDialog";
import useUpdateMajor from "./hook/useUpdateMajor";

interface UpdateMajorCardDialogProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

const UpdateMajorCardDialog = ({ id, isOpen, onClose }: UpdateMajorCardDialogProps) => {
    const { updateMajorForm } = useUpdateMajorForm();

    return (
        <FormProvider {...updateMajorForm}>
            <UpdateMajorCardDialogContent id={id} isOpen={isOpen} onClose={onClose} />
        </FormProvider>
    );
};

const UpdateMajorCardDialogContent = ({ id, isOpen, onClose }: UpdateMajorCardDialogProps) => {
    const { fetchDetail } = useUpdateMajor();

    useEffect(() => {
        if (isOpen && id) {
            fetchDetail(id);
        }
    }, [isOpen, id]);

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader title="Edit Data Jurusan" onClose={onClose} />
            <UpdateMajorFormDialog />
            <UpdateMajorFooterDialog id={id} onClose={onClose} />
        </BaseDialog>
    );
};

export default UpdateMajorCardDialog;
