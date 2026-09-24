import useDashboardMajorStore from "../../store";
import MajorService from "@api/major/service";
import { type MajorResponseModel } from "@api/major/model";
import { useSnackbar } from "notistack";

const useMajorList = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardMajorStore();

    const fetchList = async () => {
        setState((prev) => ({ ...prev, isLoading: true }));
        const svc = new MajorService();
        await svc.getAll(
            {
                onSuccess: (res: any) => {
                    setState((prev) => ({
                        ...prev,
                        data: res.data || [],
                        pagination: {
                            total_data: res.pagination?.total_items || 0,
                            total_pages: res.pagination?.total_pages || 1,
                            page: res.pagination?.page || 1,
                            limit: res.pagination?.limit || 10,
                        },
                        isLoading: false,
                    }));
                },
                onError: (err: any) => {
                    enqueueSnackbar(typeof err === 'string' ? err : "Failed to fetch majors", { variant: "error" });
                    setState((prev) => ({ ...prev, isLoading: false }));
                },
            },
            { params: { page: state.filters.page, limit: state.filters.limit, search: state.filters.search } }
        );
    };

    const tableHeader = [
        { label: "Major Name", key: "name" },
        { label: "Status", key: "status" },
        { label: "Created At", key: "created_at" },
        { label: "Action", key: "action" },
    ];

    return {
        tableData: state.data as MajorResponseModel[],
        tableHeader,
        fetchList,
    };
};

export default useMajorList;
