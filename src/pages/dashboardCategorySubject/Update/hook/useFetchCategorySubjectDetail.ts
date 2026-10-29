/**
 * useFetchCategorySubjectDetail — Framework Logic Hook
 *
 * Fetches fresh detail for editing and sets loading state for the skeleton.
 *
 * Layer: Framework Logic
 */
import CategorySubjectService from "@api/categorysubject/service";
import useDashboardCategorySubjectStore from "../../store";

const useFetchCategorySubjectDetail = () => {
    const { setState } = useDashboardCategorySubjectStore();
    const service = new CategorySubjectService();

    const fetchDetail = async (id: string) => {
        setState((prev) => ({ ...prev, isDetailLoading: true }));

        await service.getById(id, {
            onSuccess: (data) => {
                setState((prev) => ({
                    ...prev,
                    updateCategorySubjectReqDetails: data,
                    isDetailLoading: false,
                }));
            },
            onError: () => {
                setState((prev) => ({ ...prev, isDetailLoading: false }));
            },
        });
    };

    return { fetchDetail };
};

export default useFetchCategorySubjectDetail;

