/**
 * DetailCategorySubjectSkeleton — Representation Logic
 *
 * Skeleton placeholder for category subject detail view while loading.
 *
 * Layer: Representation Logic
 */
import { Box, Skeleton, Divider } from "@mui/material";

const DetailCategorySubjectSkeleton = () => {
    return (
        <Box sx={{ width: "100%", py: 1 }}>
            {/* Header Skeleton */}
            <Box sx={{ mb: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ width: "50%" }}>
                    <Skeleton variant="text" width="60%" height={28} />
                    <Skeleton variant="text" width="80%" height={18} />
                </Box>
                <Skeleton variant="rounded" width={70} height={26} sx={{ borderRadius: "16px" }} />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col gap-1">
                        <Skeleton variant="text" width={100} height={16} />
                        <Skeleton variant="text" width="65%" height={24} />
                    </div>
                ))}
            </div>
        </Box>
    );
};

export default DetailCategorySubjectSkeleton;

