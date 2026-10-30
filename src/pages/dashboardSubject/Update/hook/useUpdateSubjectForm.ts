/**
 * useUpdateSubjectForm — Framework Logic Hook
 *
 * Sets up react-hook-form initialized with current subject details.
 *
 * Layer: Framework Logic
 */
import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { UpdateSubjectRequestModel } from "@api/subject/model";
import useDashboardSubjectStore from "../../store";
import {
    UpdateSubjectSchema,
    formatSubjectForUpdate,
} from "../utils/updateSubjectForm";

type HookReturn = {
    updateSubjectForm: UseFormReturn<UpdateSubjectRequestModel>;
};

const useUpdateSubjectForm = (): HookReturn => {
    const { state } = useDashboardSubjectStore();

    const updateSubjectForm = useForm<UpdateSubjectRequestModel>({
        values: formatSubjectForUpdate(state.updateSubjectReqDetails),
        resolver: yupResolver(UpdateSubjectSchema) as Resolver<UpdateSubjectRequestModel>,
    });

    return { updateSubjectForm };
};

export default useUpdateSubjectForm;

