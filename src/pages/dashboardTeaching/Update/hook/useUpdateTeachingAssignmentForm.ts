import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import type { TeachingRowSeed } from "../../store";
import {
    teachingAssignmentFromSeed,
    TeachingAssignmentValidations,
    type TeachingAssignmentFormValues,
} from "../../Form/utils/teachingAssignmentForm";

type HookReturn = {
    updateTeachingForm: UseFormReturn<TeachingAssignmentFormValues>;
};

const useUpdateTeachingAssignmentForm = (seed: TeachingRowSeed): HookReturn => {
    const updateTeachingForm = useForm<TeachingAssignmentFormValues>({
        defaultValues: teachingAssignmentFromSeed(seed),
        values: teachingAssignmentFromSeed(seed),
        resolver: TeachingAssignmentValidations as Resolver<TeachingAssignmentFormValues>,
    });

    return { updateTeachingForm };
};

export default useUpdateTeachingAssignmentForm;
