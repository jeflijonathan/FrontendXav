/**
 * useDeleteCategorySubject — Framework Logic Hook
 *
 * Handles deleting a Category Subject with snackbar notifications.
 *
 * Layer: Framework Logic
 */
import { useSnackbar } from "notistack";
import CategorySubjectService from "@api/categorysubject/service";
import useDashboardCategorySubjectStore from "../../store";

const useDeleteCategorySubject = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardCategorySubjectStore();
    const service = new CategorySubjectService();

    const handleDelete = async (id: string, onSuccessCallback?: () => void) => {
        setState((prev) => ({ ...prev, isDeleteLoading: true }));
        await service.delete(id, {
            onSuccess: () => {
                enqueueSnackbar("Kategori mata pelajaran berhasil dihapus", {
                    variant: "success",
                });
                setState((prev) => ({ ...prev, isDeleteLoading: false }));
                if (onSuccessCallback) onSuccessCallback();
            },
            onError: (err) => {
                enqueueSnackbar(err.message || "Gagal menghapus kategori", {
                    variant: "error",
                });
                setState((prev) => ({ ...prev, isDeleteLoading: false }));
            },
        });
    };

    return {
        handleDelete,
        isLoading: state.isDeleteLoading,
    };
};

export default useDeleteCategorySubject;

