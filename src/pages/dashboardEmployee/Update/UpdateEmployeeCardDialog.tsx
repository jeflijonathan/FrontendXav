import { BaseDialog, DialogHeader } from "@components/Dialog";
import { FormProvider } from "react-hook-form";
import useUpdateEmployeeForm from "./hook/useUpdateEmployeeForm";
import UpdateEmployeeFormDialog from "./UpdateEmployeeFormDialog";
import UpdateEmployeeFooterDialog from "./UpdateEmployeeFooterDialog";
import { useEffect } from "react";
import useUpdateEmployee from "./hook/useUpdateEmployee";
import useDashboardEmployeeStore from "../store";

const UpdateEmployeeCardDialog = ({ id, isOpen, onClose }: { id: string; isOpen: boolean; onClose: () => void }) => {
    const { updateEmployeeForm } = useUpdateEmployeeForm();
    return (
        <FormProvider {...updateEmployeeForm}>
            <UpdateEmployeeCardDialogContent id={id} isOpen={isOpen} onClose={onClose} form={updateEmployeeForm} />
        </FormProvider>
    );
};

import type { UseFormReturn } from "react-hook-form";
import type { UpdateEmployeeRequestModel } from "@api/employee/model";

const UpdateEmployeeCardDialogContent = ({ id, isOpen, onClose, form }: { id: string; isOpen: boolean; onClose: () => void; form: UseFormReturn<UpdateEmployeeRequestModel> }) => {
    const { fetchDetail } = useUpdateEmployee();
    const { state, setState } = useDashboardEmployeeStore();
    const d = state.updateEmployeeReqDetails;

    useEffect(() => {
        if (isOpen && id) {
            fetchDetail(id);
        }
    }, [isOpen, id]);

    useEffect(() => {
        if (!d || d.id !== id) return;
        form.reset({
            niy: d?.niy || "",
            username: d?.user?.username || "",
            email: d?.email || "",
            password: "",
            first_name: d?.first_name || "",
            last_name: d?.last_name || "",
            profile_url: d?.profile_url || "",
            status: d?.status ?? true,
            role_ids: d?.user?.roles?.map(r => r.id) || [],
            detail: {
                gender: d?.detail?.gender || "L",
                phone_number: d?.detail?.phone_number || "",
                birth_place: d?.detail?.birth_place || "",
                address: d?.detail?.address || "",
                birth_date: d?.detail?.birth_date || "",
                RT: d?.detail?.RT || "",
                RW: d?.detail?.RW || "",
                zip_code: d?.detail?.zip_code || "",
                description: d?.detail?.description || "",
            },
        });
    }, [d?.id, d?.updated_at]);

    const handleClose = () => {
        setState(prev => ({ ...prev, profileFile: null }));
        onClose();
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={handleClose}>
            <DialogHeader title="Edit Data Karyawan" onClose={handleClose} />
            <UpdateEmployeeFormDialog />
            <UpdateEmployeeFooterDialog id={id} onClose={handleClose} />
        </BaseDialog>
    );
};

export default UpdateEmployeeCardDialog;
