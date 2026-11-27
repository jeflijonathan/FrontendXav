import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./common/layouts/DashboardLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import DashboardSchoolInformation from "@pages/dashboardSchoolInformation";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import LoginPegawai from "./pages/Auth/LoginPegawai";
import LoginSiswa from "./pages/Auth/LoginSiswa";
import DashboardEmployee from "@pages/dashboardEmployee";
import DashboardStudent from "@pages/dashboardStudent";
import DashboardAnnouncement from "@pages/dashboardAnnouncement";
import DashboardUploadFile from "@pages/dashboardUploadFile";
import DashboardRosterJam from "@pages/dashboardRosterJam";
import DashboardMajor from "@pages/dashboardMajor";
import DashboardClass from "@pages/dashboardClass";
import DashboardTeaching from "@pages/dashboardTeaching";
import DashboardCategorySubject from "@pages/dashboardCategorySubject";
import DashboardCategoryExtra from "@pages/dashboardCategoryExtra";
import DashboardSubject from "@pages/dashboardSubject";
import DashboardAcademicCalendar from "@pages/dashboardAcademicCalendar";
import DashboardEffectiveHours from "@pages/dashboardEffectiveHours";
import DashboardSchedule from "@pages/dashboardSchedule";
import DashboardAttendance from "@pages/dashboardAttendance";
import DashboardDailyAttendance from "@pages/dashboardDailyAttendance";
import DashboardProfile from "@pages/dashboardProfile";
import { ProtectedRoute } from "./common/components/Auth/ProtectedRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/login/pegawai",
    element: <LoginPegawai />,
  },
  {
    path: "/login/siswa",
    element: <LoginSiswa />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/employees",
        element: (
          <ProtectedRoute allowedRoles={["TU", "kurikulum"]}>
            <DashboardEmployee />
          </ProtectedRoute>
        ),
      },
      {
        path: "/students",
        element: (
          <ProtectedRoute allowedRoles={["TU", "kurikulum"]}>
            <DashboardStudent />
          </ProtectedRoute>
        ),
      },
      {
        path: "/majors",
        element: <DashboardMajor />,
      },
      {
        path: "/uploads",
        element: <DashboardUploadFile />,
      },
      {
        path: "/classes",
        element: <DashboardClass />,
      },
      {
        path: "/teaching-staff",
        element: (
          <ProtectedRoute allowedRoles={["kepala_sekolah", "kurikulum", "admin", "superadmin"]}>
            <DashboardTeaching />
          </ProtectedRoute>
        ),
      },
      {
        path: "/category-subjects",
        element: <DashboardCategorySubject />,
      },
      {
        path: "/category-extras",
        element: <DashboardCategoryExtra />,
      },
      {
        path: "/subjects",
        element: <DashboardSubject />,
      },
      {
        path: "/school-informations",
        element: (
          <ProtectedRoute
            allowedRoles={["kurikulum", "kepala_sekolah", "tu", "admin", "superadmin"]}
          >
            <DashboardSchoolInformation />
          </ProtectedRoute>
        ),
      },
      {
        path: "/announcements",
        element: (
          <ProtectedRoute
            allowedRoles={[
              "kurikulum",
              "kepala_sekolah",
              "tu",
              "kesiswaan",
              "admin",
              "superadmin",
            ]}
          >
            <DashboardAnnouncement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/roster-jam",
        element: (
          <ProtectedRoute allowedRoles={["kepala_sekolah", "kurikulum", "admin", "superadmin"]}>
            <DashboardRosterJam />
          </ProtectedRoute>
        ),
      },
      {
        path: "/kalender-akademik",
        element: <DashboardAcademicCalendar />,
      },
      {
        path: "/alokasi-jp",
        element: (
          <ProtectedRoute allowedRoles={["kepala_sekolah", "kurikulum", "admin", "superadmin"]}>
            <DashboardEffectiveHours />
          </ProtectedRoute>
        ),
      },
      {
        path: "/jadwal-pelajaran",
        element: <DashboardSchedule />,
      },
      {
        path: "/presensi-siswa",
        element: <DashboardAttendance />,
      },
      {
        path: "/buku-induk-kehadiran",
        element: (
          <ProtectedRoute
            allowedRoles={[
              "pengurus_kelas",
              "guru_piket",
              "wali_kelas",
              "walikelas",
              "kurikulum",
              "kesiswaan",
              "kepala_sekolah",
              "admin",
              "superadmin",
              "TU",
              "tu",
            ]}
          >
            <DashboardDailyAttendance />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard-profile",
        element: <DashboardProfile />,
      },
      {
        path: "/dashboardProfile",
        element: <DashboardProfile />,
      },
      {
        path: "/profile",
        element: <DashboardProfile />,
      },
    ],
  },
]);

export default routes;
