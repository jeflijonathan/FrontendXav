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

    const handleCreate = () => {
        return handleSubmit(async (payload) => {
            setState(prev => ({ ...prev, isCreateLoading: true }))
            const data: CreateSchoolInformationRequest = {
                id_headmaster: payload.id_headmaster,
                name_school: payload.name_school,
                NPSN: payload.NPSN,
                alamat: payload.alamat,
                status: payload.status,
                periode: payload.periode,
            };

            service.create(data, {
                onSuccess: () => {
                    setState(prev => ({ ...prev, isCreateLoading: false }))
                    fetchSchoolInfoList(filterSchoolInformationMapper(state));
                    snackbar.success("School information created successfully");
                }, onError: (err: any) => {
                    setState(prev => ({ ...prev, isCreateLoading: false }))
                    snackbar.error(err.message || "Failed to create school information");
                }
            });
        })();
    };

    return { handleCreate };
};

export default useCreateSchoolInfo;
