import AnnouncementService from "@api/announcement";
import type { TableHeaderType } from "@components/Table/TableBody"
import { useDashboardAnnouncementStore } from "../../store";
import { snackbar } from "@utils/snackbar";
import { filterAnnouncementMapper } from "../utils/filterMapper";

const useAnnouncementList = () => {
    const { state, setState } = useDashboardAnnouncementStore();
    const service = new AnnouncementService();
    const params = filterAnnouncementMapper(state);

    const tableHeader: TableHeaderType[] = [
        { label: "Title", width: "250px" },
        { label: "Description", width: "350px" },
        { label: "Status", width: "150px" },
        { label: "Created At", width: "150px" },
        { label: "Updated At", width: "150px" },
    ];

    const statusData = [
        { label: "Draft", color: "default" as const },
        { label: "Published", color: "success" as const },
        { label: "Archived", color: "warning" as const },
    ];

    const sortOptions = [
        { value: "title", label: "Judul" },
        { value: "created_at", label: "Tanggal Dibuat" },
    ];

    const fetchAnnouncementList = async () => {
        setState((prev) => ({ ...prev, isLoading: true }))

        service.fetchAnnouncementRequest({
            onSuccess: (res) => {
                setState((prev) => ({ 
                    ...prev, 
                    data: res.data,
                    pagination: res.pagination 
                }))
            },
            onError: (err: any) => {
                snackbar.error(err.message || "Failed to fetch announcement list")
            },

            onFullfilled: () => {
                setState((prev) => ({ ...prev, isLoading: false }))
            }
        }, params);
    }

    return { tableHeader, statusData, sortOptions, fetchAnnouncementList }
}
export default useAnnouncementList