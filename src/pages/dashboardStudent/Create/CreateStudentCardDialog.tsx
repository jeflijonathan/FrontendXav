import { BaseDialog, DialogHeader } from "@components/Dialog";
import { FormProvider } from "react-hook-form";
import useCreateStudentForm from "./hook/useCreateStudentForm";
import CreateStudentFormDialog from "./CreateStudentFormDialog";
import CreateStudentFooterDialog from "./CreateStudentFooterDialog";

const CreateStudentCardDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { createStudentForm } = useCreateStudentForm();
    return (
        <FormProvider {...createStudentForm}>
            <BaseDialog isOpen={isOpen} onClose={onClose} maxWidth="md">
                <DialogHeader title="Tambah Data Siswa & Orang Tua" onClose={onClose} />
                <CreateStudentFormDialog />
                <CreateStudentFooterDialog onClose={onClose} />
            </BaseDialog>
        </FormProvider>
    );
};

export default CreateStudentCardDialog;
