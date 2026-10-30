/**
 * useDeleteSubject — Framework Logic Hook
 *
 * Handles deleting a Subject with snackbar notifications.
 *
 * Layer: Framework Logic
 */
import { useSnackbar } from "notistack";
import SubjectService from "@api/subject/service";
import useDashboardSubjectStore from "../../store";

const useDeleteSubject = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardSubjectStore();
    const service = new SubjectService();

    const handleDelete = async (id: string, onSuccessCallback?: () => void) => {
        setState((prev) => ({ ...prev, isDeleteLoading: true }));
        await service.delete(id, {
            onSuccess: () => {
                enqueueSnackbar("Mata pelajaran berhasil dihapus", {
                    variant: "success",
                });
                setState((prev) => ({ ...prev, isDeleteLoading: false }));
                if (onSuccessCallback) onSuccessCallback();
            },
            onError: (err) => {
                enqueueSnackbar(err.message || "Gagal menghapus mata pelajaran", {
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

export default useDeleteSubject;

