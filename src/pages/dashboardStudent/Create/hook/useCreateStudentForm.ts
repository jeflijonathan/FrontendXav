import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import useDashboardStudentStore from "../../store";
import type { CreateStudentRequestModel } from "@api/student/model";
import { CreateStudentDefaultValues, CreateStudentDetailsFormatter, CreateStudentValidations } from "../utils/createStudentForm";

type HookReturn = { createStudentForm: UseFormReturn<CreateStudentRequestModel> };

const useCreateStudentForm = (): HookReturn => {
    const { state } = useDashboardStudentStore();
    const createStudentForm = useForm<CreateStudentRequestModel>({
        defaultValues: CreateStudentDefaultValues,
        values: CreateStudentDetailsFormatter(state.createStudentReqDetails),
        resolver: CreateStudentValidations as Resolver<CreateStudentRequestModel>,
    });
    return { createStudentForm };
};

export default useCreateStudentForm;
