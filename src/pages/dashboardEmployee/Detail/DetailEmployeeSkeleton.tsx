import React from "react";
import { Box, Skeleton } from "@mui/material";

const DetailEmployeeSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            {/* Header Hero Card Skeleton */}
            <Box
                sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: 1,
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    gap: 3,
                }}
            >
                <Skeleton variant="circular" width={100} height={100} />
                <Box sx={{ flex: 1, width: "100%" }}>
                    <Skeleton variant="text" width="50%" height={32} />
                    <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1.5 }} />
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Skeleton variant="rounded" width={80} height={24} />
                        <Skeleton variant="rounded" width={70} height={24} />
                        <Skeleton variant="rounded" width={90} height={24} />
                    </Box>
                </Box>
            </Box>

            {/* Grid 2 Kolom Section Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Box
                        key={i}
                        sx={{
                            p: 2.5,
                            borderRadius: 2.5,
                            border: 1,
                            borderColor: "divider",
                        }}
                    >
                        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
                        <div className="grid grid-cols-2 gap-3">
                            <Skeleton variant="text" height={36} />
                            <Skeleton variant="text" height={36} />
                            <Skeleton variant="text" height={36} />
                            <Skeleton variant="text" height={36} />
                        </div>
                    </Box>
                ))}
            </div>
        </div>
    );
};

export default DetailEmployeeSkeleton;
