/**
 * useDetailClass — Framework Logic Hook
 *
 * Fetches full class detail from backend including enrolled students.
 * Manages loading state for the class detail and students list.
 *
 * Layer: Framework Logic
 */
import { useState, useEffect } from "react";
import ClassService from "@api/class/service";
import type { ClassResponseModel } from "@api/class/model";
import useDashboardClassStore from "@pages/dashboardClass/store";

export const useDetailClass = (id: string, isOpen: boolean) => {
    const { state } = useDashboardClassStore();
    const [detail, setDetail] = useState<ClassResponseModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);

    useEffect(() => {
        if (id && isOpen) {
            const found = state.data.find((c) => c.id_class === id || c.id === id);
            if (found) {
                setDetail(found);
                // When using found from list, students array might still be empty/unfetched
                setIsLoadingStudents(!found.students || found.students.length === 0);
            } else {
                setIsLoading(true);
                setIsLoadingStudents(true);
            }

            // Always fetch complete fresh detail from backend (including students)
            new ClassService().getById(id, {
                onSuccess: (res) => {
                    setDetail(res);
                },
                onError: () => {
                    if (!found) setDetail(null);
                },
                onFullfilled: () => {
                    setIsLoading(false);
                    setIsLoadingStudents(false);
                },
            });
        } else if (!isOpen) {
            setDetail(null);
            setIsLoading(false);
            setIsLoadingStudents(false);
        }
    }, [id, isOpen]);

    return { detail, isLoading, isLoadingStudents };
};

export default useDetailClass;
