import React from "react";
import { Box, Skeleton, Divider } from "@mui/material";

const DetailEmployeeSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            {/* Skeleton Profile Photo */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Skeleton variant="circular" width={120} height={120} />
            </Box>

            {/* Skeleton Form Fields */}
            <div className="flex flex-col gap-1">
                <Skeleton variant="text" width="30%" height={16} />
                <Skeleton variant="text" width="60%" height={24} />
            </div>
            <div className="flex flex-col gap-1">
                <Skeleton variant="text" width="30%" height={16} />
                <Skeleton variant="text" width="50%" height={24} />
            </div>
            <div className="flex flex-col gap-1">
                <Skeleton variant="text" width="30%" height={16} />
                <Skeleton variant="text" width="40%" height={24} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <Skeleton variant="text" width="40%" height={16} />
                    <Skeleton variant="text" width="80%" height={24} />
                </div>
                <div className="flex flex-col gap-1">
                    <Skeleton variant="text" width="40%" height={16} />
                    <Skeleton variant="text" width="80%" height={24} />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <Skeleton variant="text" width="30%" height={16} />
                <Skeleton variant="text" width="70%" height={24} />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Skeleton variant="rectangular" height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={32} sx={{ borderRadius: 1 }} />
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-4">
                <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 4 }} />
                <Skeleton variant="text" width="50%" height={24} />
            </div>
        </div>
    );
};

export default DetailEmployeeSkeleton;