import { useFormContext } from "react-hook-form";
import type { CreateClassRequestModel } from "@api/class/model";
import ClassService from "@api/class/service";
import useDashboardClassStore from "../../store";
import useClassList from "../../List/hook/useClassList";
import { filterClassMapper } from "../../List/utils/FilterClassMapper";
import { snackbar } from "@utils/snackbar";
import { parseErrorDetails, formatErrorDetails } from "@utils/parseErrorDetails";
import { generateClassName } from "../../utils/classNameHelper";

const useCreateClass = () => {
    const { handleSubmit, setError, reset } = useFormContext<CreateClassRequestModel>();
    const { state, setState } = useDashboardClassStore();
    const { fetchClassList } = useClassList();
    const service = new ClassService();

    const handleCreate = (onSuccessCallback?: () => void) => {
        return handleSubmit(async (payload) => {
            setState((prev) => ({ ...prev, isCreateLoading: true }));

            // Calculate auto-generated class name
            const majorObj = state.majors.find((m) => m.id_major === payload.id_major);
            const autoName = majorObj
                ? generateClassName(payload.kelas || "10", majorObj.name, state.data, majorObj.id_major)
                : (payload.kelas || "10");

            // Ensure id_school_information is filled from filters if not provided
            const finalPayload: CreateClassRequestModel = {
                ...payload,
                name: autoName,
                id_school_information: payload.id_school_information || state.filters.id_school_information || null,
                id_class_guardian: payload.id_class_guardian || null,
            };

            // Validasi: 1 guru hanya bisa menjadi wali kelas untuk 1 kelas dalam periode yang sama
            if (finalPayload.id_class_guardian) {
                const schoolInfoId = finalPayload.id_school_information;
                const existingClass = state.data.find(
                    (c) => c.id_class_guardian === finalPayload.id_class_guardian &&
                           (!schoolInfoId || c.id_school_information === schoolInfoId)
                );
                if (existingClass) {
                    const teacher = state.employees.find((e) => e.id === finalPayload.id_class_guardian);
                    const teacherName = teacher ? `${teacher.first_name} ${teacher.last_name || ""}`.trim() : "Guru ini";
                    const className = existingClass.name || `Kelas ${existingClass.kelas}`;
                    const errMsg = `${teacherName} sudah menjadi wali kelas untuk ${className}. Setiap guru hanya dapat menjadi wali kelas untuk 1 kelas.`;

                    setState((prev) => ({
                        ...prev,
                        isCreateLoading: false,
                        detailError: { ...prev.detailError, create: [{ field: "id_class_guardian", message: errMsg }] },
                    }));
                    setError("root.serverError", {
                        type: "validate",
                        message: errMsg,
                    });
                    setError("id_class_guardian", {
                        type: "validate",
                        message: `${teacherName} sudah menjadi wali kelas di ${className}`,
                    });
                    snackbar.error(errMsg);
                    return;
                }
            }

            await service.create(finalPayload, {
                onSuccess: () => {
                    setState((prev) => ({
                        ...prev,
                        isCreateLoading: false,
                        detailError: { ...prev.detailError, create: [] },
                    }));
                    fetchClassList(filterClassMapper(state));
                    snackbar.success("Kelas berhasil ditambahkan");
                    reset();
                    if (onSuccessCallback) onSuccessCallback();
                },
                onError: (err: any) => {
                    const { detail, message } = err;
                    const parsedErrors = parseErrorDetails(detail);

                    setState((prev) => ({
                        ...prev,
                        isCreateLoading: false,
                        detailError: { ...prev.detailError, create: parsedErrors },
                    }));

                    const errMsg = parsedErrors.length > 0 ? formatErrorDetails(parsedErrors) : (message || "Gagal menambahkan kelas");
                    setError("root.serverError", {
                        type: "server",
                        message: errMsg,
                    });
                    snackbar.error(errMsg);
                },
            });
        })();
    };

    return { handleCreate };
};

export default useCreateClass;
