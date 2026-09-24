import useDashboardClassStore from "../../store";
import ClassService from "@api/class/service";
import { type ClassResponseModel } from "@api/class/model";
import { useSnackbar } from "notistack";

const useClassList = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardClassStore();

    const fetchList = async () => {
        setState((prev) => ({ ...prev, isLoading: true }));
        const svc = new ClassService();
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
                    enqueueSnackbar(typeof err === 'string' ? err : "Failed to fetch classes", { variant: "error" });
                    setState((prev) => ({ ...prev, isLoading: false }));
                },
            },
            { params: { page: state.filters.page, limit: state.filters.limit, search: state.filters.search } }
        );
    };

    const tableHeader = [
        { label: "Class Name", key: "name" },
        { label: "Major", key: "id_major" },
        { label: "Class Guardian", key: "id_class_guardian" },
        { label: "Status", key: "status" },
        { label: "Created At", key: "created_at" },
        { label: "Action", key: "action" },
    ];

    return {
        tableData: state.data as ClassResponseModel[],
        tableHeader,
        fetchList,
    };
};

export default useClassList;
