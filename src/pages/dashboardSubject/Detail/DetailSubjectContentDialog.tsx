/**
 * DetailSubjectContentDialog — Representation Logic
 *
 * Detailed content display for a Subject in English:
 * - Subject Name & ID
 * - Grade
 * - Curriculum Phase (Phase E / Phase F)
 * - Major
 * - Category
 * - Status
 * - Created At, Updated At, Deleted At
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
    resolveSubjectMajor,
    getFaseChipConfig,
} from "../List/utils/subjectHelper";

interface Props {
    detail: SubjectResponseModel;
}

const DetailSubjectContentDialog = ({ detail }: Props) => {
    const { state } = useDashboardSubjectStore();
    const statusChip = resolveSubjectStatusChip(detail.status);
    const id = resolveSubjectId(detail);
    const category = resolveSubjectCategory(detail, state.categories);
    const major = resolveSubjectMajor(detail, state.majors);
    const faseChip = getFaseChipConfig(detail.fase, detail.kelas);

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
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Chip
                        label={faseChip.label}
                        color={faseChip.color}
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                    <Chip
                        label={statusChip.label}
                        color={statusChip.color}
                        size="small"
                    />
                </div>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Subject Name */}
                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Subject Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} color="text.primary">
                        {detail.name || "-"}
                    </Typography>
                    {detail.code_subject && (
                        <Typography variant="caption" color="text.secondary">
                            Code: {detail.code_subject}
                        </Typography>
                    )}
                </div>

                {/* Grade */}
                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Grade
                    </Typography>
                    <div>
                        <Chip
                            label={detail.kelas ? `Grade ${detail.kelas}` : "-"}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                        />
                    </div>
                </div>

                {/* Phase */}
                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Curriculum Phase
                    </Typography>
                    <div>
                        <Chip
                            label={faseChip.label}
                            size="small"
                            color={faseChip.color}
                            sx={{ fontWeight: 600 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                            {detail.kelas === "10"
                                ? "Phase E is designated for Grade 10"
                                : "Phase F is designated for Grade 11 - 12"}
                        </Typography>
                    </div>
                </div>

                {/* Major */}
                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Major
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} color="text.primary">
                        {major?.name || "General (All Majors)"}
                    </Typography>
                </div>

                {/* Category */}
                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Category
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} color="primary.main">
                        {category?.name || "-"}
                    </Typography>
                </div>

                {/* Status */}
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

                {/* Created At */}
                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Created At (created_at)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatSubjectDate(detail.created_at)}
                    </Typography>
                </div>

                {/* Updated At */}
                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Last Updated (updated_at)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatSubjectDate(detail.updated_at)}
                    </Typography>
                </div>

                {/* Deleted At */}
                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Deleted At (deleted_at)
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
