import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import ScheduleHeader from './components/ScheduleHeader';
import TeacherScheduleRequestPanel from './components/TeacherScheduleRequestPanel';
import ScheduleControlBar from './components/ScheduleControlBar';
import ScheduleMatrixTable from './components/ScheduleMatrixTable';
import PerClassScheduleView from './components/PerClassScheduleView';
import GuruPiketAndApprovalCard from './components/GuruPiketAndApprovalCard';
import ClassListConflictDialog from './components/ClassListConflictDialog';
import InputScheduleRequestDialog from './components/InputScheduleRequestDialog';
import AutoGenerateScheduleDialog from './components/AutoGenerateScheduleDialog';
import JpRecommendationModal from './components/JpRecommendationModal';
import SchedulePrintDialog from './components/SchedulePrintDialog';
import { useScheduleStore } from './store/useScheduleStore';
import { useSchedulePermissions } from './utils/permissions';

const DashboardSchedule: React.FC = () => {
    const { viewMode, loadScheduleFromDatabase } = useScheduleStore();
    const { canEditSchedule } = useSchedulePermissions();

    useEffect(() => {
        // Load data from MySQL database on initial mount
        loadScheduleFromDatabase();
    }, [loadScheduleFromDatabase]);

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 3 },
                bgcolor: 'transparent',
                minHeight: '100vh',
            }}
        >
            {/* Top Filter and Actions Header (Title, Period, Save, Generate, Export) */}
            <ScheduleHeader />

            {/* Panel Request Jadwal Pengajar (Khusus Kurikulum & Kepala Sekolah) */}
            {canEditSchedule && <TeacherScheduleRequestPanel />}

            {/* Bar Kontrol Sesuai Request User: Ditaruh Sesudah Panel Request */}
            {/* (View Switcher Versi 1 vs Versi 2, KPI Stats, Filter Ruang Kelas, Tombol Pop-up Kelas & Grid Pills) */}
            <ScheduleControlBar />

            {/* View Switcher: Tabel Matriks (Semua Kelas) vs Input Jadwal Per-Kelas */}
            {viewMode === 'matrix' ? (
                <>
                    {/* Main Interactive Matrix Schedule Table (Lampiran 3) */}
                    <ScheduleMatrixTable />

                    {/* Duty Teacher (Guru Piket) & Approval Card */}
                    <GuruPiketAndApprovalCard />
                </>
            ) : (
                <>
                    {/* Dedicated Per-Class Schedule Input & View */}
                    <PerClassScheduleView />
                </>
            )}

            {/* Dialogs */}
            <ClassListConflictDialog />
            <InputScheduleRequestDialog />
            <AutoGenerateScheduleDialog />
            <JpRecommendationModal />
            <SchedulePrintDialog />
        </Box>
    );
};

export default DashboardSchedule;
