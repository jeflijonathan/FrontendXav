/**
 * useFetchSubjectDetail — Framework Logic Hook
 *
 * Fetches fresh detail for editing and sets loading state for the skeleton.
 *
 * Layer: Framework Logic
 */
import SubjectService from "@api/subject/service";
import useDashboardSubjectStore from "../../store";

const useFetchSubjectDetail = () => {
    const { setState } = useDashboardSubjectStore();
    const service = new SubjectService();

    const fetchDetail = async (id: string) => {
        setState((prev) => ({ ...prev, isDetailLoading: true }));

        await service.getById(id, {
            onSuccess: (data) => {
                setState((prev) => ({
                    ...prev,
                    updateSubjectReqDetails: data,
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

export default useFetchSubjectDetail;

