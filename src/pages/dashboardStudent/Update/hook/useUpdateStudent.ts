import StudentService from "@api/student/service";
import RoleService from "@api/role/service";
import type { UpdateStudentRequestModel } from "@api/student/model";
import { useFormContext } from "react-hook-form";
import useDashboardStudentStore from "@pages/dashboardStudent/store";
import useStudentList from "@pages/dashboardStudent/List/hook/useStudentList";
import { snackbar } from "@utils/snackbar";
import { filterStudentMapper } from "@pages/dashboardStudent/List/utils/FilterStudentMapper";
import type { FilterParams } from "@common/types";
import { validateAndUploadFile } from "@utils/uploadFile";

const useUpdateStudent = (onClose?: () => void) => {
    const { handleSubmit } = useFormContext<UpdateStudentRequestModel>();
    const { state, setState } = useDashboardStudentStore();
    const { fetchStudentList } = useStudentList();
    const service = new StudentService();
    const roleService = new RoleService();

    const FetchUserRole = (params?: FilterParams) => {
        return roleService.getAll(
            {
                onSuccess: (data) => {
                    const filtered = (data || []).filter(
                        (r: any) => r.name === "siswa" || r.name === "pengurus_kelas"
                    );
                    setState((prev) => ({ ...prev, roleStudent: filtered }));
                },
                onError: (err: any) => {
                    console.log(err);
                },
            },
            params as any
        );
    };

    const fetchDetail = async (id: string) => {
        setState((prev) => ({ ...prev, isLoading: true, profileFile: null }));
        try {
            await service.getById(id, {
                onSuccess: (res) => {
                    setState((prev) => ({
                        ...prev,
                        updateStudentReqDetails: res,
                        isLoading: false,
                    }));
                },
                onError: (err: any) => {
                    setState((prev) => ({ ...prev, isLoading: false }));
                    snackbar.error(err.message || "Failed to fetch student details");
                },
            });
        } catch (error) {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    };

    const handleUpdate = (id: string) => {
        return handleSubmit(async (payload) => {
            setState((prev) => ({ ...prev, isUpdateLoading: true }));

            let uploadedProfileUrl: string | undefined = undefined;
            if (state.profileFile) {
                const uploadResult = await validateAndUploadFile(state.profileFile, service.service);
                if (!uploadResult.success) {
                    setState((prev) => ({ ...prev, isUpdateLoading: false }));
                    snackbar.error(uploadResult.message || "Gagal mengunggah foto profil");
                    return;
                }
                uploadedProfileUrl = uploadResult.id;
            }

            const cleanPayload: any = { ...payload };

            if (uploadedProfileUrl) {
                cleanPayload.profile_url = uploadedProfileUrl;
            }

            // Hapus field kosong yang tidak perlu dikirim
            if (!cleanPayload.password) delete cleanPayload.password;
            if (!cleanPayload.phone_number) delete cleanPayload.phone_number;
            if (!cleanPayload.parent_email) delete cleanPayload.parent_email;
            if (!cleanPayload.mother_email) delete cleanPayload.mother_email;
            if (!cleanPayload.parent_phone_number) delete cleanPayload.parent_phone_number;
            if (!cleanPayload.mother_phone_number) delete cleanPayload.mother_phone_number;
            if (!cleanPayload.parent_nik) delete cleanPayload.parent_nik;
            if (!cleanPayload.mother_nik) delete cleanPayload.mother_nik;

            service.update(id, cleanPayload, {
                onSuccess: () => {
                    setState((prev) => ({
                        ...prev,
                        isUpdateLoading: false,
                        profileFile: null,
                    }));
                    fetchStudentList(filterStudentMapper(state));
                    snackbar.success("Data siswa berhasil diperbarui");
                    if (onClose) onClose();
                },
                onError: (err: any) => {
                    setState((prev) => ({ ...prev, isUpdateLoading: false }));
                    const errorMsg =
                        typeof err === "string"
                            ? err
                            : err?.message ||
                              err?.detail?.message ||
                              (typeof err?.detail === "string" ? err.detail : null) ||
                              "Failed to update student";
                    snackbar.error(errorMsg);
                },
            });
        })();
    };

    return { handleUpdate, FetchUserRole, fetchDetail };
};

export default useUpdateStudent;
