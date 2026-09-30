import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import useCreateSchoolInfoForm from "../../store"
import type { CreateSchoolInformationRequest } from "@api/schoolinformation/model";
import { CreateSchoolInfoDetailsFormatter, CreateSchoolInformationReqDefaultValues, CreateSchoolInfoValidations } from "../utils/createSchoolInfoForm";

type HookReturn = {
    createSchoolInfoReqForm: UseFormReturn<CreateSchoolInformationRequest>;
};

const useCreateSchoolInfo = (): HookReturn => {
    const { state } = useCreateSchoolInfoForm();
    const createSchoolInfoReqForm = useForm<CreateSchoolInformationRequest>({
        defaultValues: CreateSchoolInformationReqDefaultValues,
        values: CreateSchoolInfoDetailsFormatter(state.createSchoolInfoReqDetails),
        resolver: CreateSchoolInfoValidations as Resolver<CreateSchoolInformationRequest>,
    });

    return {
        createSchoolInfoReqForm,
    };
}
export default useCreateSchoolInfo;