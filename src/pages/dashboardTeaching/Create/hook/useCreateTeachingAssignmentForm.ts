import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import useDashboardTeachingStore from "../../store";
import type { TeachingAssignmentPreset } from "../../store";
import {
    buildTeachingAssignmentDefaults,
    TeachingAssignmentValidations,
    type TeachingAssignmentFormValues,
} from "../../Form/utils/teachingAssignmentForm";
import { resolveFilterPeriodId } from "../../List/utils/teachingHelper";

type HookReturn = {
    createTeachingForm: UseFormReturn<TeachingAssignmentFormValues>;
};

const useCreateTeachingAssignmentForm = (
    preset?: TeachingAssignmentPreset
): HookReturn => {
    const { state } = useDashboardTeachingStore();

    const activePeriod =
        state.schoolInformations.find((school) => school.status) ||
        state.schoolInformations[0];

    const presetPeriod =
        preset?.id_school_information ||
        resolveFilterPeriodId(state.filters.periode, state.schoolInformations) ||
        activePeriod?.id_school_information ||
        "";

    const createTeachingForm = useForm<TeachingAssignmentFormValues>({
        defaultValues: buildTeachingAssignmentDefaults({
            id_teacher: preset?.id_teacher || "",
            id_subject: preset?.id_subject || "",
            id_subjects: preset?.id_subject ? [preset.id_subject] : [],
            id_school_information: presetPeriod,
        }),
        resolver: TeachingAssignmentValidations as Resolver<TeachingAssignmentFormValues>,
    });

    return { createTeachingForm };
};

export default useCreateTeachingAssignmentForm;
