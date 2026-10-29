import { BaseDialog, DialogHeader } from "@components/Dialog";
import { FormProvider } from "react-hook-form";
import useCreateEmployeeForm from "./hook/useCreateEmployeeForm";
import CreateEmployeeFormDialog from "./CreateEmployeeFormDialog";
import CreateEmployeeFooterDialog from "./CreateEmployeeFooterDialog";

import useDashboardEmployeeStore from "../store";

const CreateEmployeeCardDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { createEmployeeForm } = useCreateEmployeeForm();
    const { setState } = useDashboardEmployeeStore();
    
    const handleClose = () => {
        setState(prev => ({ ...prev, profileFile: null }));
        onClose();
    };

    return (
        <FormProvider {...createEmployeeForm}>
            <BaseDialog isOpen={isOpen} onClose={handleClose}>
                <DialogHeader title="Tambah Data Karyawan" onClose={handleClose} />
                <CreateEmployeeFormDialog />
                <CreateEmployeeFooterDialog onClose={handleClose} />
            </BaseDialog>
        </FormProvider>
    );
};

export default CreateEmployeeCardDialog;
