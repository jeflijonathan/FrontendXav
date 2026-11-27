import { DashboardHeader } from "@components/Headers";
import DailyAttendanceView from "./List/DailyAttendanceView";

const DashboardDailyAttendance = () => {
    return (
        <>
            <DashboardHeader
                title="Buku Induk Kehadiran Harian"
                description="Absensi harian kelas (1x per hari) berdasarkan Kalender Akademik — diinput oleh Pengurus Kelas & dapat diedit oleh Guru Piket."
            />
            <DailyAttendanceView />
        </>
    );
};

export default DashboardDailyAttendance;
