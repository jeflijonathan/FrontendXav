import { useFormContext } from "react-hook-form";
import TeachingService from "@api/teaching/service";
import useDashboardTeachingStore from "../../store";
import type { TeachingRowSeed } from "../../store";
import useTeachingList from "../../List/hook/useTeachingList";
import { filterTeachingMapper } from "../../List/utils/FilterTeachingMapper";
import { snackbar } from "@utils/snackbar";
import type { TeachingAssignmentFormValues } from "../../Form/utils/teachingAssignmentForm";

const useUpdateTeachingAssignment = (seed: TeachingRowSeed) => {
    const { handleSubmit, setError } = useFormContext<TeachingAssignmentFormValues>();
    const { setState } = useDashboardTeachingStore();
    const { fetchTeachingList } = useTeachingList();
    const service = new TeachingService();
    const idClassRoom = seed.placement.id_class_room;

    const handleUpdate = (onSuccessCallback?: () => void) => {
        return handleSubmit(async (payload) => {
            if (!idClassRoom) {
                const message = "Penugasan ini tidak memiliki ID kelas.";
                setError("root.serverError", { type: "server", message });
                snackbar.error(message);
                return;
            }

            setState((prev) => ({ ...prev, isSubmitting: true }));

            await service.update(
                idClassRoom,
                {
                    id_teacher: payload.id_teacher,
                    id_subject: payload.id_subject,
                    id_class: payload.id_class,
                    id_school_information: payload.id_school_information,
                    jp_amount: Number(payload.jp_amount) || 0,
                    status: payload.status,
                },
                {
                    onSuccess: () => {
                        setState((prev) => ({ ...prev, isSubmitting: false }));
                        snackbar.success("Penugasan pengajar berhasil diperbarui");
                        const latestState = useDashboardTeachingStore.getState().state;
                        fetchTeachingList(filterTeachingMapper(latestState));
                        if (onSuccessCallback) onSuccessCallback();
                    },
                    onError: (err) => {
                        setState((prev) => ({ ...prev, isSubmitting: false }));
                        const message = err.message || "Gagal memperbarui penugasan";
                        setError("root.serverError", {
                            type: "server",
                            message,
                        });
                        snackbar.error(message);
                    },
                }
            );
        })();
    };

    return { handleUpdate };
};

export default useUpdateTeachingAssignment;
