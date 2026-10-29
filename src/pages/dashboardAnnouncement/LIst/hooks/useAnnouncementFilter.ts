import useDashboardAnnouncementStore from "@pages/dashboardAnnouncement/store";
import type { FilterType } from "@common/types";

const useAnnouncementFilter = () => {
    const { setState } = useDashboardAnnouncementStore();

    const filters: FilterType[] = [
        {
            key: "sort",
            label: "Sort By",
            options: [
                { label: "Terbaru", icon: "icon-mui-sort-by-time", value: "created_at" },
                { label: "Terupdate", icon: "icon-mui-sort-newest", value: "updated_at" },
            ],
        },
        {
            key: "order_by",
            label: "Urutan",
            options: [
                { label: "Menaik", icon: "icon-mui-sort", value: "asc" },
                { label: "Menurun", icon: "icon-mui-sort-down", value: "desc" },
            ],
        },
    ];

    const handleChangePage = (page: number) => {
        setState(prev => ({
            ...prev,
            pagination: { ...prev.pagination, page },
            filters: { ...prev.filters, page }
        }));
    };

    const handleSearch = (value: string) => {
        setState(prev => ({
            ...prev,
            search: { value },
            pagination: { ...prev.pagination, page: 1 },
            filters: { ...prev.filters, page: 1 }
        }));
    };

    const handleSort = (sort: string) => {
        setState(prev => ({
            ...prev,
            filters: { ...prev.filters, sort, page: 1 },
            pagination: { ...prev.pagination, page: 1 }
        }));
    };

    const handleOrder = (order_by: "asc" | "desc") => {
        setState(prev => ({
            ...prev,
            filters: { ...prev.filters, order_by, page: 1 },
            pagination: { ...prev.pagination, page: 1 }
        }));
    };

    const filterChange = (key: string, value: string) => {
        setState(prev => ({
            ...prev,
            filters: {
                ...prev.filters,
                [key]: value
            }
        }));
    };

    return {
        handleChangePage,
        handleSearch,
        handleSort,
        handleOrder,
        searchChange: handleSearch,
        filterChange,
        sortChange: handleSort,
        orderChange: handleOrder,
        filters
    };
};

export default useAnnouncementFilter;