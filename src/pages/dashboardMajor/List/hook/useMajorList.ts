import { useDashboardMajorStore } from "../../store";
import MajorService from "@api/major/service";
import { useSnackbar } from "notistack";
import type { FilterParams, SortOptionType } from "@common/types";
import type { TableHeaderType } from "@components/Table/TableBody";
import type { MajorResponseModel } from "@api/major/model";

type ReturnHook = {
    statusData: Record<number, { label: string; color: "success" | "error" }>;
    tableData: MajorResponseModel[];
    majorHeaders: TableHeaderType[];
    sortOptions: SortOptionType[];
    fetchMajorList: (filterParams?: FilterParams) => Promise<void>;
};

const useMajorList = (): ReturnHook => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardMajorStore();
    const service = new MajorService();

    const fetchMajorList = async (filterParams?: FilterParams) => {
        setState((prev) => ({ ...prev, isLoading: true }));
        return await service.getAll(
            {
                onSuccess: (res) => {
                    setState((prev) => ({
                        ...prev,
                        data: res.data || [],
                        pagination: res.pagination,
                        isLoading: false,
                    }));
                },
                onError: (err) => {
                    enqueueSnackbar(err.message || "Failed to fetch majors", { variant: "error" });
                    setState((prev) => ({ ...prev, isLoading: false }));
                },
            },
            filterParams
        );
    };

    const majorHeaders: TableHeaderType[] = [
        { label: "ID Major", width: "220px" },
        { label: "Nama Jurusan", width: "260px" },
        { label: "Status", width: "120px" },
        { label: "Dibuat Pada", width: "160px" },
        { label: "Diperbarui Pada", width: "160px" },
    ];

    const sortOptions: SortOptionType[] = [
        { label: "Nama Jurusan", value: "name" },
        { label: "Tanggal Dibuat", value: "created_at" },
        { label: "Tanggal Diperbarui", value: "updated_at" },
    ];

    const statusData: Record<number, { label: string; color: "success" | "error" }> = {
        1: { label: "Aktif", color: "success" },
        0: { label: "Non Aktif", color: "error" },
    };

    return {
        statusData,
        tableData: state.data,
        majorHeaders,
        sortOptions,
        fetchMajorList,
    };
};

export default useMajorList;
