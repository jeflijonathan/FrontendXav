import StudentService from "@api/student/service";
import RoleService from "@api/role/service";
import type { CreateStudentRequestModel } from "@api/student/model";
import { useFormContext } from "react-hook-form";
import useDashboardStudentStore from "@pages/dashboardStudent/store";
import useStudentList from "@pages/dashboardStudent/List/hook/useStudentList";
import { snackbar } from "@utils/snackbar";
import { filterStudentMapper } from "@pages/dashboardStudent/List/utils/FilterStudentMapper";
import type { FilterParams } from "@common/types";
import { validateAndUploadFile } from "@utils/uploadFile";

const useCreateStudent = (onClose?: () => void) => {
    const { handleSubmit, reset } = useFormContext<CreateStudentRequestModel>();
    const { state, setState } = useDashboardStudentStore();
    const { fetchStudentList } = useStudentList();
    const service = new StudentService();
    const roleService = new RoleService();

    const FetchUserRole = (params?: FilterParams) => {
        return roleService.getAll(
            {
                onSuccess: (data) => {
                    // Filter: hanya 2 pilihan: 'siswa' dan 'pengurus_kelas'
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

    const handleCreate = () => {
        return handleSubmit(async (payload) => {
            setState((prev) => ({ ...prev, isCreateLoading: true }));

            let uploadedProfileUrl: string | undefined = undefined;
            if (state.profileFile) {
                const uploadResult = await validateAndUploadFile(state.profileFile, service.service);
                if (!uploadResult.success) {
                    setState((prev) => ({ ...prev, isCreateLoading: false }));
                    snackbar.error(uploadResult.message || "Gagal mengunggah foto profil");
                    return;
                }
                uploadedProfileUrl = uploadResult.id;
            }

            const cleanPayload: any = { ...payload };

            if (uploadedProfileUrl) {
                cleanPayload.profile_url = uploadedProfileUrl;
            }

            // Hapus semua field yang berisi string kosong "" atau null agar tidak gagal validasi backend (terutama birth_date, email, nomor telepon dsb)
            Object.keys(cleanPayload).forEach((key) => {
                const val = cleanPayload[key];
                if (val === "" || val === null || val === undefined) {
                    delete cleanPayload[key];
                }
            });

            // Jika role_ids kosong, defaultkan ke role 'siswa'
            if (!cleanPayload.role_ids || cleanPayload.role_ids.length === 0) {
                const siswaRole = state.roleStudent.find((r) => r.name === "siswa");
                if (siswaRole) cleanPayload.role_ids = [siswaRole.id];
            }

            service.create(cleanPayload, {
                onSuccess: () => {
                    setState((prev) => ({
                        ...prev,
                        isCreateLoading: false,
                        profileFile: null,
                    }));
                    fetchStudentList(filterStudentMapper(state));
                    snackbar.success("Siswa dan data orang tua berhasil ditambahkan");
                    reset();
                    if (onClose) onClose();
                },
                onError: (err: any) => {
                    setState((prev) => ({ ...prev, isCreateLoading: false }));
                    const errorMsg =
                        typeof err === "string"
                            ? err
                            : err?.message ||
                              err?.detail?.message ||
                              (typeof err?.detail === "string" ? err.detail : null) ||
                              "Gagal menambahkan siswa";
                    snackbar.error(errorMsg);
                },
            });
        })();
    };

    return { handleCreate, FetchUserRole };
};

export default useCreateStudent;
