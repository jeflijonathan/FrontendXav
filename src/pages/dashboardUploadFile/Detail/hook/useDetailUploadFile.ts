import { useState, useEffect } from "react";
import UploadFileService from "@api/uploadFile";
import type { UploadFileResponseModel } from "@api/uploadFile/model";
import useDashboardUploadFileStore from "@pages/dashboardUploadFile/store";

export const useDetailUploadFile = (id: string, isOpen: boolean) => {
    const { state } = useDashboardUploadFileStore();
    const [detail, setDetail] = useState<UploadFileResponseModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id && isOpen) {
            setIsLoading(true);
            const found = state.data.find(item => item.id === id);

            if (found) {
                setDetail(found);
                setIsLoading(false);
                return;
            }

            new UploadFileService().getFile({
                onSuccess: (res) => setDetail(res),
                onError: () => setDetail(null),
                onFullfilled: () => setIsLoading(false),
            }, id);
        }
    }, [id, isOpen, state.data]);

    return { detail, isLoading };
};
