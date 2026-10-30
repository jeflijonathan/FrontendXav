/**
 * useCreateSubject — Framework Logic Hook
 *
 * Handles API submission for creating a Subject,
 * with error handling and snackbar notifications.
 *
 * Layer: Framework Logic
 */
import { useFormContext } from "react-hook-form";
import { useSnackbar } from "notistack";
import SubjectService from "@api/subject/service";
import useDashboardSubjectStore from "../../store";
import useSubjectList from "../../List/hook/useSubjectList";
import { filterSubjectMapper } from "../../List/utils/FilterSubjectMapper";
import type { CreateSubjectRequestModel } from "@api/subject/model";

const useCreateSubject = () => {
    const { handleSubmit, setError, reset } =
        useFormContext<CreateSubjectRequestModel>();
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardSubjectStore();
    const { fetchSubjectList } = useSubjectList();
    const service = new SubjectService();

    const handleCreate = (onSuccessCallback?: () => void) => {
        return handleSubmit(async (payload) => {
            setState((prev) => ({ ...prev, isCreateLoading: true }));

            // Map both id_category_subject & category_subject_id for backend compatibility
            const body: CreateSubjectRequestModel = {
                ...payload,
                category_subject_id: payload.id_category_subject,
            };

            await service.create(body, {
                onSuccess: () => {
                    enqueueSnackbar("Mata pelajaran berhasil ditambahkan", {
                        variant: "success",
                    });
                    setState((prev) => ({ ...prev, isCreateLoading: false }));
                    reset();
                    // Refresh data table
                    fetchSubjectList(filterSubjectMapper(state));
                    if (onSuccessCallback) onSuccessCallback();
                },
                onError: (err) => {
                    enqueueSnackbar(err.message || "Gagal menambahkan mata pelajaran", {
                        variant: "error",
                    });
                    setError("root.serverError", {
                        type: "manual",
                        message: err.message || "Gagal menyimpan data",
                    });
                    setState((prev) => ({ ...prev, isCreateLoading: false }));
                },
            });
        });
    };

    return {
        handleCreate,
        isLoading: state.isCreateLoading,
    };
};

export default useCreateSubject;

