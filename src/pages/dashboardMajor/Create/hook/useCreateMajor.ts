import MajorService from "@api/major/service";
import type { CreateMajorRequestModel } from "@api/major/model";
import { useFormContext } from "react-hook-form";
import { useDashboardMajorStore } from "../../store";
import useMajorList from "../../List/hook/useMajorList";
import { snackbar } from "@utils/snackbar";
import { filterMajorMapper } from "../../List/utils/FilterMajorMapper";
import { parseErrorDetails, formatErrorDetails } from "@utils/parseErrorDetails";

const useCreateMajor = () => {
    const { handleSubmit, setError, reset } = useFormContext<CreateMajorRequestModel>();
    const { state, setState } = useDashboardMajorStore();
    const { fetchMajorList } = useMajorList();
    const service = new MajorService();

    const handleCreate = (onSuccessCallback?: () => void) => {
        return handleSubmit(async (payload) => {
            setState((prev) => ({ ...prev, isCreateLoading: true }));

            service.create(payload, {
                onSuccess: () => {
                    setState((prev) => ({
                        ...prev,
                        isCreateLoading: false,
                        createMajorReqDetails: { name: "", status: true },
                        detailError: { ...prev.detailError, create: [] },
                    }));
                    reset({ name: "", status: true });
                    fetchMajorList(filterMajorMapper(state));
                    snackbar.success("Jurusan berhasil ditambahkan");
                    if (onSuccessCallback) onSuccessCallback();
                },
                onError: (err) => {
                    const parsedErrors = parseErrorDetails(err.detail);
                    setState((prev) => ({
                        ...prev,
                        isCreateLoading: false,
                        detailError: { ...prev.detailError, create: parsedErrors },
                    }));
                    setError("root.serverError" as any, {
                        type: "server",
                        message: formatErrorDetails(parsedErrors) || err.message || "Gagal menambahkan jurusan",
                    });
                    snackbar.error(err.message || "Gagal menambahkan jurusan");
                },
            });
        })();
    };

    return { handleCreate };
};

export default useCreateMajor;
