import { useState } from "react";
import ClassService from "@api/class/service";
import { type ClassResponseModel, type UpdateClassRequest } from "@api/class/model";
import { useSnackbar } from "notistack";

const useUpdateClass = (id: string) => {
    const { enqueueSnackbar } = useSnackbar();
    const [detail, setDetail] = useState<ClassResponseModel | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const fetchDetail = async () => {
        if (!id) return;
        setIsLoadingDetail(true);
        const svc = new ClassService();
        await svc.getAll(
            {
                onSuccess: (res: any) => {
                    const found = (res.data || []).find((c: ClassResponseModel) => c.id_class === id);
                    setDetail(found || null);
                    setIsLoadingDetail(false);
                }, onError: (err: any) => {
                    enqueueSnackbar(typeof err === 'string' ? err : "Failed to fetch class", { variant: "error" });
                    setIsLoadingDetail(false);
                },
            },
            { params: { page: 1, limit: 1000 } }
        );
    };

    const handleUpdate = async (payload: UpdateClassRequest, onSuccess?: () => void) => {
        const svc = new ClassService();
        await svc.update(id, payload, {
            onSuccess: () => {
                enqueueSnackbar("Class updated successfully", { variant: "success" });
                if (onSuccess) onSuccess();
            },
            onError: (err: any) => {
                enqueueSnackbar(typeof err === 'string' ? err : "Failed to update class", { variant: "error" });
            },
        });
    };

    return { detail, isLoadingDetail, fetchDetail, handleUpdate };
};

export default useUpdateClass;
