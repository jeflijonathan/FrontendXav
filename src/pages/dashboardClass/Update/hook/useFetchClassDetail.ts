/**
 * useFetchClassDetail — Framework Logic Hook
 *
 * Fetches fresh class detail from the backend when opening Edit modal,
 * managing the isDetailLoading state so UpdateClassSkeleton is shown.
 *
 * Layer: Framework Logic
 */
import ClassService from "@api/class/service";
import useDashboardClassStore from "../../store";

const useFetchClassDetail = () => {
    const { setState } = useDashboardClassStore();
    const service = new ClassService();

    const fetchDetail = async (id: string) => {
        setState((prev) => ({ ...prev, isDetailLoading: true }));

        await service.getById(id, {
            onSuccess: (data) => {
                setState((prev) => ({
                    ...prev,
                    updateClassReqDetails: data,
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

export default useFetchClassDetail;
