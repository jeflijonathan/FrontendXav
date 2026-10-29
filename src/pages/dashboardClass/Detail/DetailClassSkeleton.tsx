/**
 * DetailClassSkeleton — Representation Logic
 *
 * Skeleton placeholder for the Class Detail dialog while data is loading.
 * Matches the layout of DetailClassContentDialog:
 * - Header (Class name, ID, Badges)
 * - 8 Info fields grid (2 columns)
 * - Participant (Daftar Siswa di Kelas Ini) table skeleton with avatar, NIS, chips
 *
 * Layer: Representation Logic
 */
import {
    Box,
    Skeleton,
    Divider,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { Groups } from "@mui/icons-material";

const SKELETON_ROWS = [1, 2, 3];

export const DetailStudentsTableSkeleton = () => {
    return (
        <Box
            sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ bgcolor: "background.default" }}>
                        <TableCell sx={{ fontWeight: 700, width: 40 }}>No</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Siswa</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>NIS / NISN</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Jenis Kelamin</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>No. Telepon</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {SKELETON_ROWS.map((i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Skeleton variant="text" width={16} />
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <Skeleton variant="circular" width={32} height={32} />
                                    <Box sx={{ width: "100%", maxWidth: 160 }}>
                                        <Skeleton variant="text" width="80%" height={20} />
                                        <Skeleton variant="text" width="55%" height={14} />
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Skeleton variant="text" width={70} height={18} />
                                <Skeleton variant="text" width={90} height={14} />
                            </TableCell>
                            <TableCell>
                                <Skeleton
                                    variant="rounded"
                                    width={75}
                                    height={24}
                                    sx={{ borderRadius: "16px" }}
                                />
                            </TableCell>
                            <TableCell>
                                <Skeleton variant="text" width={100} height={18} />
                            </TableCell>
                            <TableCell>
                                <Skeleton
                                    variant="rounded"
                                    width={60}
                                    height={24}
                                    sx={{ borderRadius: "16px" }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

const DetailClassSkeleton = () => {
    return (
        <Box sx={{ width: "100%", py: 1 }}>
            {/* Header: Class Name, ID, Badges */}
            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box sx={{ width: "50%" }}>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="80%" height={20} />
                </Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Skeleton
                        variant="rounded"
                        width={90}
                        height={26}
                        sx={{ borderRadius: "16px" }}
                    />
                    <Skeleton
                        variant="rounded"
                        width={65}
                        height={26}
                        sx={{ borderRadius: "16px" }}
                    />
                </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* 8 Info Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    "Tingkat Kelas",
                    "Nama Kelas",
                    "Jurusan",
                    "Wali Kelas",
                    "Periode / Tahun Ajaran",
                    "Status",
                    "Dibuat Pada",
                    "Terakhir Diperbarui",
                ].map((_, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                        <Skeleton variant="text" width={110} height={16} />
                        <Skeleton variant="text" width={idx === 2 || idx === 3 ? "85%" : "50%"} height={26} />
                    </div>
                ))}
            </div>

            {/* Participant Section (Daftar Siswa di Kelas Ini) Skeleton */}
            <Box sx={{ mt: 3.5 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1.5,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Groups color="disabled" sx={{ fontSize: 22 }} />
                        <Skeleton variant="text" width={180} height={24} />
                    </Box>
                    <Skeleton
                        variant="rounded"
                        width={130}
                        height={24}
                        sx={{ borderRadius: "16px" }}
                    />
                </Box>

                {/* Table Skeleton */}
                <DetailStudentsTableSkeleton />
            </Box>
        </Box>
    );
};

export default DetailClassSkeleton;
