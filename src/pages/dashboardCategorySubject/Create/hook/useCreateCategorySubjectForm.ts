/**
 * useCreateCategorySubjectForm — Framework Logic Hook
 *
 * Sets up react-hook-form with Yup resolver.
 *
 * Layer: Framework Logic
 */
import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { CreateCategorySubjectRequestModel } from "@api/categorysubject/model";
import {
    CreateCategorySubjectSchema,
    defaultCreateCategorySubjectValues,
} from "../utils/createCategorySubjectForm";

type HookReturn = {
    createCategorySubjectForm: UseFormReturn<CreateCategorySubjectRequestModel>;
};

const useCreateCategorySubjectForm = (): HookReturn => {
    const createCategorySubjectForm = useForm<CreateCategorySubjectRequestModel>({
        defaultValues: defaultCreateCategorySubjectValues,
        resolver: yupResolver(CreateCategorySubjectSchema) as Resolver<CreateCategorySubjectRequestModel>,
    });

    return { createCategorySubjectForm };
};

export default useCreateCategorySubjectForm;

