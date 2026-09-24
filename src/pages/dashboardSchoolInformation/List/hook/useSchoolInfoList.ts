import useDashboardSchoolInformationStore from "../../store";
import SchoolInformationService from "@api/schoolinformation/service";
import { useSnackbar } from "notistack";
import { filterMapper } from "@common/utils/filterMapper";

const useSchoolInfoList = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardSchoolInformationStore();

    const fetchList = async () => {
        setState((prev) => ({ ...prev, isLoading: true }));
        const filterParams = filterMapper(state);
        await new SchoolInformationService().getAll({ onSuccess: (res: any) => {
                        setState((prev) => ({
                            ...prev,
                            data: res.data || [],
                            pagination: {
                                total_data: res.pagination?.total_data || 0,
                                total_pages: res.pagination?.total_pages || 1,
                                page: res.pagination?.page || 1,
                                limit: res.pagination?.limit || 10,
                            },
                            isLoading: false,
                        }));
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to fetch school informations", { variant: "error" });
                        setState((prev) => ({ ...prev, isLoading: false }));
                    } }, { params: filterParams });
    };

    const tableHeader = [
        { label: "School Name", key: "name_school" },
        { label: "Periode", key: "periode" },
        { label: "NPSN", key: "NPSN" },
        { label: "Headmaster", key: "headmaster" },
        { label: "Status", key: "status" },
        { label: "Created At", key: "created_at" },
        { label: "Action", key: "action" },
    ];

    return {
        tableData: state.data,
        tableHeader,
        fetchList,
    };
};

export default useSchoolInfoList;
