import useDashboardScheduleStore from "../../store";
import ScheduleService from "@api/schedule/service";
import { useSnackbar } from "notistack";
import { filterMapper } from "@common/utils/filterMapper";

const useScheduleList = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardScheduleStore();

    const fetchList = async () => {
        setState((prev) => ({ ...prev, isLoading: true }));
        const filterParams = filterMapper(state);
        await new ScheduleService().getAll({ onSuccess: (res: any) => {
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
                        enqueueSnackbar(err.message || "Failed to fetch schedules", { variant: "error" });
                        setState((prev) => ({ ...prev, isLoading: false }));
                    } }, { params: filterParams });
    };

    const tableHeader = [
        { label: "Class (Kelas)", key: "class" },
        { label: "Duty Teacher (Guru Piket)", key: "duty_teacher" },
        { label: "Category Subject", key: "category_subject" },
        { label: "Schedule Time Slot", key: "schendule_time" },
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

export default useScheduleList;
