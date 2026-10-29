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
            setIsLoading(true);
            const employee = state.data.find(emp => emp.id === id);

            if (employee) {
                setDetail(employee);
                setIsLoading(false);
                return;
            }

            new EmployeeService().getById(id, {
                onSuccess: (res) => setDetail(res),
                onError: () => setDetail(null),
                onFullfilled: () => setIsLoading(false),
            });
        }
    }, [id, isOpen, state.data]);

    return { detail, isLoading };
};