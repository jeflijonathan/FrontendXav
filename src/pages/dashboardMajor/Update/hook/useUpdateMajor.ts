import MajorService from "@api/major/service";
import type { UpdateMajorRequestModel } from "@api/major/model";
import { useFormContext } from "react-hook-form";
import { useDashboardMajorStore } from "../../store";
import useMajorList from "../../List/hook/useMajorList";
import { snackbar } from "@utils/snackbar";
import { filterMajorMapper } from "../../List/utils/FilterMajorMapper";
import { parseErrorDetails, formatErrorDetails } from "@utils/parseErrorDetails";

const useUpdateMajor = () => {
    const { handleSubmit, setError } = useFormContext<UpdateMajorRequestModel>();
    const { state, setState } = useDashboardMajorStore();
    const { fetchMajorList } = useMajorList();
    const service = new MajorService();

    const fetchDetail = async (id: string) => {
        setState((prev) => ({ ...prev, isLoading: true }));
        try {
            const majorFromCache = state.data.find(
                (item) => item.id_major === id || item.id === id
            );
            if (majorFromCache) {
                setState((prev) => ({
                    ...prev,
                    updateMajorReqDetails: majorFromCache,
                    isLoading: false,
                }));
                return;
            }

            await service.getById(id, {
                onSuccess: (res) => {
                    setState((prev) => ({
                        ...prev,
                        updateMajorReqDetails: res,
                        isLoading: false,
                    }));
                },
                onError: (err) => {
                    setState((prev) => ({ ...prev, isLoading: false }));
                    snackbar.error(err.message || "Gagal mengambil data jurusan");
                },
            });
        } catch {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    };

    const handleUpdate = (id: string, onSuccessCallback?: () => void) => {
        return handleSubmit(async (payload) => {
            setState((prev) => ({ ...prev, isUpdateLoading: true }));

            service.update(id, payload, {
                onSuccess: () => {
                    setState((prev) => ({
                        ...prev,
                        isUpdateLoading: false,
                        updateMajorReqDetails: null,
                        detailError: { ...prev.detailError, update: [] },
                    }));
                    fetchMajorList(filterMajorMapper(state));
                    snackbar.success("Jurusan berhasil diperbarui");
                    if (onSuccessCallback) onSuccessCallback();
                },
                onError: (err) => {
                    const parsedErrors = parseErrorDetails(err.detail);
                    setState((prev) => ({
                        ...prev,
                        isUpdateLoading: false,
                        detailError: { ...prev.detailError, update: parsedErrors },
                    }));
                    setError("root.serverError" as any, {
                        type: "server",
                        message: formatErrorDetails(parsedErrors) || err.message || "Gagal memperbarui jurusan",
                    });
                    snackbar.error(err.message || "Gagal memperbarui jurusan");
                },
            });
        })();
    };

    return { fetchDetail, handleUpdate };
};

export default useUpdateMajor;
