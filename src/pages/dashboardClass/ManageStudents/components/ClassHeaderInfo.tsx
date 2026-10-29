import React from "react";
import { Box, Typography, Chip, Avatar } from "@mui/material";
import { School, Groups } from "@mui/icons-material";
import type { ClassResponseModel } from "@api/class/model";

interface ClassHeaderInfoProps {
    classItem: ClassResponseModel;
    classNameDisplay: string;
    totalStudents: number;
}

export const ClassHeaderInfo: React.FC<ClassHeaderInfoProps> = ({
    classItem,
    classNameDisplay,
    totalStudents,
}) => {
    const guardianName = classItem.class_guardian
        ? `${classItem.class_guardian.first_name} ${classItem.class_guardian.last_name || ""}`.trim()
        : "Belum ditentukan";

    return (
        <Box
            sx={{
                p: 2.5,
                borderRadius: 2.5,
                bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f8fafc"),
                border: 1,
                borderColor: "divider",
                mb: 3,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 44, height: 44 }}>
                    <School />
                </Avatar>
                <div>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {classNameDisplay}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {classItem.major?.name || "Jurusan"} • Wali: {guardianName}
                    </Typography>
                </div>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                    icon={<Groups sx={{ fontSize: 18 }} />}
                    label={`${totalStudents} Total Siswa`}
                    color="primary"
                    sx={{ fontWeight: 600, px: 0.5 }}
                />
                <Chip
                    label={classItem.status ? "Kelas Aktif" : "Non Aktif"}
                    color={classItem.status ? "success" : "default"}
                    size="small"
                    variant="outlined"
                />
            </Box>
        </Box>
    );
};

export default ClassHeaderInfo;

