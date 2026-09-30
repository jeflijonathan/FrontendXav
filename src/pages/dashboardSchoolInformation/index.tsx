import { DashboardHeader } from "@components/Headers";
import { Button } from "@mui/material";
import SchoolInformationTable from "./List/SchoolnformationTable";
import { useState } from "react";
import CreateSchoolInfoFormCardDialog from "./Create/CreateSchoolInfoCardDialog";

const DashboardSchoolInformation = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleDialogOpen = () => {
        return setIsCreateOpen(!isCreateOpen)
    }

    return (
        <>
            <DashboardHeader title="Informasi Sekolah" description="Berikut adalah informasi sekolah" >
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Create School Info
                </Button>
            </DashboardHeader>
            <SchoolInformationTable />
            <CreateSchoolInfoFormCardDialog
                isOpen={isCreateOpen}
                onClose={handleDialogOpen}
            />
        </>
    )
}
export default DashboardSchoolInformation;