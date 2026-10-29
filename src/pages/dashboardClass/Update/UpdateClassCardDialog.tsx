import { BaseDialog, DialogHeader } from "@components/Dialog";
import { FormProvider } from "react-hook-form";
import useUpdateClassForm from "./hook/useUpdateClassForm";
import UpdateClassFormDialog from "./UpdateClassFormDialog";
import UpdateClassFooterDialog from "./UpdateClassFooterDialog";
import { useEffect } from "react";
import useFetchClassDetail from "./hook/useFetchClassDetail";
import useDashboardClassStore from "../store";

interface Props {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

const UpdateClassCardDialog = ({ id, isOpen, onClose }: Props) => {
    const { updateClassForm } = useUpdateClassForm();
    const { fetchDetail } = useFetchClassDetail();
    const { setState } = useDashboardClassStore();

    useEffect(() => {
        if (isOpen && id) {
            fetchDetail(id);
        }
    }, [isOpen, id]);

    const handleClose = () => {
        setState((prev) => ({ ...prev, updateClassReqDetails: null }));
        onClose();
    };

    return (
        <FormProvider {...updateClassForm}>
            <BaseDialog isOpen={isOpen} onClose={handleClose}>
                <DialogHeader title="Edit Data Kelas" onClose={handleClose} />
                <UpdateClassFormDialog />
                <UpdateClassFooterDialog id={id} onClose={handleClose} />
            </BaseDialog>
        </FormProvider>
    );
};

export default UpdateClassCardDialog;
