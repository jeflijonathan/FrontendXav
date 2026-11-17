import SchoolInformationService from "@api/schoolinformation/service";
import { type UpdateSchoolInformationRequest } from "@api/schoolinformation/model";
import { useFormContext } from "react-hook-form";
import useDashboardSchoolInformationStore from "@pages/dashboardSchoolInformation/store";
import useSchoolInfoList from "@pages/dashboardSchoolInformation/List/hook/useSchoolInfoList";
import { snackbar } from "@utils/snackbar";
import { filterSchoolInformationMapper } from "@pages/dashboardSchoolInformation/List/utils/FilterSchoolInformationMapper";

const useUpdateSchoolInfo = () => {
    const { handleSubmit } = useFormContext<UpdateSchoolInformationRequest>();
    const { state, setState } = useDashboardSchoolInformationStore();
    const { fetchSchoolInfoList } = useSchoolInfoList();
    const service = new SchoolInformationService();

    const fetchDetail = async (id: string) => {
        setState(prev => ({ ...prev, isDetailLoading: true }));
        await service.getById(id, {
            onSuccess: (res: any) => {
                setState(prev => ({
                    ...prev,
                    updateSchoolInfoReqDetails: res,
                    isDetailLoading: false,
                }));
            },
            onError: (err: any) => {
                setState(prev => ({ ...prev, isDetailLoading: false }));
                snackbar.error(err.message || "Failed to fetch school information details");
            }
        });
    };

    const handleUpdate = (id: string, onSuccessCallback?: () => void) => {
        return handleSubmit(
            async (payload) => {
                setState(prev => ({ ...prev, isUpdateLoading: true }));
                const data: UpdateSchoolInformationRequest = {
                    id_headmaster: payload.id_headmaster,
                    name_school: payload.name_school,
                    NPSN: payload.NPSN,
                    alamat: payload.alamat,
                    status: typeof payload.status === "string" ? payload.status === "true" : Boolean(payload.status),
                    periode: payload.periode,
                    work_days: payload.work_days ? Number(payload.work_days) : 5,
                    lesson_duration: payload.lesson_duration ? Number(payload.lesson_duration) : 45,
                };

                service.update(id, data, {
                    onSuccess: () => {
                        setState(prev => ({
                            ...prev,
                            isUpdateLoading: false,
                            updateSchoolInfoReqDetails: null,
                        }));
                        fetchSchoolInfoList(filterSchoolInformationMapper(useDashboardSchoolInformationStore.getState().state));
                        snackbar.success("Data sekolah berhasil diperbarui");
                        onSuccessCallback?.();
                    },
                    onError: (err: any) => {
                        setState(prev => ({ ...prev, isUpdateLoading: false }));
                        snackbar.error(err.message || "Gagal memperbarui data sekolah");
                    }
                });
            },
            (errors) => {
                console.error("Form validation errors on update:", errors);
                const firstError = Object.values(errors)[0]?.message;
                snackbar.error((firstError as string) || "Mohon periksa kembali kolom formulir yang belum lengkap.");
            }
        )();
    };

    return { fetchDetail, handleUpdate };
};

export default useUpdateSchoolInfo;
