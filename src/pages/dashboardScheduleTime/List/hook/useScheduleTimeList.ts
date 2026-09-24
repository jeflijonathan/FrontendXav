import useDashboardScheduleTimeStore from "../../store";
import { ScheduleTimeService } from "@api/schedule/service";
import { useSnackbar } from "notistack";
import { filterMapper } from "@common/utils/filterMapper";

const useScheduleTimeList = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardScheduleTimeStore();

    const fetchList = async () => {
        setState((prev) => ({ ...prev, isLoading: true }));
        const filterParams = filterMapper(state);
        await new ScheduleTimeService().getAll({ onSuccess: (res: any) => {
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
                        enqueueSnackbar(err.message || "Failed to fetch schedule times", { variant: "error" });
                        setState((prev) => ({ ...prev, isLoading: false }));
                    } }, { params: filterParams });
    };

    const tableHeader = [
        { label: "Day (Hari)", key: "hari" },
        { label: "Start Time (Jam Awal)", key: "jam_awal" },
        { label: "End Time (Jam Akhir)", key: "jam_akhir" },
        { label: "Category", key: "category" },
        { label: "Created At", key: "created_at" },
        { label: "Action", key: "action" },
    ];

    return {
        tableData: state.data,
        tableHeader,
        fetchList,
    };
};

export default useScheduleTimeList;
