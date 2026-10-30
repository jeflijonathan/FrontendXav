/**
 * DashboardSubject — Page Entry Point
 *
 * Layer: Representation Logic
 */
import { useState } from "react";
import { DashboardHeader } from "@components/Headers";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import SubjectTable from "./List/SubjectTable";
import CreateSubjectCardDialog from "./Create/CreateSubjectCardDialog";

const DashboardSubject = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <>
            <DashboardHeader
                title="Data Mata Pelajaran (Subject)"
                description="Kelola data mata pelajaran dan relasi kategori mata pelajaran SMK Xaverius Palembang di sini"
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setIsCreateOpen(true)}
                    sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
                >
                    Tambah Mata Pelajaran
                </Button>
            </DashboardHeader>

            <SubjectTable />

            <CreateSubjectCardDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </>
    );
};

export default DashboardSubject;

