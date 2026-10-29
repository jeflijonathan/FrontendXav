import React from "react";
import { Typography, Chip, Divider } from "@mui/material";
import type { MajorResponseModel } from "@api/major/model";

interface DetailMajorContentProps {
    detail: MajorResponseModel;
}

const DetailRow = ({ label, value }: { label: string; value?: string | React.ReactNode }) => (
    <div className="flex flex-col gap-1">
        <Typography variant="caption" color="text.secondary">
            {label}
        </Typography>
        {typeof value === "string" ? (
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {value || "-"}
            </Typography>
        ) : (
            value || <Typography variant="body2">-</Typography>
        )}
    </div>
);

const DetailMajorContent: React.FC<DetailMajorContentProps> = ({ detail }) => {
    const formattedCreatedAt = detail.created_at
        ? new Date(detail.created_at).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "-";

    const formattedUpdatedAt = detail.updated_at
        ? new Date(detail.updated_at).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "-";

    return (
        <div className="flex flex-col gap-4 py-2">
            <DetailRow label="ID Major" value={detail.id_major} />
            <DetailRow label="Nama Jurusan" value={detail.name} />

            <div className="flex flex-col gap-1">
                <Typography variant="caption" color="text.secondary">
                    Status
                </Typography>
                <Chip
                    label={detail.status ? "Aktif" : "Non Aktif"}
                    color={detail.status ? "success" : "default"}
                    size="small"
                    sx={{ width: "fit-content" }}
                />
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-4">
                <DetailRow label="Dibuat Pada" value={formattedCreatedAt} />
                <DetailRow label="Diperbarui Pada" value={formattedUpdatedAt} />
            </div>
        </div>
    );
};

export default DetailMajorContent;
