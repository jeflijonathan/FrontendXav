import useDashboardEffectiveWeekStore from "../../store";
import EffectiveWeekService from "@api/effectiveweek/service";
import { useSnackbar } from "notistack";
import { filterMapper } from "@common/utils/filterMapper";

const useEffectiveWeekList = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardEffectiveWeekStore();

    const fetchList = async () => {
        setState((prev) => ({ ...prev, isLoading: true }));
        const filterParams = filterMapper(state);
        await new EffectiveWeekService().getAll({ onSuccess: (res: any) => {
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
                        enqueueSnackbar(err.message || "Failed to fetch effective weeks", { variant: "error" });
                        setState((prev) => ({ ...prev, isLoading: false }));
                    } }, { params: filterParams });
    };

    const tableHeader = [
        { label: "Subject (Mata Pelajaran)", key: "subject" },
        { label: "Alokasi Intrakurikuler", key: "Alokasi_Intrakurikuler" },
        { label: "Alokasi Kokurikuler", key: "Alokasi_Kokurikuler" },
        { label: "Created At", key: "created_at" },
        { label: "Action", key: "action" },
    ];

    return {
        tableData: state.data,
        tableHeader,
        fetchList,
    };
};

export default useEffectiveWeekList;
