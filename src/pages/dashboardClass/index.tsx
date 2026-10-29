import { DashboardHeader } from "@components/Headers";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import ClassTable from "./List/ClassTable";
import CreateClassCardDialog from "./Create/CreateClassCardDialog";

const DashboardClass = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <>
            <DashboardHeader
                title="Data Kelas (Class)"
                description="Kelola data kelas rombel, tingkat (10/11/12), jurusan, wali kelas, dan periode sekolah"
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setIsCreateOpen(true)}
                    sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600 }}
                >
                    Tambah Kelas
                </Button>
            </DashboardHeader>
            <ClassTable />
            <CreateClassCardDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </>
    );
};

export default DashboardClass;
