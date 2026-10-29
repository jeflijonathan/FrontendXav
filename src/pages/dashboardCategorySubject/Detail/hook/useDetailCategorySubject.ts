/**
 * useDetailCategorySubject — Framework Logic Hook
 *
 * Fetches category subject detail from backend and manages loading state.
 *
 * Layer: Framework Logic
 */
import { useState, useEffect } from "react";
import CategorySubjectService from "@api/categorysubject/service";
import type { CategorySubjectResponseModel } from "@api/categorysubject/model";
import useDashboardCategorySubjectStore from "../../store";

export const useDetailCategorySubject = (id: string, isOpen: boolean) => {
    const { state } = useDashboardCategorySubjectStore();
    const [detail, setDetail] = useState<CategorySubjectResponseModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id && isOpen) {
            const found = state.data.find(
                (c) => c.id === id || c.id_category_subject === id
            );
            if (found) {
                setDetail(found);
            } else {
                setIsLoading(true);
            }

            new CategorySubjectService().getById(id, {
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

export default useDetailCategorySubject;

