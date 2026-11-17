import { useState, useCallback } from "react";
import EmployeeService from "@api/employee/service";
import useDashboardProfileStore from "@pages/dashboardProfile/store";
import { snackbar } from "@utils/snackbar";
import type { EmployeeProfileFormValues } from "../utils/form";
import type { UpdateEmployeeRequestModel } from "@api/employee/model";

const employeeService = new EmployeeService();

export const useEmployeeProfile = () => {
    const { state, setState } = useDashboardProfileStore();
    const [isSaving, setIsSaving] = useState(false);

    const fetchEmployeeProfile = useCallback(async () => {
        setState((prev) => ({
            ...prev,
            isLoading: true,
            error: [],
        }));

        await employeeService.getMyProfile({
            onSuccess: (data) => {
                setState((prev) => ({
                    ...prev,
                    employeeProfileData: data,
                    error: [],
                }));
            },
            onError: (err) => {
                const message = err.message || "Gagal memuat data profil pegawai";
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

    const updateEmployeeProfile = async (
        payload: EmployeeProfileFormValues,
        onSuccessCallback?: () => void
    ) => {
        setIsSaving(true);

        const updatePayload: UpdateEmployeeRequestModel = {
            first_name: payload.first_name.trim(),
            last_name: payload.last_name.trim(),
            email: payload.email.trim(),
            password: payload.new_password?.trim() ? payload.new_password.trim() : undefined,
            detail: {
                gender: payload.gender,
                phone_number: payload.phone_number?.trim() || null,
                birth_place: payload.birth_place?.trim() || null,
                birth_date: payload.birth_date || null,
                address: payload.address?.trim() || null,
                RT: payload.RT?.trim() || null,
                RW: payload.RW?.trim() || null,
                zip_code: payload.zip_code?.trim() || null,
                description: payload.description?.trim() || null,
            },
        };

        await employeeService.updateMyProfile(updatePayload, {
            onSuccess: (data) => {
                setState((prev) => ({
                    ...prev,
                    employeeProfileData: data,
                }));
                snackbar.success("Profil pegawai berhasil diperbarui!");
                if (onSuccessCallback) {
                    onSuccessCallback();
                }
            },
            onError: (err) => {
                const msg = err.message || "Gagal memperbarui profil pegawai";
                snackbar.error(msg);
            },
            onFullfilled: () => {
                setIsSaving(false);
            },
        });
    };

    return {
        employeeProfileData: state.employeeProfileData,
        isLoading: state.isLoading,
        isSaving,
        error: state.error,
        fetchEmployeeProfile,
        updateEmployeeProfile,
    };
};

export default useEmployeeProfile;

