/**
 * UpdateSubjectCardDialog — Representation Logic
 *
 * BaseDialog modal wrapper for updating Subject.
 *
 * Layer: Representation Logic
 */
import { useEffect } from "react";
import { BaseDialog, DialogHeader } from "@components/Dialog";
import { FormProvider } from "react-hook-form";
import useUpdateSubjectForm from "./hook/useUpdateSubjectForm";
import useFetchSubjectDetail from "./hook/useFetchSubjectDetail";
import UpdateSubjectFormDialog from "./UpdateSubjectFormDialog";
import UpdateSubjectFooterDialog from "./UpdateSubjectFooterDialog";
import useDashboardSubjectStore, {
    type DashboardSubjectStoreStateType,
} from "../store";

interface Props {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

const UpdateSubjectCardDialog = ({ id, isOpen, onClose }: Props) => {
    const { updateSubjectForm } = useUpdateSubjectForm();
    const { fetchDetail } = useFetchSubjectDetail();
    const { setState } = useDashboardSubjectStore();

    useEffect(() => {
        if (isOpen && id) {
            fetchDetail(id);
        }
    }, [isOpen, id]);

    const handleClose = () => {
        setState((prev: DashboardSubjectStoreStateType) => ({
            ...prev,
            updateSubjectReqDetails: null,
        }));
        onClose();
    };

    return (
        <FormProvider {...updateSubjectForm}>
            <BaseDialog isOpen={isOpen} onClose={handleClose} maxWidth="sm">
                <DialogHeader title="Edit Mata Pelajaran" onClose={handleClose} />
                <UpdateSubjectFormDialog />
                <UpdateSubjectFooterDialog id={id} onClose={handleClose} />
            </BaseDialog>
        </FormProvider>
    );
};

export default UpdateSubjectCardDialog;

