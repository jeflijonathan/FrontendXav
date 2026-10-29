import React from "react";
import { Skeleton, Divider } from "@mui/material";

const DetailMajorSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1">
                <Skeleton variant="text" width="30%" height={16} />
                <Skeleton variant="text" width="60%" height={24} />
            </div>

            <div className="flex flex-col gap-1">
                <Skeleton variant="text" width="30%" height={16} />
                <Skeleton variant="text" width="50%" height={24} />
            </div>

            <div className="flex flex-col gap-1">
                <Skeleton variant="text" width="20%" height={16} />
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 4 }} />
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <Skeleton variant="text" width="40%" height={16} />
                    <Skeleton variant="text" width="70%" height={24} />
                </div>
                <div className="flex flex-col gap-1">
                    <Skeleton variant="text" width="40%" height={16} />
                    <Skeleton variant="text" width="70%" height={24} />
                </div>
            </div>
        </div>
    );
};

export default DetailMajorSkeleton;
