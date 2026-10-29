import { BaseDialog, DialogHeader } from "@components/Dialog";
import { FormProvider } from "react-hook-form";
import useCreateMajorForm from "./hook/useCreateMajorForm";
import CreateMajorFormDialog from "./CreateMajorFormDialog";
import CreateMajorFooterDialog from "./CreateMajorFooterDialog";

const CreateMajorCardDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { createMajorForm } = useCreateMajorForm();

    const handleClose = () => {
        createMajorForm.reset();
        onClose();
    };

    return (
        <FormProvider {...createMajorForm}>
            <BaseDialog isOpen={isOpen} onClose={handleClose}>
                <DialogHeader title="Tambah Data Jurusan" onClose={handleClose} />
                <CreateMajorFormDialog />
                <CreateMajorFooterDialog onClose={handleClose} />
            </BaseDialog>
        </FormProvider>
    );
};

export default CreateMajorCardDialog;
