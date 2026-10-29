import { BaseDialog, DialogHeader } from "@components/Dialog";
import { FormProvider } from "react-hook-form";
import useUpdateStudentForm from "./hook/useUpdateStudentForm";
import UpdateStudentFormDialog from "./UpdateStudentFormDialog";
import UpdateStudentFooterDialog from "./UpdateStudentFooterDialog";
import { useEffect } from "react";
import useUpdateStudent from "./hook/useUpdateStudent";

const UpdateStudentCardDialog = ({ id, isOpen, onClose }: { id: string; isOpen: boolean; onClose: () => void }) => {
    const { updateStudentForm } = useUpdateStudentForm();
    return (
        <FormProvider {...updateStudentForm}>
            <UpdateStudentCardDialogContent id={id} isOpen={isOpen} onClose={onClose} />
        </FormProvider>
    );
};

const UpdateStudentCardDialogContent = ({ id, isOpen, onClose }: { id: string; isOpen: boolean; onClose: () => void }) => {
    const { fetchDetail } = useUpdateStudent();
    useEffect(() => { if (isOpen && id) fetchDetail(id); }, [isOpen, id]);
    return (
        <BaseDialog isOpen={isOpen} onClose={onClose} maxWidth="md">
            <DialogHeader title="Edit Data Siswa" onClose={onClose} />
            <UpdateStudentFormDialog />
            <UpdateStudentFooterDialog id={id} onClose={onClose} />
        </BaseDialog>
    );
};

export default UpdateStudentCardDialog;
