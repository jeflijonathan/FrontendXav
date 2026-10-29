import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import useDashboardClassStore from "../../store";
import type { CreateClassRequestModel } from "@api/class/model";
import { CreateClassDefaultValues, CreateClassDetailsFormatter, CreateClassValidations } from "../utils/createClassForm";

type HookReturn = { createClassForm: UseFormReturn<CreateClassRequestModel> };

const useCreateClassForm = (): HookReturn => {
    const { state } = useDashboardClassStore();
    const createClassForm = useForm<CreateClassRequestModel>({
        defaultValues: CreateClassDefaultValues,
        values: CreateClassDetailsFormatter(
            state.createClassReqDetails,
            state.filters.id_school_information
        ),
        resolver: CreateClassValidations as Resolver<CreateClassRequestModel>,
    });

    return { createClassForm };
};

export default useCreateClassForm;
