/**
 * useCreateSubjectForm — Framework Logic Hook
 *
 * Sets up react-hook-form with Yup resolver.
 *
 * Layer: Framework Logic
 */
import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { CreateSubjectRequestModel } from "@api/subject/model";
import {
    CreateSubjectSchema,
    defaultCreateSubjectValues,
} from "../utils/createSubjectForm";

type HookReturn = {
    createSubjectForm: UseFormReturn<CreateSubjectRequestModel>;
};

const useCreateSubjectForm = (): HookReturn => {
    const createSubjectForm = useForm<CreateSubjectRequestModel>({
        defaultValues: defaultCreateSubjectValues,
        resolver: yupResolver(CreateSubjectSchema) as Resolver<CreateSubjectRequestModel>,
    });

    return { createSubjectForm };
};

export default useCreateSubjectForm;

