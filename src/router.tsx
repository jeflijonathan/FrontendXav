import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./common/layouts/DashboardLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import DashboardSchoolInformation from "@pages/dashboardSchoolInformation";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import DashboardEmployee from "@pages/dashboardEmployee";
import DashboardStudent from "@pages/dashboardStudent";
import DashboardAnnouncement from "@pages/dashboardAnnouncement";
import DashboardUploadFile from "@pages/dashboardUploadFile";
import DashboardRosterJam from "@pages/dashboardRosterJam";
import DashboardMajor from "@pages/dashboardMajor";
import DashboardClass from "@pages/dashboardClass";
import DashboardCategorySubject from "@pages/dashboardCategorySubject";

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
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/employees",
        element: <DashboardEmployee />
      },
      {
        path: "/students",
        element: <DashboardStudent />
      },
      {
        path: "/majors",
        element: <DashboardMajor />
      },
      {
        path: "/uploads",
        element: <DashboardUploadFile />
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
        path: "/school-informations",
        element: <DashboardSchoolInformation />,
      },
      {
        path: "/announcements",
        element: <DashboardAnnouncement />
      },
      {
        path: "/roster-jam",
        element: <DashboardRosterJam />,
      },
    ],
  },
]);

export default routes;
