/**
 * CreateSubjectCardDialog — Representation Logic
 *
 * BaseDialog modal wrapper for creating a Subject.
 *
 * Layer: Representation Logic
 */
import { BaseDialog, DialogHeader } from "@components/Dialog";
import { FormProvider } from "react-hook-form";
import useCreateSubjectForm from "./hook/useCreateSubjectForm";
import CreateSubjectFormDialog from "./CreateSubjectFormDialog";
import CreateSubjectFooterDialog from "./CreateSubjectFooterDialog";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const CreateSubjectCardDialog = ({ isOpen, onClose }: Props) => {
    const { createSubjectForm } = useCreateSubjectForm();

    const handleClose = () => {
        createSubjectForm.reset();
        onClose();
    };

    return (
        <FormProvider {...createSubjectForm}>
            <BaseDialog isOpen={isOpen} onClose={handleClose} maxWidth="sm">
                <DialogHeader title="Tambah Mata Pelajaran" onClose={handleClose} />
                <CreateSubjectFormDialog />
                <CreateSubjectFooterDialog onClose={handleClose} />
            </BaseDialog>
        </FormProvider>
    );
};

export default CreateSubjectCardDialog;

