/**
 * DetailSubjectContentDialog — Representation Logic
 *
 * Detailed content display for a Subject.
 *
 * Layer: Representation Logic
 */
import { Box, Typography, Chip, Divider } from "@mui/material";
import type { SubjectResponseModel } from "@api/subject/model";
import useDashboardSubjectStore from "../store";
import {
    formatSubjectDate,
    resolveSubjectStatusChip,
    resolveSubjectId,
    resolveSubjectCategory,
} from "../List/utils/subjectHelper";

interface Props {
    detail: SubjectResponseModel;
}

const DetailSubjectContentDialog = ({ detail }: Props) => {
    const { state } = useDashboardSubjectStore();
    const statusChip = resolveSubjectStatusChip(detail.status);
    const id = resolveSubjectId(detail);
    const category = resolveSubjectCategory(detail, state.categories);

    return (
        <Box sx={{ width: "100%", py: 1 }}>
            {/* Header: Name, ID & Status */}
            <Box
                sx={{
                    mb: 2.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <Typography variant="h6" sx={{ fontWeight: 700 }} color="text.primary">
                        {detail.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ID: {id}
                    </Typography>
                </div>
                <Chip
                    label={statusChip.label}
                    color={statusChip.color}
                    size="small"
                />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Nama Mata Pelajaran
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} color="text.primary">
                        {detail.name || "-"}
                    </Typography>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Category
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} color="primary.main">
                        {category?.name || "-"}
                    </Typography>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Status
                    </Typography>
                    <div>
                        <Chip
                            label={statusChip.label}
                            color={statusChip.color}
                            size="small"
                            variant="outlined"
                        />
                    </div>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Dibuat Pada (created_at)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatSubjectDate(detail.created_at)}
                    </Typography>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Terakhir Diperbarui (updated_at)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatSubjectDate(detail.updated_at)}
                    </Typography>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Dihapus Pada (deleted_at)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {detail.deleted_at ? (
                            <span className="text-red-600 font-medium">
                                {formatSubjectDate(detail.deleted_at)}
                            </span>
                        ) : (
                            "-"
                        )}
                    </Typography>
                </div>
            </div>
        </Box>
    );
};

export default DetailSubjectContentDialog;

