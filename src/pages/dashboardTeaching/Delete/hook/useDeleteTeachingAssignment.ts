import TeachingService from "@api/teaching/service";
import useDashboardTeachingStore from "../../store";
import type { TeachingRowSeed } from "../../store";
import useTeachingList from "../../List/hook/useTeachingList";
import { filterTeachingMapper } from "../../List/utils/FilterTeachingMapper";
import {
    classLabel,
    periodLabel,
    subjectLabel,
} from "../../List/utils/teachingHelper";
import { snackbar } from "@utils/snackbar";

const useDeleteTeachingAssignment = () => {
    const { setState } = useDashboardTeachingStore();
    const { fetchTeachingList } = useTeachingList();
    const service = new TeachingService();

    const handleDelete = async (seed: TeachingRowSeed, onSuccess?: () => void) => {
        const idClassRoom = seed.placement.id_class_room;
        if (!idClassRoom) {
            snackbar.error("Penugasan ini tidak memiliki ID kelas.");
            return;
        }

        const confirmed = window.confirm(
            `Hapus penugasan ${subjectLabel(seed.subject)} di ${classLabel(
                seed.placement
            )} periode ${periodLabel(seed.placement)}?`
        );
        if (!confirmed) return;

        setState((prev) => ({ ...prev, isSubmitting: true }));

        await service.delete(idClassRoom, {
            onSuccess: () => {
                setState((prev) => ({ ...prev, isSubmitting: false }));
                snackbar.success("Penugasan pengajar berhasil dihapus");
                const latestState = useDashboardTeachingStore.getState().state;
                fetchTeachingList(filterTeachingMapper(latestState));
                if (onSuccess) onSuccess();
            },
            onError: (err) => {
                setState((prev) => ({ ...prev, isSubmitting: false }));
                snackbar.error(err.message || "Gagal menghapus penugasan");
            },
        });
    };

    return { handleDelete };
};

export default useDeleteTeachingAssignment;
