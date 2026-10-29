/**
 * DetailClassContentDialog — Representation Logic
 *
 * Renders the detailed view of a single class including info fields
 * and the enrolled students table. All data transformations are
 * delegated to detailClassHelper (Business Logic).
 *
 * Layer: Representation Logic (JSX, styling, conditional rendering)
 */
import {
    Box,
    Typography,
    Chip,
    Divider,
    Avatar,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { Groups } from "@mui/icons-material";
import type { ClassResponseModel } from "@api/class/model";
import useDashboardClassStore from "../store";
import {
    resolveDetailMajor,
    resolveDetailEmployee,
    resolveDetailSchoolInfo,
    formatEmployeeFullName,
    formatStudentDisplayName,
    formatDetailDateTime,
    getStudentGenderChip,
    getStudentDetailPhotoUrl,
} from "./utils/detailClassHelper";
import { DetailStudentsTableSkeleton } from "./DetailClassSkeleton";

interface Props {
    detail: ClassResponseModel;
    isLoadingStudents?: boolean;
}

const DetailClassContentDialog = ({ detail, isLoadingStudents = false }: Props) => {
    const { state } = useDashboardClassStore();

    // Business logic: resolve related entities via pure helpers
    const major = resolveDetailMajor(detail, state.majors);
    const employee = resolveDetailEmployee(detail, state.employees);
    const schoolInfo = resolveDetailSchoolInfo(detail, state.schoolInformations);
    const students = detail.students || [];

    return (
        <Box sx={{ width: "100%", py: 1 }}>
            {/* Header: class name + chips */}
            <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <Typography variant="h6" sx={{ fontWeight: 700 }} color="text.primary">
                        {detail.name || `Kelas ${detail.kelas}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ID: {detail.id_class}
                    </Typography>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Chip
                        icon={<Groups sx={{ fontSize: 16 }} />}
                        label={`${students.length} Siswa`}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                    <Chip
                        label={detail.status ? "Aktif" : "Non Aktif"}
                        color={detail.status ? "success" : "default"}
                        size="small"
                    />
                </div>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Class Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Tingkat Kelas
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} color="text.primary">
                        {detail.kelas ? `Kelas ${detail.kelas}` : "-"}
                    </Typography>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Nama Kelas
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} color="text.primary">
                        {detail.name || "-"}
                    </Typography>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Jurusan
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} color="text.primary">
                        {major?.name ?? detail.id_major ?? "-"}
                    </Typography>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Wali Kelas
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} color="text.primary">
                        {formatEmployeeFullName(employee)}
                    </Typography>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Periode / Tahun Ajaran
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} color="text.primary">
                        {schoolInfo?.periode || "-"}
                    </Typography>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Status
                    </Typography>
                    <div>
                        <Chip
                            label={detail.status ? "Aktif" : "Non Aktif"}
                            color={detail.status ? "success" : "default"}
                            size="small"
                            variant="outlined"
                        />
                    </div>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Dibuat Pada
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatDetailDateTime(detail.created_at)}
                    </Typography>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Terakhir Diperbarui
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatDetailDateTime(detail.updated_at)}
                    </Typography>
                </div>
            </div>

            {/* Enrolled Students Section */}
            <Box sx={{ mt: 3.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Groups color="primary" sx={{ fontSize: 22 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} color="primary">
                            Daftar Siswa di Kelas Ini
                        </Typography>
                    </Box>
                    <Chip
                        label={isLoadingStudents ? "Memuat siswa..." : `${students.length} Siswa Terdaftar`}
                        size="small"
                        color={students.length > 0 ? "primary" : "default"}
                        variant="outlined"
                    />
                </Box>

                {isLoadingStudents ? (
                    <DetailStudentsTableSkeleton />
                ) : students.length > 0 ? (
                    <Box
                        sx={{
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                            overflow: "hidden",
                            maxHeight: 320,
                            overflowY: "auto",
                        }}
                    >
                        <Table size="small" stickyHeader>
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
                                {students.map((student, idx) => {
                                    // Business logic via pure helpers
                                    const photo = getStudentDetailPhotoUrl(
                                        student.profile_url,
                                        import.meta.env.VITE_BACKEND_URL
                                    );
                                    const genderChip = getStudentGenderChip(student.gender);
                                    const fullName = formatStudentDisplayName(student);

                                    return (
                                        <TableRow key={student.id} hover>
                                            <TableCell>{idx + 1}</TableCell>

                                            {/* Foto & Nama */}
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                    <Avatar
                                                        src={photo || undefined}
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            bgcolor: "primary.main",
                                                            fontSize: "0.85rem",
                                                        }}
                                                    >
                                                        {student.first_name?.[0]?.toUpperCase() || "?"}
                                                    </Avatar>
                                                    <div>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {fullName}
                                                        </Typography>
                                                        {student.email && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                {student.email}
                                                            </Typography>
                                                        )}
                                                    </div>
                                                </Box>
                                            </TableCell>

                                            {/* NIS / NISN */}
                                            <TableCell>
                                                <Typography variant="body2">NIS: {student.nis}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    NISN: {student.nisn || "-"}
                                                </Typography>
                                            </TableCell>

                                            {/* Jenis Kelamin */}
                                            <TableCell>
                                                <Chip
                                                    label={genderChip.label}
                                                    size="small"
                                                    variant="outlined"
                                                    color={genderChip.color}
                                                    sx={{ fontSize: "0.75rem" }}
                                                />
                                            </TableCell>

                                            {/* No. Telepon */}
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {student.phone_number || "-"}
                                                </Typography>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                                <Chip
                                                    label={student.status ? "Aktif" : "Non Aktif"}
                                                    size="small"
                                                    color={student.status ? "success" : "default"}
                                                    sx={{ fontSize: "0.75rem" }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            p: 3,
                            textAlign: "center",
                            border: "1px dashed",
                            borderColor: "divider",
                            borderRadius: 2,
                            bgcolor: "background.default",
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Belum ada siswa yang terdaftar di dalam kelas ini.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default DetailClassContentDialog;
