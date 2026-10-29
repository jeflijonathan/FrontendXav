import { useEffect } from "react";
import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import { useDashboardMajorStore } from "../../store";
import type { UpdateMajorRequestModel } from "@api/major/model";
import { UpdateMajorDetailsFormatter, UpdateMajorValidations } from "../utils/updateMajorForm";

type HookReturn = {
    updateMajorForm: UseFormReturn<UpdateMajorRequestModel>;
};

const useUpdateMajorForm = (): HookReturn => {
    const { state } = useDashboardMajorStore();
    const updateMajorForm = useForm<UpdateMajorRequestModel>({
        defaultValues: { name: "", status: true },
        values: UpdateMajorDetailsFormatter(state.updateMajorReqDetails),
        resolver: UpdateMajorValidations as Resolver<UpdateMajorRequestModel>,
    });

    useEffect(() => {
        if (state.updateMajorReqDetails) {
            updateMajorForm.reset({
                name: state.updateMajorReqDetails.name || "",
                status: state.updateMajorReqDetails.status ?? true,
            });
        }
    }, [state.updateMajorReqDetails, updateMajorForm]);

    return { updateMajorForm };
};

export default useUpdateMajorForm;
