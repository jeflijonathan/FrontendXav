import SchoolInformationService from "@api/schoolinformation/service";
import { type CreateSchoolInformationRequest } from "@api/schoolinformation/model";
import { useFormContext } from "react-hook-form";
import useDashboardSchoolInformationStore from "@pages/dashboardSchoolInformation/store";
import useSchoolInfoList from "@pages/dashboardSchoolInformation/List/hook/useSchoolInfoList";
import { snackbar } from "@utils/snackbar";
import { filterSchoolInformationMapper } from "@pages/dashboardSchoolInformation/List/utils/FilterSchoolInformationMapper";

const useCreateSchoolInfo = () => {
    const { handleSubmit } = useFormContext<CreateSchoolInformationRequest>();
    const { state, setState } = useDashboardSchoolInformationStore();
    const { fetchSchoolInfoList } = useSchoolInfoList();
    const service = new SchoolInformationService();

    const handleCreate = (onSuccessCallback?: () => void) => {
        return handleSubmit(
            async (payload) => {
                setState(prev => ({ ...prev, isCreateLoading: true }));
                const data: CreateSchoolInformationRequest = {
                    id_headmaster: payload.id_headmaster,
                    name_school: payload.name_school,
                    NPSN: payload.NPSN,
                    alamat: payload.alamat,
                    status: typeof payload.status === "string" ? payload.status === "true" : Boolean(payload.status),
                    periode: payload.periode,
                    work_days: payload.work_days ? Number(payload.work_days) : 5,
                    lesson_duration: payload.lesson_duration ? Number(payload.lesson_duration) : 45,
                };

                service.create(data, {
                    onSuccess: () => {
                        setState(prev => ({ ...prev, isCreateLoading: false }));
                        fetchSchoolInfoList(filterSchoolInformationMapper(useDashboardSchoolInformationStore.getState().state));
                        snackbar.success("Informasi sekolah berhasil ditambahkan");
                        onSuccessCallback?.();
                    },
                    onError: (err: any) => {
                        setState(prev => ({ ...prev, isCreateLoading: false }));
                        snackbar.error(err.message || "Gagal menambahkan informasi sekolah");
                    }
                });
            },
            (errors) => {
                console.error("Form validation errors on create:", errors);
                const firstError = Object.values(errors)[0]?.message;
                snackbar.error((firstError as string) || "Mohon lengkapi formulir dengan benar.");
            }
        )();
    };

    return { handleCreate };
};

export default useCreateSchoolInfo;
