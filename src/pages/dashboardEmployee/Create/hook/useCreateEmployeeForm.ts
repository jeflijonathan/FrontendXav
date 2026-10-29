import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import useDashboardEmployeeStore from "../../store";
import type { CreateEmployeeRequestModel } from "@api/employee/model";
import { CreateEmployeeDefaultValues, CreateEmployeeDetailsFormatter, CreateEmployeeValidations } from "../utils/createEmployeeForm";

type HookReturn = { createEmployeeForm: UseFormReturn<CreateEmployeeRequestModel> };

const useCreateEmployeeForm = (): HookReturn => {
    const { state } = useDashboardEmployeeStore();
    const createEmployeeForm = useForm<CreateEmployeeRequestModel>({
        defaultValues: CreateEmployeeDefaultValues,
        values: CreateEmployeeDetailsFormatter(state.createEmployeeReqDetails),
        resolver: CreateEmployeeValidations as Resolver<CreateEmployeeRequestModel>,
    });

    return { createEmployeeForm };
};

export default useCreateEmployeeForm;
