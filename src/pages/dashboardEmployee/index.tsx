import { DashboardHeader } from "@components/Headers";
import { Button } from "@mui/material";
import { useState } from "react";
import EmployeeTable from "./List/EmployeeTable";
import CreateEmployeeCardDialog from "./Create/CreateEmployeeCardDialog";

const DashboardEmployee = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    return (
        <>
            <DashboardHeader title="Data Karyawan (Employee)" description="Kelola data karyawan di sini">
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Tambah Karyawan
                </Button>
            </DashboardHeader>
            <EmployeeTable />
            <CreateEmployeeCardDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        </>
    );
};

export default DashboardEmployee;
