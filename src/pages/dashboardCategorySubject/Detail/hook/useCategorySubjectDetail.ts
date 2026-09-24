import { useState, useEffect } from "react";
import CategorySubjectService from "@api/categorysubject/service";
import type { CategorySubjectResponseModel } from "@api/categorysubject/model";
import { useSnackbar } from "notistack";

const useCategorySubjectDetail = (id: string | null) => {
    const service = new CategorySubjectService();
    const { enqueueSnackbar } = useSnackbar();
    const [detail, setDetail] = useState<CategorySubjectResponseModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!id) {
            setDetail(null);
            return;
        }

        const fetchDetail = async () => {
            setIsLoading(true);
            await service.getCategorySubjectByIdRequest(id, {
                onSuccess: (data) => {
                    setDetail(data);
                }, onError: (err: any) => {
                    enqueueSnackbar(err || "Failed to fetch category subject details", { variant: "error" });
                },
                onFullfilled: () => setIsLoading(false)
            });
        };

        fetchDetail();
    }, [id]);

    return { detail, isLoading };
};

export default useCategorySubjectDetail;
