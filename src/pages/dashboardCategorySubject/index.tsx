/**
 * DashboardCategorySubject — Page Entry Point
 *
 * Layer: Representation Logic
 */
import { useState } from "react";
import { DashboardHeader } from "@components/Headers";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import CategorySubjectTable from "./List/CategorySubjectTable";
import CreateCategorySubjectCardDialog from "./Create/CreateCategorySubjectCardDialog";

const DashboardCategorySubject = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <>
            <DashboardHeader
                title="Kategori Mata Pelajaran (Category Subject)"
                description="Kelola data kategori kelompok mata pelajaran (Muatan Nasional, Muatan Kejuruan, dll.) di sini"
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setIsCreateOpen(true)}
                    sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
                >
                    Tambah Kategori
                </Button>
            </DashboardHeader>

            <CategorySubjectTable />

            <CreateCategorySubjectCardDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </>
    );
};

export default DashboardCategorySubject;

