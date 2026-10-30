/**
 * useUpdateSubject — Framework Logic Hook
 *
 * Handles API submission for updating a Subject.
 *
 * Layer: Framework Logic
 */
import { useFormContext } from "react-hook-form";
import { useSnackbar } from "notistack";
import SubjectService from "@api/subject/service";
import useDashboardSubjectStore from "../../store";
import useSubjectList from "../../List/hook/useSubjectList";
import { filterSubjectMapper } from "../../List/utils/FilterSubjectMapper";
import type { UpdateSubjectRequestModel } from "@api/subject/model";

const useUpdateSubject = () => {
    const { handleSubmit, setError } =
        useFormContext<UpdateSubjectRequestModel>();
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardSubjectStore();
    const { fetchSubjectList } = useSubjectList();
    const service = new SubjectService();

    const handleUpdate = (id: string, onSuccessCallback?: () => void) => {
        return handleSubmit(async (payload) => {
            setState((prev) => ({ ...prev, isUpdateLoading: true }));

            const body: UpdateSubjectRequestModel = {
                ...payload,
                category_subject_id: payload.id_category_subject,
            };

            await service.update(id, body, {
                onSuccess: () => {
                    enqueueSnackbar("Mata pelajaran berhasil diperbarui", {
                        variant: "success",
                    });
                    setState((prev) => ({
                        ...prev,
                        isUpdateLoading: false,
                        updateSubjectReqDetails: null,
                    }));
                    fetchSubjectList(filterSubjectMapper(state));
                    if (onSuccessCallback) onSuccessCallback();
                },
                onError: (err) => {
                    enqueueSnackbar(err.message || "Gagal memperbarui mata pelajaran", {
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

export default useUpdateSubject;

