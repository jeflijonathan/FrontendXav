import { useFormContext } from "react-hook-form";
import type { UpdateClassRequestModel } from "@api/class/model";
import ClassService from "@api/class/service";
import useDashboardClassStore from "../../store";
import useClassList from "../../List/hook/useClassList";
import { filterClassMapper } from "../../List/utils/FilterClassMapper";
import { snackbar } from "@utils/snackbar";
import { parseErrorDetails, formatErrorDetails } from "@utils/parseErrorDetails";
import { generateClassName } from "../../utils/classNameHelper";

/**
 * Hook for handling class update submission.
 * Must be used inside FormProvider.
 */
const useUpdateClass = () => {
    const { handleSubmit, setError } = useFormContext<UpdateClassRequestModel>();
    const { state, setState } = useDashboardClassStore();
    const { fetchClassList } = useClassList();
    const service = new ClassService();

    const handleUpdate = (id: string, onSuccessCallback?: () => void) => {
        return handleSubmit(async (payload) => {
            setState((prev) => ({ ...prev, isUpdateLoading: true }));

            // Calculate auto-generated class name
            const majorObj = state.majors.find((m) => m.id_major === payload.id_major);
            const currentKelas = payload.kelas || state.updateClassReqDetails?.kelas || "10";
            const autoName = majorObj
                ? generateClassName(currentKelas, majorObj.name, state.data, payload.id_major, id)
                : currentKelas;

            const finalPayload: UpdateClassRequestModel = {
                ...payload,
                name: autoName,
            };

            // Validasi: 1 guru hanya bisa menjadi wali kelas untuk 1 kelas dalam periode yang sama
            if (finalPayload.id_class_guardian) {
                const schoolInfoId = finalPayload.id_school_information || state.updateClassReqDetails?.id_school_information;
                const existingClass = state.data.find(
                    (c) => c.id_class_guardian === finalPayload.id_class_guardian &&
                           c.id_class !== id &&
                           (!schoolInfoId || c.id_school_information === schoolInfoId)
                );
                if (existingClass) {
                    const teacher = state.employees.find((e) => e.id === finalPayload.id_class_guardian);
                    const teacherName = teacher ? `${teacher.first_name} ${teacher.last_name || ""}`.trim() : "Guru ini";
                    const className = existingClass.name || `Kelas ${existingClass.kelas}`;
                    const errMsg = `${teacherName} sudah menjadi wali kelas untuk ${className}. Setiap guru hanya dapat menjadi wali kelas untuk 1 kelas.`;

                    setState((prev) => ({
                        ...prev,
                        isUpdateLoading: false,
                        detailError: { ...prev.detailError, update: [{ field: "id_class_guardian", message: errMsg }] },
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

            await service.update(id, finalPayload, {
                onSuccess: () => {
                    setState((prev) => ({
                        ...prev,
                        isUpdateLoading: false,
                        updateClassReqDetails: null,
                        detailError: { ...prev.detailError, update: [] },
                    }));
                    fetchClassList(filterClassMapper(state));
                    snackbar.success("Kelas berhasil diperbarui");
                    if (onSuccessCallback) onSuccessCallback();
                },
                onError: (err: any) => {
                    const { detail, message } = err;
                    const parsedErrors = parseErrorDetails(detail);

                    setState((prev) => ({
                        ...prev,
                        isUpdateLoading: false,
                        detailError: { ...prev.detailError, update: parsedErrors },
                    }));

                    const errMsg = parsedErrors.length > 0 ? formatErrorDetails(parsedErrors) : (message || "Gagal memperbarui kelas");
                    setError("root.serverError", {
                        type: "server",
                        message: errMsg,
                    });
                    snackbar.error(errMsg);
                },
            });
        })();
    };

    return { handleUpdate };
};

export default useUpdateClass;
