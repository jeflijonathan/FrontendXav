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
        return handleSubmit(async (payload) => {
            setState(prev => ({ ...prev, isUpdateLoading: true }));
            const data: UpdateSchoolInformationRequest = {
                id_headmaster: payload.id_headmaster,
                name_school: payload.name_school,
                NPSN: payload.NPSN,
                alamat: payload.alamat,
                status: payload.status,
                periode: payload.periode,
            };

            service.update(id, data, {
                onSuccess: () => {
                    setState(prev => ({ ...prev, isUpdateLoading: false }));
                    fetchSchoolInfoList(filterSchoolInformationMapper(state));
                    snackbar.success("School information updated successfully");
                    onSuccessCallback?.();
                },
                onError: (err: any) => {
                    setState(prev => ({ ...prev, isUpdateLoading: false }));
                    snackbar.error(err.message || "Failed to update school information");
                }
            });
        })();
    };

    return { fetchDetail, handleUpdate };
};

export default useUpdateSchoolInfo;
