/**
 * CreateCategorySubjectCardDialog — Representation Logic
 *
 * BaseDialog modal wrapper for creating category subjects.
 *
 * Layer: Representation Logic
 */
import { BaseDialog, DialogHeader } from "@components/Dialog";
import { FormProvider } from "react-hook-form";
import useCreateCategorySubjectForm from "./hook/useCreateCategorySubjectForm";
import CreateCategorySubjectFormDialog from "./CreateCategorySubjectFormDialog";
import CreateCategorySubjectFooterDialog from "./CreateCategorySubjectFooterDialog";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const CreateCategorySubjectCardDialog = ({ isOpen, onClose }: Props) => {
    const { createCategorySubjectForm } = useCreateCategorySubjectForm();

    const handleClose = () => {
        createCategorySubjectForm.reset();
        onClose();
    };

    return (
        <FormProvider {...createCategorySubjectForm}>
            <BaseDialog isOpen={isOpen} onClose={handleClose} maxWidth="sm">
                <DialogHeader title="Tambah Kategori Mata Pelajaran" onClose={handleClose} />
                <CreateCategorySubjectFormDialog />
                <CreateCategorySubjectFooterDialog onClose={handleClose} />
            </BaseDialog>
        </FormProvider>
    );
};

export default CreateCategorySubjectCardDialog;

