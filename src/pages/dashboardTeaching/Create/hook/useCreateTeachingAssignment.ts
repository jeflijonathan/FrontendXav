import { useFormContext } from "react-hook-form";
import TeachingService from "@api/teaching/service";
import useDashboardTeachingStore from "../../store";
import useTeachingList from "../../List/hook/useTeachingList";
import { filterTeachingMapper } from "../../List/utils/FilterTeachingMapper";
import { snackbar } from "@utils/snackbar";
import { getSubjectJpFromEffectiveWeeks } from "../../utils/teachingBusinessLogic";
import type { TeachingAssignmentFormValues } from "../../Form/utils/teachingAssignmentForm";

const useCreateTeachingAssignment = () => {
    const { handleSubmit, setError, reset } = useFormContext<TeachingAssignmentFormValues>();
    const { setState } = useDashboardTeachingStore();
    const { fetchTeachingList } = useTeachingList();
    const service = new TeachingService();

    const handleCreate = (onSuccessCallback?: () => void) => {
        return handleSubmit(async (payload) => {
            setState((prev) => ({ ...prev, isSubmitting: true }));

            const subjectIds =
                payload.id_subjects && payload.id_subjects.length > 0
                    ? payload.id_subjects
                    : payload.id_subject
                    ? [payload.id_subject]
                    : [];

            if (subjectIds.length === 0) {
                setState((prev) => ({ ...prev, isSubmitting: false }));
                setError("root.serverError", {
                    type: "validation",
                    message: "Minimal pilih 1 mata pelajaran",
                });
                return;
            }

            try {
                const effectiveWeeksList = useDashboardTeachingStore.getState().state.effectiveWeeks;
                const classesList = useDashboardTeachingStore.getState().state.classes;

                for (const subId of subjectIds) {
                    const subJp = getSubjectJpFromEffectiveWeeks(
                        effectiveWeeksList,
                        subId,
                        payload.id_school_information
                    );

                    const matchingAllocs = effectiveWeeksList.filter(
                        (ew) =>
                            ew.id_subject === subId &&
                            (!payload.id_school_information ||
                                ew.id_school_information === payload.id_school_information)
                    );

                    const allocClassIds = Array.from(
                        new Set(
                            matchingAllocs
                                .map((a) => a.id_class)
                                .filter((c): c is string => Boolean(c))
                        )
                    );

                    const targetClassIds =
                        allocClassIds.length > 0
                            ? allocClassIds
                            : payload.id_class
                            ? [payload.id_class]
                            : [
                                  classesList.find(
                                      (c) =>
                                          !payload.id_school_information ||
                                          c.id_school_information === payload.id_school_information
                                  )?.id_class ||
                                      classesList[0]?.id_class ||
                                      "",
                              ];

                    for (const cId of targetClassIds) {
                        await new Promise<void>((resolve, reject) => {
                            service.create(
                                {
                                    id_teacher: payload.id_teacher,
                                    id_subject: subId,
                                    id_class: cId,
                                    id_school_information: payload.id_school_information,
                                    jp_amount: Number(subJp) || 0,
                                    status: payload.status,
                                },
                                {
                                    onSuccess: () => resolve(),
                                    onError: (err) =>
                                        reject(
                                            new Error(
                                                err.message || "Gagal menambahkan penugasan"
                                            )
                                        ),
                                }
                            );
                        });
                    }
                }

                setState((prev) => ({ ...prev, isSubmitting: false }));
                snackbar.success(
                    subjectIds.length > 1
                        ? `${subjectIds.length} penugasan mata pelajaran berhasil ditambahkan`
                        : "Penugasan pengajar berhasil ditambahkan"
                );
                reset();
                const latestState = useDashboardTeachingStore.getState().state;
                fetchTeachingList(filterTeachingMapper(latestState));
                if (onSuccessCallback) onSuccessCallback();
            } catch (err: any) {
                setState((prev) => ({ ...prev, isSubmitting: false }));
                const message = err.message || "Gagal menambahkan penugasan";
                setError("root.serverError", {
                    type: "server",
                    message,
                });
                snackbar.error(message);
            }
        })();
    };

    // `state` tidak dipakai langsung; refresh memakai state terbaru dari store.
    return { handleCreate };
};

export default useCreateTeachingAssignment;

