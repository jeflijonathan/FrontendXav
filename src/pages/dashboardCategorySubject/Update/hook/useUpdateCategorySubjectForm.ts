/**
 * useUpdateCategorySubjectForm — Framework Logic Hook
 *
 * Sets up react-hook-form initialized with current category details.
 *
 * Layer: Framework Logic
 */
import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { UpdateCategorySubjectRequestModel } from "@api/categorysubject/model";
import useDashboardCategorySubjectStore from "../../store";
import {
    UpdateCategorySubjectSchema,
    formatCategorySubjectForUpdate,
} from "../utils/updateCategorySubjectForm";

type HookReturn = {
    updateCategorySubjectForm: UseFormReturn<UpdateCategorySubjectRequestModel>;
};

const useUpdateCategorySubjectForm = (): HookReturn => {
    const { state } = useDashboardCategorySubjectStore();

    const updateCategorySubjectForm = useForm<UpdateCategorySubjectRequestModel>({
        values: formatCategorySubjectForUpdate(state.updateCategorySubjectReqDetails),
        resolver: yupResolver(UpdateCategorySubjectSchema) as Resolver<UpdateCategorySubjectRequestModel>,
    });

    return { updateCategorySubjectForm };
};

export default useUpdateCategorySubjectForm;

