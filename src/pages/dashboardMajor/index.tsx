import { DashboardHeader } from "@components/Headers";
import { Button } from "@mui/material";
import { useState } from "react";
import MajorTable from "./List/MajorTable";
import CreateMajorCardDialog from "./Create/CreateMajorCardDialog";
import { Add } from "@mui/icons-material";

const DashboardMajor = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <>
            <DashboardHeader
                title="Data Jurusan (Major)"
                description="Kelola data program keahlian / jurusan SMK Xaverius Palembang di sini"
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setIsCreateOpen(true)}
                    sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
                >
                    Tambah Jurusan
                </Button>
            </DashboardHeader>
            <MajorTable />
            <CreateMajorCardDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </>
    );
};

export default DashboardMajor;
