import { useState, useEffect } from "react";
import EmployeeService from "@api/employee/service";
import type { EmployeeResponseModel } from "@api/employee/model";
import useDashboardEmployeeStore from "@pages/dashboardEmployee/store";

export const useDetailEmployee = (id: string, isOpen: boolean) => {
    const { state } = useDashboardEmployeeStore();
    const [detail, setDetail] = useState<EmployeeResponseModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id && isOpen) {
            const cached = state.data.find((emp) => emp.id === id);
            if (cached) {
                setDetail(cached);
            } else {
                setIsLoading(true);
            }

            // Fetch complete and up-to-date data from server
            new EmployeeService().getById(id, {
                onSuccess: (res) => setDetail(res),
                onError: () => {
                    if (!cached) setDetail(null);
                },
                onFullfilled: () => setIsLoading(false),
            });
        }
    }, [id, isOpen]);

    return { detail, isLoading };
};
