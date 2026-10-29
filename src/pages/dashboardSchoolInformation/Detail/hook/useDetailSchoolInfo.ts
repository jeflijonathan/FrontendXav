import { useState } from "react";
import SchoolInformationService from "@api/schoolinformation/service";
import type { SchoolInformationResponseModel } from "@api/schoolinformation/model";
import { snackbar } from "@utils/snackbar";
import useDashboardSchoolInformationStore from "../../store";

const useDetailSchoolInfo = () => {
    const [detail, setDetail] = useState<SchoolInformationResponseModel | null>(null);
    const { state, setState } = useDashboardSchoolInformationStore();
    const service = new SchoolInformationService();

    const fetchDetail = async (id: string) => {
        setState((prev) => ({ ...prev, isDetailLoading: true }));
        await service.getById(id, {
            onSuccess: (res: any) => {
                setDetail(res.data || res);
            },
            onError: (err: any) => {
                snackbar.error(err.message || "Failed to fetch school information details");
            },
            onFullfilled: () => {
                setState((prev) => ({ ...prev, isDetailLoading: false }));
            }
        });
    };

    return { detail, isLoading: state.isDetailLoading, fetchDetail };
};

export default useDetailSchoolInfo;
