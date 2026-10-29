import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import type { UploadFileResponseModel } from "@api/uploadFile/model";

interface DetailUploadFileContentProps {
    detail: UploadFileResponseModel;
}

const Row = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex flex-col gap-1">
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body2">{value || "-"}</Typography>
    </div>
);

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const DetailUploadFileContent: React.FC<DetailUploadFileContentProps> = ({ detail }) => {
    return (
        <div className="flex flex-col gap-4">
            <Row label="File ID" value={detail.id} />
            <Row label="Filename" value={detail.original_name || detail.filename} />

            <div className="grid grid-cols-2 gap-4">
                <Row label="MIME Type" value={detail.mime_type || detail.content_type} />
                <Row label="File Size" value={formatFileSize(detail.file_size)} />
            </div>

            <Row label="File URL / Path" value={detail.file_url || detail.file_path} />

            <Divider />

            <div className="grid grid-cols-2 gap-4">
                <Row label="Upload Date" value={(detail.created_at || detail.upload_date) ? new Date(detail.created_at || detail.upload_date!).toLocaleString() : "-"} />
                <Row label="Upload By" value={detail.upload_by || "-"} />
            </div>
        </div>
    );
};

export default DetailUploadFileContent;
