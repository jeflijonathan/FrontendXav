/**
 * UpdateCategorySubjectSkeleton — Representation Logic
 *
 * Skeleton placeholder for category subject edit form while loading.
 *
 * Layer: Representation Logic
 */
import { Skeleton } from "@mui/material";
import { DialogBody } from "@components/Dialog";

const UpdateCategorySubjectSkeleton = () => {
    return (
        <DialogBody>
            <div className="flex flex-col gap-4 py-1">
                <div className="flex flex-col gap-1">
                    <Skeleton variant="text" width={140} height={18} />
                    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                </div>
                <div className="flex flex-col gap-1">
                    <Skeleton variant="text" width={60} height={18} />
                    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                </div>
            </div>
        </DialogBody>
    );
};

export default UpdateCategorySubjectSkeleton;

