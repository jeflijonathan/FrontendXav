import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { UpdateStudentProfileRequestType } from "@api/student/model";
import {
    StudentProfileDefaultValues,
    UpdateProfileStudentValidations,
    mapStudentResponseToForm,
} from "../utils/form";
import useStudentProfile from "./useStudentProfile";

export const useStudentProfileForm = () => {
    const {
        studentProfileData,
        isLoading,
        isSaving,
        fetchStudentProfile,
        updateStudentProfile,
    } = useStudentProfile();

    const form = useForm<UpdateStudentProfileRequestType>({
        resolver: UpdateProfileStudentValidations,
        defaultValues: StudentProfileDefaultValues,
        mode: "onBlur",
    });

    useEffect(() => {
        fetchStudentProfile();
    }, [fetchStudentProfile]);

    useEffect(() => {
        if (studentProfileData) {
            form.reset(mapStudentResponseToForm(studentProfileData));
        }
    }, [studentProfileData, form]);

    const onSubmit = form.handleSubmit(async (data: UpdateStudentProfileRequestType) => {
        await updateStudentProfile(data, () => {
            // Bersihkan field password setelah berhasil update
            form.setValue("new_password", "");
        });
    });

    return {
        form,
        studentProfileData,
        isLoading,
        isSaving,
        onSubmit,
        reloadProfile: fetchStudentProfile,
    };
};

export default useStudentProfileForm;
