import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import { useDashboardMajorStore } from "../../store";
import type { CreateMajorRequestModel } from "@api/major/model";
import {
    CreateMajorDefaultValues,
    CreateMajorDetailsFormatter,
    CreateMajorValidations,
} from "../utils/createMajorForm";

type HookReturn = {
    createMajorForm: UseFormReturn<CreateMajorRequestModel>;
};

const useCreateMajorForm = (): HookReturn => {
    const { state } = useDashboardMajorStore();
    const createMajorForm = useForm<CreateMajorRequestModel>({
        defaultValues: CreateMajorDefaultValues,
        values: CreateMajorDetailsFormatter(state.createMajorReqDetails),
        resolver: CreateMajorValidations as Resolver<CreateMajorRequestModel>,
    });

    return { createMajorForm };
};

export default useCreateMajorForm;
