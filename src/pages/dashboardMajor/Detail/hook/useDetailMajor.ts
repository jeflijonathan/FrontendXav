import { useState, useEffect } from "react";
import MajorService from "@api/major/service";
import type { MajorResponseModel } from "@api/major/model";
import { useDashboardMajorStore } from "../../store";

export const useDetailMajor = (id: string, isOpen: boolean) => {
    const { state } = useDashboardMajorStore();
    const [detail, setDetail] = useState<MajorResponseModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id && isOpen) {
            setIsLoading(true);
            const majorFromCache = state.data.find(
                (item) => item.id_major === id || item.id === id
            );

            if (majorFromCache) {
                setDetail(majorFromCache);
                setIsLoading(false);
                return;
            }

            new MajorService().getById(id, {
                onSuccess: (res) => {
                    setDetail(res);
                },
                onError: () => {
                    setDetail(null);
                },
                onFullfilled: () => {
                    setIsLoading(false);
                },
            });
        }
    }, [id, isOpen, state.data]);

    return { detail, isLoading };
};

export default useDetailMajor;
