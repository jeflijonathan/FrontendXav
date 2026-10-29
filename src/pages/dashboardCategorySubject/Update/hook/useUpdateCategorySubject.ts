/**
 * useUpdateCategorySubject — Framework Logic Hook
 *
 * Handles API submission for updating a category subject.
 *
 * Layer: Framework Logic
 */
import { useFormContext } from "react-hook-form";
import { useSnackbar } from "notistack";
import CategorySubjectService from "@api/categorysubject/service";
import useDashboardCategorySubjectStore from "../../store";
import useCategorySubjectList from "../../List/hook/useCategorySubjectList";
import { filterCategorySubjectMapper } from "../../List/utils/FilterCategorySubjectMapper";
import type { UpdateCategorySubjectRequestModel } from "@api/categorysubject/model";

const useUpdateCategorySubject = () => {
    const { handleSubmit, setError } =
        useFormContext<UpdateCategorySubjectRequestModel>();
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardCategorySubjectStore();
    const { fetchCategorySubjectList } = useCategorySubjectList();
    const service = new CategorySubjectService();

    const handleUpdate = (id: string, onSuccessCallback?: () => void) => {
        return handleSubmit(async (payload) => {
            setState((prev) => ({ ...prev, isUpdateLoading: true }));

            await service.update(id, payload, {
                onSuccess: () => {
                    enqueueSnackbar("Kategori mata pelajaran berhasil diperbarui", {
                        variant: "success",
                    });
                    setState((prev) => ({
                        ...prev,
                        isUpdateLoading: false,
                        updateCategorySubjectReqDetails: null,
                    }));
                    fetchCategorySubjectList(filterCategorySubjectMapper(state));
                    if (onSuccessCallback) onSuccessCallback();
                },
                onError: (err) => {
                    enqueueSnackbar(err.message || "Gagal memperbarui kategori", {
                        variant: "error",
                    });
                    setError("root.serverError", {
                        type: "manual",
                        message: err.message || "Gagal menyimpan perubahan",
                    });
                    setState((prev) => ({ ...prev, isUpdateLoading: false }));
                },
            });
        });
    };

    return {
        handleUpdate,
        isLoading: state.isUpdateLoading,
    };
};

export default useUpdateCategorySubject;

