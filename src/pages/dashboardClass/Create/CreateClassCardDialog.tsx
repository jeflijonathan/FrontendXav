import { BaseDialog, DialogHeader } from "@components/Dialog";
import { FormProvider } from "react-hook-form";
import useCreateClassForm from "./hook/useCreateClassForm";
import CreateClassFormDialog from "./CreateClassFormDialog";
import CreateClassFooterDialog from "./CreateClassFooterDialog";

const CreateClassCardDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { createClassForm } = useCreateClassForm();

    const handleClose = () => {
        createClassForm.reset();
        onClose();
    };

    return (
        <FormProvider {...createClassForm}>
            <BaseDialog isOpen={isOpen} onClose={handleClose}>
                <DialogHeader title="Tambah Data Kelas" onClose={handleClose} />
                <CreateClassFormDialog />
                <CreateClassFooterDialog onClose={handleClose} />
            </BaseDialog>
        </FormProvider>
    );
};

export default CreateClassCardDialog;
