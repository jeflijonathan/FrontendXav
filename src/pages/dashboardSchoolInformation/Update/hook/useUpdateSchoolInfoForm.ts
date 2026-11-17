import { useMemo } from "react";
import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import useDashboardSchoolInformationStore from "../../store";
import type { UpdateSchoolInformationRequest } from "@api/schoolinformation/model";
import { UpdateSchoolInfoDetailsFormatter, UpdateSchoolInformationReqDefaultValues, UpdateSchoolInfoValidations } from "../utils/updateSchoolInfoForm";

type HookReturn = {
    updateSchoolInfoReqForm: UseFormReturn<UpdateSchoolInformationRequest>;
};

const useUpdateSchoolInfoForm = (): HookReturn => {
    const { state } = useDashboardSchoolInformationStore();

    const formValues = useMemo(() => {
        return state.updateSchoolInfoReqDetails
            ? UpdateSchoolInfoDetailsFormatter(state.updateSchoolInfoReqDetails)
            : UpdateSchoolInformationReqDefaultValues;
    }, [state.updateSchoolInfoReqDetails]);

    const updateSchoolInfoReqForm = useForm<UpdateSchoolInformationRequest>({
        defaultValues: UpdateSchoolInformationReqDefaultValues,
        values: formValues,
        resolver: UpdateSchoolInfoValidations as Resolver<UpdateSchoolInformationRequest>,
    });

    return {
        updateSchoolInfoReqForm,
    };
};
export default useUpdateSchoolInfoForm;
