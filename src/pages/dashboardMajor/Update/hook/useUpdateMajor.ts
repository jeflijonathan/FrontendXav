import { useState } from "react";
import MajorService from "@api/major/service";
import { type MajorResponseModel, type UpdateMajorRequest } from "@api/major/model";
import { useSnackbar } from "notistack";

const useUpdateMajor = (id: string) => {
    const { enqueueSnackbar } = useSnackbar();
    const [detail, setDetail] = useState<MajorResponseModel | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const fetchDetail = async () => {
        if (!id) return;
        setIsLoadingDetail(true);
        const svc = new MajorService();
        // Use getAll and filter since there's no getById — search by id
        await svc.getAll(
            {
                onSuccess: (res: any) => {
                    const found = (res.data || []).find((m: MajorResponseModel) => m.id_major === id);
                    setDetail(found || null);
                    setIsLoadingDetail(false);
                }, onError: (err: any) => {
                    enqueueSnackbar(typeof err === 'string' ? err : "Failed to fetch major", { variant: "error" });
                    setIsLoadingDetail(false);
                },
            },
            { params: { page: 1, limit: 1000 } }
        );
    };

    const handleUpdate = async (payload: UpdateMajorRequest, onSuccess?: () => void) => {
        const svc = new MajorService();
        await svc.update(id, payload, {
            onSuccess: () => {
                enqueueSnackbar("Major updated successfully", { variant: "success" });
                if (onSuccess) onSuccess();
            },
            onError: (err: any) => {
                enqueueSnackbar(typeof err === 'string' ? err : "Failed to update major", { variant: "error" });
            },
        });
    };

    return { detail, isLoadingDetail, fetchDetail, handleUpdate };
};

export default useUpdateMajor;
