import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import useDashboardClassStore from "../../store";
import type { UpdateClassRequestModel } from "@api/class/model";
import { UpdateClassDetailsFormatter, UpdateClassValidations } from "../utils/updateClassForm";

type HookReturn = { updateClassForm: UseFormReturn<UpdateClassRequestModel> };

const useUpdateClassForm = (): HookReturn => {
    const { state } = useDashboardClassStore();
    const updateClassForm = useForm<UpdateClassRequestModel>({
        values: UpdateClassDetailsFormatter(state.updateClassReqDetails),
        resolver: UpdateClassValidations as Resolver<UpdateClassRequestModel>,
    });

    return { updateClassForm };
};

export default useUpdateClassForm;
