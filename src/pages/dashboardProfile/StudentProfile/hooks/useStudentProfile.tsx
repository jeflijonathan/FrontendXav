import { useState, useCallback } from "react";
import StudentService from "@api/student/service";
import useDashboardProfileStore from "@pages/dashboardProfile/store";
import { snackbar } from "@utils/snackbar";
import type { UpdateStudentProfileRequestType } from "@api/student/model";
import type { UpdateStudentRequestModel } from "@api/student/model";

const studentService = new StudentService();

export const useStudentProfile = () => {
    const { state, setState } = useDashboardProfileStore();
    const [isSaving, setIsSaving] = useState(false);

    const fetchStudentProfile = useCallback(async () => {
        setState((prev) => ({
            ...prev,
            isLoading: true,
            error: [],
        }));

        await studentService.getMyProfile({
            onSuccess: (data) => {
                setState((prev) => ({
                    ...prev,
                    studentProfileData: data,
                    error: [],
                }));
            },
            onError: (err) => {
                const message = err.message || "Gagal memuat profil siswa";
                setState((prev) => ({
                    ...prev,
                    error: [message],
                }));
                snackbar.error(message);
            },
            onFullfilled: () => {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                }));
            },
        });
    }, [setState]);

    const updateStudentProfile = async (
        payload: UpdateStudentProfileRequestType,
        onSuccessCallback?: () => void
    ) => {
        setIsSaving(true);

        const updatePayload: UpdateStudentRequestModel = {
            first_name: payload.first_name?.trim(),
            last_name: payload.last_name?.trim(),
            nik: payload.NIK?.trim(),
            email: payload.email?.trim() || undefined,
            password: payload.new_password?.trim() ? payload.new_password.trim() : undefined,
            phone_number: payload.phone_number?.trim() || undefined,
            gender: payload.gender,
            birth_place: payload.birth_place?.trim() || undefined,
            birth_date: payload.birth_date || undefined,
            address: payload.address?.trim() || undefined,
            rt: payload.rt?.trim() || undefined,
            rw: payload.rw?.trim() || undefined,
            zip_code: payload.zip_code?.trim() || undefined,

            parent_name: payload.parent_name?.trim() || undefined,
            parent_nik: payload.parent_nik?.trim() || undefined,
            parent_phone_number: payload.parent_phone_number?.trim() || undefined,
            parent_email: payload.parent_email?.trim() || undefined,
            parent_occupation: payload.parent_occupation?.trim() || undefined,

            mother_name: payload.mother_name?.trim() || undefined,
            mother_nik: payload.mother_nik?.trim() || undefined,
            mother_phone_number: payload.mother_phone_number?.trim() || undefined,
            mother_email: payload.mother_email?.trim() || undefined,
            mother_occupation: payload.mother_occupation?.trim() || undefined,
        };

        await studentService.updateMyProfile(updatePayload, {
            onSuccess: (data) => {
                setState((prev) => ({
                    ...prev,
                    studentProfileData: data,
                }));
                snackbar.success("Profil siswa berhasil diperbarui!");
                if (onSuccessCallback) {
                    onSuccessCallback();
                }
            },
            onError: (err) => {
                const msg = err.message || "Gagal memperbarui profil siswa";
                snackbar.error(msg);
            },
            onFullfilled: () => {
                setIsSaving(false);
            },
        });
    };

    return {
        studentProfileData: state.studentProfileData,
        isLoading: state.isLoading,
        isSaving,
        error: state.error,
        fetchStudentProfile,
        updateStudentProfile,
    };
};

export default useStudentProfile;
