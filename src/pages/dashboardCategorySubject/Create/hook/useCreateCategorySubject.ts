/**
 * useCreateCategorySubject — Framework Logic Hook
 *
 * Handles API submission for creating a category subject,
 * with error handling and snackbar notifications.
 *
 * Layer: Framework Logic
 */
import { useFormContext } from "react-hook-form";
import { useSnackbar } from "notistack";
import CategorySubjectService from "@api/categorysubject/service";
import useDashboardCategorySubjectStore from "../../store";
import useCategorySubjectList from "../../List/hook/useCategorySubjectList";
import { filterCategorySubjectMapper } from "../../List/utils/FilterCategorySubjectMapper";
import type { CreateCategorySubjectRequestModel } from "@api/categorysubject/model";

const useCreateCategorySubject = () => {
    const { handleSubmit, setError, reset } =
        useFormContext<CreateCategorySubjectRequestModel>();
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardCategorySubjectStore();
    const { fetchCategorySubjectList } = useCategorySubjectList();
    const service = new CategorySubjectService();

    const handleCreate = (onSuccessCallback?: () => void) => {
        return handleSubmit(async (payload) => {
            setState((prev) => ({ ...prev, isCreateLoading: true }));

            await service.create(payload, {
                onSuccess: () => {
                    enqueueSnackbar("Kategori mata pelajaran berhasil ditambahkan", {
                        variant: "success",
                    });
                    setState((prev) => ({ ...prev, isCreateLoading: false }));
                    reset();
                    // Refresh data table
                    fetchCategorySubjectList(filterCategorySubjectMapper(state));
                    if (onSuccessCallback) onSuccessCallback();
                },
                onError: (err) => {
                    enqueueSnackbar(err.message || "Gagal menambahkan kategori", {
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

export default useCreateCategorySubject;

