import React, { useState } from "react";
import { Box, Typography, Chip, Divider } from "@mui/material";
import type { EmployeeResponseModel } from "@api/employee/model";
import ImagePreviewModal from "@components/feedback/ImagePreviewModal";

interface DetailEmployeeContentProps {
    detail: EmployeeResponseModel;
}

const Row = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex flex-col gap-1">
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body2">{value || "-"}</Typography>
    </div>
);

const DetailEmployeeContent: React.FC<DetailEmployeeContentProps> = ({ detail }) => {
    const [isPhotoPreviewOpen, setIsPhotoPreviewOpen] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                {detail.profile_url ? (
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/api/upload/${detail.profile_url}`}
                        alt="Foto Profil Pegawai"
                        onClick={() => setIsPhotoPreviewOpen(true)}
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid #e0e0e0',
                            cursor: 'pointer',
                        }}
                        title="Klik untuk memperbesar foto"
                    />
                ) : (
                    <Box sx={{ width: 120, height: 120, borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h4" color="text.secondary">?</Typography>
                    </Box>
                )}
            </Box>

            <Row label="Employee ID" value={detail.id} />
            <Row label="User ID" value={detail.user_id} />
            <Row label="Username" value={detail.user?.username} />

            <div className="grid grid-cols-2 gap-4">
                <Row label="First Name" value={detail.first_name} />
                <Row label="Last Name" value={detail.last_name} />
            </div>

            <Row label="NIY" value={detail.niy} />
            <Row label="Email" value={detail.email} />
            <Row label="Phone Number" value={detail.detail?.phone_number} />

            <div className="grid grid-cols-2 gap-4">
                <Row label="Jenis Kelamin" value={detail.detail?.gender === "L" ? "Laki-laki" : detail.detail?.gender === "P" ? "Perempuan" : "-"} />
                <Row label="Tanggal Lahir" value={detail.detail?.birth_date} />
            </div>

            <Row label="Tempat Lahir" value={detail.detail?.birth_place} />
            <Row label="Alamat" value={detail.detail?.address} />

            <div className="grid grid-cols-3 gap-4">
                <Row label="RT" value={detail.detail?.RT} />
                <Row label="RW" value={detail.detail?.RW} />
                <Row label="Kode Pos" value={detail.detail?.zip_code} />
            </div>

            <Row label="Deskripsi" value={detail.detail?.description} />

            <Divider />

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Chip label={detail.status ? "Aktif" : "Non Aktif"} color={detail.status ? "success" : "error"} size="small" sx={{ width: "fit-content" }} />
                </div>
                <Row label="Created At" value={new Date(detail.created_at).toLocaleDateString()} />
            </div>

            {detail.profile_url && (
                <ImagePreviewModal
                    open={isPhotoPreviewOpen}
                    onClose={() => setIsPhotoPreviewOpen(false)}
                    src={`${import.meta.env.VITE_BACKEND_URL}/api/upload/${detail.profile_url}`}
                    title={`${detail.first_name} ${detail.last_name || ""}`}
                />
            )}
        </div>
    );
};

export default DetailEmployeeContent;
