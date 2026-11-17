import { useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { DashboardHeader } from "@components/Headers";
import TeachingTable from "./List/TeachingTable";
import CreateTeachingAssignmentCardDialog from "./Create/CreateTeachingAssignmentCardDialog";

const DashboardTeaching = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <>
            <DashboardHeader
                title="Tabel Pengajar"
                description="Satu guru dapat mengajar di banyak kelas dan periode. Setiap guru maksimal mengampu 4 mata pelajaran."
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setIsCreateOpen(true)}
                    sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600 }}
                >
                    Tambah Penugasan
                </Button>
            </DashboardHeader>

            <TeachingTable />

            <CreateTeachingAssignmentCardDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </>
    );
};

export default DashboardTeaching;
