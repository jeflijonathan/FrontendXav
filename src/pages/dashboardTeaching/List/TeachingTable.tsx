import {
    Box,
    Button,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TableCell,
    Typography,
} from "@mui/material";
import { Add, CalendarMonth, Edit } from "@mui/icons-material";
import { BaseTable, TableHeader, TableFooter } from "@components/Table";
import TableBody from "@components/Table/TableBody";
import TableRow from "@components/Table/TableRow";
import TablePagination from "@components/Table/TablePagination";
import useTeachingTable from "./hook/useTeachingTable";
import {
    calculateTeacherTotalJp,
    formatClassLabel,
    formatJpLabel,
    formatSubjectDisplay,
    formatTeacherFullName,
} from "../utils/teachingBusinessLogic";
import {
    periodOptionLabel,
    resolveFilterPeriodId,
} from "./utils/teachingHelper";
import CreateTeachingAssignmentCardDialog from "../Create/CreateTeachingAssignmentCardDialog";
import UpdateTeachingAssignmentCardDialog from "../Update/UpdateTeachingAssignmentCardDialog";
import type { TeachingTeacherRowModel } from "@api/teaching/model";

const TeachingTable = () => {
    const {
        state,
        tableData,
        teachingHeaders,
        sortOptions,
        handleChangePage,
        handleSearch,
        handleSort,
        handleOrder,
        handleFilterPeriode,
        handleFilterLimit,
        isCreateOpen,
        createPreset,
        selectedTeacher,
        openCreateDialog,
        closeCreateDialog,
        openManageDialog,
        closeManageDialog,
    } = useTeachingTable();

    const filterPeriodId = resolveFilterPeriodId(
        state.filters.periode,
        state.schoolInformations
    );

    const renderActions = (teacher: TeachingTeacherRowModel) => {
        const subjects = teacher.subjects || [];

        return (
            <Box sx={{ display: "flex", alignItems: "center", minWidth: 140 }}>
                {subjects.length === 0 ? (
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() =>
                            openCreateDialog({
                                id_teacher: teacher.id_teacher,
                                id_school_information: filterPeriodId || undefined,
                            })
                        }
                        sx={{
                            textTransform: "none",
                            fontSize: "0.75rem",
                            borderRadius: "6px",
                            whiteSpace: "nowrap",
                            fontWeight: 700,
                        }}
                    >
                        + Penugasan
                    </Button>
                ) : (
                    <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<Edit />}
                        onClick={() => openManageDialog(teacher)}
                        sx={{
                            textTransform: "none",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            borderRadius: "8px",
                            whiteSpace: "nowrap",
                            px: 1.5,
                        }}
                    >
                        Kelola Penugasan
                    </Button>
                )}
            </Box>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Filter periode & info bar */}
            <div className="bg-theme-secondary/40 border border-light-dark p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <FormControl size="small" sx={{ minWidth: 240 }}>
                        <InputLabel id="teaching-filter-periode-label">Periode</InputLabel>
                        <Select
                            labelId="teaching-filter-periode-label"
                            label="Periode"
                            value={state.filters.periode}
                            onChange={(event) =>
                                handleFilterPeriode(event.target.value)
                            }
                            sx={{ borderRadius: "8px", fontWeight: 600 }}
                            startAdornment={
                                <CalendarMonth
                                    sx={{ color: "primary.main", mr: 1, fontSize: 20 }}
                                />
                            }
                        >
                            <MenuItem value="">
                                <em>Semua Periode</em>
                            </MenuItem>
                            {state.periods.map((period) => (
                                <MenuItem key={period.periode} value={period.periode}>
                                    {periodOptionLabel(period)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography variant="body2" color="text.secondary">
                        <strong>{state.pagination.total_data}</strong> guru terdaftar
                        {state.filters.periode
                            ? ` pada periode ${state.filters.periode}`
                            : ""}
                    </Typography>
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => openCreateDialog()}
                    sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 600,
                        px: 2,
                    }}
                >
                    Tambah Penugasan
                </Button>
            </div>

            {/* Search and Sort Toolbar */}
            <TableHeader
                search={state.search.value}
                onSearchChange={handleSearch}
                sortBy={state.filters.sort}
                onSortByChange={handleSort}
                sortOptions={sortOptions}
                sortDir={state.filters.order_by || "asc"}
                onSortDirChange={handleOrder}
            />

            {/* Standard Project BaseTable */}
            <BaseTable breakpoint={1024}>
                <TableBody
                    header={teachingHeaders}
                    isLoading={state.isLoading}
                    dataLength={tableData.length}
                    skeletonRows={3}
                >
                    {tableData.map((teacher, index) => {
                        const subjects = teacher.subjects || [];
                        const totalJp =
                            teacher.total_jp ?? calculateTeacherTotalJp(subjects);

                        return (
                            <TableRow
                                key={teacher.id_teacher}
                                index={index}
                                header={teachingHeaders}
                                actions={renderActions(teacher)}
                            >
                                {/* 1. Nama Guru */}
                                <TableCell sx={{ verticalAlign: "top", py: 1.5 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 700 }}
                                    >
                                        {formatTeacherFullName(teacher)}
                                    </Typography>
                                    {teacher.niy && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ display: "block" }}
                                        >
                                            NIY: {teacher.niy}
                                        </Typography>
                                    )}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 0.5,
                                            flexWrap: "wrap",
                                            mt: 1,
                                        }}
                                    >
                                        <Chip
                                            size="small"
                                            label={`${teacher.total_subjects} mapel`}
                                            color="primary"
                                            variant="outlined"
                                            sx={{ fontSize: "0.72rem", height: 22 }}
                                        />
                                        <Chip
                                            size="small"
                                            label={`${teacher.total_classes} kelas`}
                                            variant="outlined"
                                            sx={{ fontSize: "0.72rem", height: 22 }}
                                        />
                                    </Box>
                                </TableCell>

                                {/* 2. Mata Pelajaran */}
                                <TableCell sx={{ verticalAlign: "top", py: 1.5 }}>
                                    {subjects.length === 0 ? (
                                        <Typography
                                            variant="caption"
                                            color="text.disabled"
                                        >
                                            Belum ada mata pelajaran
                                        </Typography>
                                    ) : (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 1,
                                            }}
                                        >
                                            {subjects.map((subject) => {
                                                const { name, code } =
                                                    formatSubjectDisplay(subject);
                                                return (
                                                    <Box
                                                        key={subject.id_teacher_subject}
                                                        sx={{
                                                            minHeight: 46,
                                                            p: 0.75,
                                                            px: 1,
                                                            borderRadius: "8px",
                                                            border: "1px solid rgba(148, 163, 184, 0.2)",
                                                            backgroundColor:
                                                                "rgba(148, 163, 184, 0.05)",
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 700,
                                                                lineHeight: 1.2,
                                                            }}
                                                        >
                                                            {name}
                                                        </Typography>
                                                        {code && (
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {code}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    )}
                                </TableCell>

                                {/* 3. Jumlah JP per Mata Pelajaran */}
                                <TableCell sx={{ verticalAlign: "top", py: 1.5 }}>
                                    {subjects.length === 0 ? (
                                        <Typography
                                            variant="caption"
                                            color="text.disabled"
                                        >
                                            -
                                        </Typography>
                                    ) : (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 1,
                                            }}
                                        >
                                            {subjects.map((subject) => (
                                                <Box
                                                    key={subject.id_teacher_subject}
                                                    sx={{
                                                        minHeight: 46,
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Chip
                                                        label={formatJpLabel(
                                                            subject.jp_amount
                                                        )}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{
                                                            fontWeight: 800,
                                                            fontSize: "0.75rem",
                                                            height: 26,
                                                            px: 0.5,
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </TableCell>

                                {/* 4. Kelas Diampu */}
                                <TableCell sx={{ verticalAlign: "top", py: 1.5 }}>
                                    {subjects.length === 0 ? (
                                        <Typography
                                            variant="caption"
                                            color="text.disabled"
                                        >
                                            -
                                        </Typography>
                                    ) : (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 1,
                                            }}
                                        >
                                            {subjects.map((subject) => (
                                                <Box
                                                    key={subject.id_teacher_subject}
                                                    sx={{
                                                        minHeight: 46,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    {subject.classes.length === 0 ? (
                                                        <Typography
                                                            variant="caption"
                                                            color="text.disabled"
                                                        >
                                                            Belum ada kelas
                                                        </Typography>
                                                    ) : (
                                                        subject.classes.map(
                                                            (placement) => (
                                                                <Chip
                                                                    key={
                                                                        placement.id_class_room ??
                                                                        `${placement.id_class}-${placement.id_school_information}`
                                                                    }
                                                                    size="small"
                                                                    label={formatClassLabel(
                                                                        placement
                                                                    )}
                                                                    color="primary"
                                                                    variant="outlined"
                                                                    sx={{
                                                                        fontSize:
                                                                            "0.75rem",
                                                                        maxWidth: 180,
                                                                    }}
                                                                />
                                                            )
                                                        )
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </TableCell>

                                {/* 4. Periode */}
                                <TableCell sx={{ verticalAlign: "top", py: 1.5 }}>
                                    {subjects.length === 0 ? (
                                        <Typography
                                            variant="caption"
                                            color="text.disabled"
                                        >
                                            -
                                        </Typography>
                                    ) : (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 1,
                                            }}
                                        >
                                            {subjects.map((subject) => {
                                                const periods = Array.from(
                                                    new Set(
                                                        subject.classes
                                                            .map((c) => c.periode)
                                                            .filter(Boolean)
                                                    )
                                                ).join(", ");

                                                return (
                                                    <Box
                                                        key={subject.id_teacher_subject}
                                                        sx={{
                                                            minHeight: 46,
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {periods || "-"}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    )}
                                </TableCell>

                                {/* 6. Total JP yang Diambil */}
                                <TableCell sx={{ verticalAlign: "top", py: 1.5 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            gap: 0.5,
                                        }}
                                    >
                                        <Chip
                                            label={formatJpLabel(totalJp)}
                                            size="medium"
                                            color={totalJp > 0 ? "success" : "default"}
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: "0.85rem",
                                                height: 28,
                                                px: 0.8,
                                            }}
                                        />
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ fontWeight: 600 }}
                                        >
                                            Total JP Diambil
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>

                <TableFooter colSpan={teachingHeaders.length + 2}>
                    <TablePagination
                        currentPage={state.pagination.page}
                        totalPage={state.pagination.total_pages}
                        totalData={state.pagination.total_data}
                        limit={state.pagination.limit}
                        onLimitChange={handleFilterLimit}
                        onChange={handleChangePage}
                    />
                </TableFooter>
            </BaseTable>

            <CreateTeachingAssignmentCardDialog
                isOpen={isCreateOpen}
                onClose={closeCreateDialog}
                preset={createPreset}
            />

            {selectedTeacher && (
                <UpdateTeachingAssignmentCardDialog
                    teacher={selectedTeacher}
                    isOpen={Boolean(selectedTeacher)}
                    onClose={closeManageDialog}
                    onOpenAdd={(teacherId) =>
                        openCreateDialog({
                            id_teacher: teacherId,
                            id_school_information: filterPeriodId || undefined,
                        })
                    }
                />
            )}
        </div>
    );
};

export default TeachingTable;
