import useDashboardCategorySubjectStore from "../../store";
const useCategorySubjectFilters = () => {
    const { state, setState } = useDashboardCategorySubjectStore();
    const handleChangePage = (page: number) => setState({ pagination: { ...state.pagination, page } });
    return { handleChangePage };
};
export default useCategorySubjectFilters;
