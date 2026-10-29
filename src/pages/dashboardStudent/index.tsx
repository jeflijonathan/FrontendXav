import { DashboardHeader } from "@components/Headers";
import { Button } from "@mui/material";
import { useState } from "react";
import StudentTable from "./List/StudentTable";
import CreateStudentCardDialog from "./Create/CreateStudentCardDialog";

const DashboardStudent = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    return (
        <>
            <DashboardHeader title="Data Siswa (Student)" description="Kelola data siswa di sini">
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Tambah Siswa
                </Button>
            </DashboardHeader>
            <StudentTable />
            <CreateStudentCardDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        </>
    );
};

export default DashboardStudent;
