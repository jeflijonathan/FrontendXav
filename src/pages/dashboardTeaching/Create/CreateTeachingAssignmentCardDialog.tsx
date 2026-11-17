import { BaseDialog, DialogHeader } from "@components/Dialog";
import { FormProvider } from "react-hook-form";
import type { TeachingAssignmentPreset } from "../store";
import useCreateTeachingAssignmentForm from "./hook/useCreateTeachingAssignmentForm";
import TeachingAssignmentFields from "../Form/TeachingAssignmentFields";
import CreateTeachingAssignmentFooterDialog from "./CreateTeachingAssignmentFooterDialog";

const CreateTeachingAssignmentCardDialog = ({
    isOpen,
    onClose,
    preset,
}: {
    isOpen: boolean;
    onClose: () => void;
    preset?: TeachingAssignmentPreset;
}) => {
    const { createTeachingForm } = useCreateTeachingAssignmentForm(preset);

    const handleClose = () => {
        createTeachingForm.reset();
        onClose();
    };

    return (
        <FormProvider {...createTeachingForm}>
            <BaseDialog isOpen={isOpen} onClose={handleClose} maxWidth="sm">
                <DialogHeader title="Tambah Penugasan Pengajar" onClose={handleClose} />
                <TeachingAssignmentFields />
                <CreateTeachingAssignmentFooterDialog onClose={handleClose} />
            </BaseDialog>
        </FormProvider>
    );
};

export default CreateTeachingAssignmentCardDialog;
