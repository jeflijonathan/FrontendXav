import { DashboardHeader } from "@components/Headers";
import { Button } from "@mui/material";
import { useState } from "react";
import CreateAnnouncementCardDialog from "./Create/CreateAnnouncementCardDialog";
import AnnouncementTable from "./LIst/TableAnnouncementContent";

const DashboardAnnouncement = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(
        {
            create: false,
            update: false,
            detail: false,
        }
    )

    return (
        <>
            <DashboardHeader title="Pengumuman" description="Berikut adalah pengumuman" >
                <Button variant="contained" color="primary" onClick={() => setIsDialogOpen(prev => ({ ...prev, create: !prev.create }))}>
                    Buat Pengumuman
                </Button>
            </DashboardHeader>
            <AnnouncementTable />
            <CreateAnnouncementCardDialog
                isOpen={isDialogOpen.create}
                onClose={() => setIsDialogOpen(prev => ({ ...prev, create: false }))}
            />
        </>
    )
}
export default DashboardAnnouncement;