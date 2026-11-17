import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    EmployeeProfileDefaultValues,
    EmployeeProfileValidations,
    mapEmployeeResponseToForm,
    type EmployeeProfileFormValues,
} from "../utils/form";
import useEmployeeProfile from "./useEmployeeProfile";

export const useEmployeeProfileForm = () => {
    const {
        employeeProfileData,
        isLoading,
        isSaving,
        fetchEmployeeProfile,
        updateEmployeeProfile,
    } = useEmployeeProfile();

    const form = useForm<EmployeeProfileFormValues>({
        resolver: EmployeeProfileValidations,
        defaultValues: EmployeeProfileDefaultValues,
        mode: "onBlur",
    });

    useEffect(() => {
        fetchEmployeeProfile();
    }, [fetchEmployeeProfile]);

    useEffect(() => {
        if (employeeProfileData) {
            form.reset(mapEmployeeResponseToForm(employeeProfileData));
        }
    }, [employeeProfileData, form]);

    const onSubmit = form.handleSubmit(async (data: EmployeeProfileFormValues) => {
        await updateEmployeeProfile(data, () => {
            form.setValue("new_password", "");
        });
    });

    return {
        form,
        employeeProfileData,
        isLoading,
        isSaving,
        onSubmit,
        reloadProfile: fetchEmployeeProfile,
    };
};

export default useEmployeeProfileForm;

