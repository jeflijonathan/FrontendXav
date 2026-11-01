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
import DashboardCategorySubject from "@pages/dashboardCategorySubject";
import DashboardSubject from "@pages/dashboardSubject";
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
        path: "/category-subjects",
        element: <DashboardCategorySubject />,
      },
      {
        path: "/subjects",
        element: <DashboardSubject />,
      },
      {
        path: "/school-informations",
        element: <DashboardSchoolInformation />,
      },
      {
        path: "/announcements",
        element: <DashboardAnnouncement />,
      },
      {
        path: "/roster-jam",
        element: <DashboardRosterJam />,
      },
    ],
  },
]);

export default routes;
