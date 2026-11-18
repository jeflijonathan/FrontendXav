import React, { useState } from "react";
import { DashboardHeader } from "@components/Headers";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import CategoryExtraTable from "./List/CategoryExtraTable";
import CreateCategoryExtraDialog from "./Create/CreateCategoryExtraDialog";
import { useScheduleStore } from "../dashboardSchedule/store/useScheduleStore";

const DashboardCategoryExtra: React.FC = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const { fetchCategoryExtras } = useScheduleStore();

    const handleDataChanged = () => {
        setRefreshTrigger((prev) => prev + 1);
        fetchCategoryExtras();
    };

    return (
        <div className="flex flex-col gap-6">
            <DashboardHeader
                title="Kategori Ekstrakurikuler"
                description="Kelola kategori kegiatan ekstrakurikuler (Pramuka, PMR, Paskibra, dll.) untuk penjadwalan pelajaran per-kelas"
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

            <CategoryExtraTable
                refreshTrigger={refreshTrigger}
                onDataChanged={handleDataChanged}
            />

            <CreateCategoryExtraDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={() => {
                    handleDataChanged();
                }}
            />
        </div>
    );
};

export default DashboardCategoryExtra;
