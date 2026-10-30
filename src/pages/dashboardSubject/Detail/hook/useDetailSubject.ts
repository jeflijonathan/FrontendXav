/**
 * useDetailSubject — Framework Logic Hook
 *
 * Fetches Subject detail from backend and manages loading state.
 *
 * Layer: Framework Logic
 */
import { useState, useEffect } from "react";
import SubjectService from "@api/subject/service";
import type { SubjectResponseModel } from "@api/subject/model";
import useDashboardSubjectStore from "../../store";

export const useDetailSubject = (id: string, isOpen: boolean) => {
    const { state } = useDashboardSubjectStore();
    const [detail, setDetail] = useState<SubjectResponseModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id && isOpen) {
            const found = state.data.find(
                (s) => s.id === id || s.id_subject === id
            );
            if (found) {
                setDetail(found);
            } else {
                setIsLoading(true);
            }

            new SubjectService().getById(id, {
                onSuccess: (res) => setDetail(res),
                onError: () => {
                    if (!found) setDetail(null);
                },
                onFullfilled: () => setIsLoading(false),
            });
        } else if (!isOpen) {
            setDetail(null);
            setIsLoading(false);
        }
    }, [id, isOpen]);

    return { detail, isLoading };
};

export default useDetailSubject;

