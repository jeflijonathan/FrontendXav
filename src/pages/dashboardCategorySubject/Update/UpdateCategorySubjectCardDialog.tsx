/**
 * UpdateCategorySubjectCardDialog — Representation Logic
 *
 * BaseDialog modal wrapper for updating Category Subject.
 *
 * Layer: Representation Logic
 */
import { useEffect } from "react";
import { BaseDialog, DialogHeader } from "@components/Dialog";
import { FormProvider } from "react-hook-form";
import useUpdateCategorySubjectForm from "./hook/useUpdateCategorySubjectForm";
import useFetchCategorySubjectDetail from "./hook/useFetchCategorySubjectDetail";
import UpdateCategorySubjectFormDialog from "./UpdateCategorySubjectFormDialog";
import UpdateCategorySubjectFooterDialog from "./UpdateCategorySubjectFooterDialog";
import useDashboardCategorySubjectStore, {
    type DashboardCategorySubjectStoreStateType,
} from "../store";

interface Props {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

const UpdateCategorySubjectCardDialog = ({ id, isOpen, onClose }: Props) => {
    const { updateCategorySubjectForm } = useUpdateCategorySubjectForm();
    const { fetchDetail } = useFetchCategorySubjectDetail();
    const { setState } = useDashboardCategorySubjectStore();

    useEffect(() => {
        if (isOpen && id) {
            fetchDetail(id);
        }
    }, [isOpen, id]);

    const handleClose = () => {
        setState((prev: DashboardCategorySubjectStoreStateType) => ({
            ...prev,
            updateCategorySubjectReqDetails: null,
        }));
        onClose();
    };

    return (
        <FormProvider {...updateCategorySubjectForm}>
            <BaseDialog isOpen={isOpen} onClose={handleClose} maxWidth="sm">
                <DialogHeader title="Edit Kategori Mata Pelajaran" onClose={handleClose} />
                <UpdateCategorySubjectFormDialog />
                <UpdateCategorySubjectFooterDialog id={id} onClose={handleClose} />
            </BaseDialog>
        </FormProvider>
    );
};

export default UpdateCategorySubjectCardDialog;
