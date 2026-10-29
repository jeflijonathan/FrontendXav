/**
 * DetailCategorySubjectContentDialog — Representation Logic
 *
 * Detailed content display for category subject.
 *
 * Layer: Representation Logic
 */
import { Box, Typography, Chip, Divider } from "@mui/material";
import type { CategorySubjectResponseModel } from "@api/categorysubject/model";
import {
    formatCategoryDate,
    resolveCategoryStatusChip,
    resolveCategoryId,
} from "../List/utils/categorySubjectHelper";

interface Props {
    detail: CategorySubjectResponseModel;
}

const DetailCategorySubjectContentDialog = ({ detail }: Props) => {
    const statusChip = resolveCategoryStatusChip(detail.status);
    const id = resolveCategoryId(detail);

    return (
        <Box sx={{ width: "100%", py: 1 }}>
            {/* Header: Name & Status */}
            <Box sx={{ mb: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                        Nama Kategori
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} color="text.primary">
                        {detail.name || "-"}
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
                        {formatCategoryDate(detail.created_at)}
                    </Typography>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Terakhir Diperbarui (updated_at)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatCategoryDate(detail.updated_at)}
                    </Typography>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Dihapus Pada (deleted_at)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatCategoryDate(detail.deleted_at)}
                    </Typography>
                </div>
            </div>
        </Box>
    );
};

export default DetailCategorySubjectContentDialog;

