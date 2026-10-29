/**
 * UpdateClassSkeleton — Representation Logic
 *
 * Skeleton placeholder for the Class Edit dialog while data is loading.
 * Matches the layout of UpdateClassFormDialog:
 * - Periode Info banner skeleton
 * - Tingkat Kelas field skeleton
 * - Jurusan field skeleton
 * - Nama Kelas auto-preview box skeleton
 * - Wali Kelas autocomplete skeleton
 * - Status dropdown skeleton
 *
 * Layer: Representation Logic
 */
import { Box, Skeleton } from "@mui/material";
import { DialogBody } from "@components/Dialog";

const UpdateClassSkeleton = () => {
    return (
        <DialogBody>
            <div className="flex flex-col gap-4 py-1">
                {/* Periode Banner Skeleton */}
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        border: 1,
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box sx={{ width: "60%" }}>
                        <Skeleton variant="text" width="50%" height={16} />
                        <Skeleton variant="text" width="70%" height={22} />
                    </Box>
                    <Skeleton
                        variant="rounded"
                        width={70}
                        height={24}
                        sx={{ borderRadius: "16px" }}
                    />
                </Box>

                {/* Tingkat Kelas Field Skeleton */}
                <Box className="flex flex-col gap-1">
                    <Skeleton variant="text" width={90} height={18} />
                    <Skeleton
                        variant="rectangular"
                        height={40}
                        sx={{ borderRadius: 1 }}
                    />
                </Box>

                {/* Jurusan Field Skeleton */}
                <Box className="flex flex-col gap-1">
                    <Skeleton variant="text" width={60} height={18} />
                    <Skeleton
                        variant="rectangular"
                        height={40}
                        sx={{ borderRadius: 1 }}
                    />
                </Box>

                {/* Nama Kelas Preview Box Skeleton */}
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        border: 1,
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box sx={{ width: "60%" }}>
                        <Skeleton variant="text" width="40%" height={16} />
                        <Skeleton variant="text" width="60%" height={26} />
                    </Box>
                    <Skeleton
                        variant="rounded"
                        width={45}
                        height={22}
                        sx={{ borderRadius: "16px" }}
                    />
                </Box>

                {/* Wali Kelas Field Skeleton */}
                <Box className="flex flex-col gap-1">
                    <Skeleton variant="text" width={75} height={18} />
                    <Skeleton
                        variant="rectangular"
                        height={40}
                        sx={{ borderRadius: 1 }}
                    />
                </Box>

                {/* Status Field Skeleton */}
                <Box className="flex flex-col gap-1">
                    <Skeleton variant="text" width={50} height={18} />
                    <Skeleton
                        variant="rectangular"
                        height={40}
                        sx={{ borderRadius: 1 }}
                    />
                </Box>
            </div>
        </DialogBody>
    );
};

export default UpdateClassSkeleton;

