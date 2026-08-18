import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./common/layouts/DashboardLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import DashboardProfilePage from "./pages/DashboardProfile/DashboardProfilePage";
import EmployeeTable from "./pages/dashboardEmployee/List";
import StudentTable from "./pages/dashboardStudent/List";
import SubjectTable from "./pages/dashboardSubject/List";
import CategorySubjectTable from "./pages/dashboardCategorySubject/List";
import WhatsappConnections from "./pages/settings/WhatsappConnections";
import TestMenuPage from "./pages/testMenu";

const routes = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/dashboard-profile",
        element: <DashboardProfilePage />,
      },
      {
        path: "/employees",
        element: <EmployeeTable />,
      },
      {
        path: "/students",
        element: <StudentTable />,
      },
      {
        path: "/subjects",
        element: <SubjectTable />,
      },
      {
        path: "/category-subjects",
        element: <CategorySubjectTable />,
      },
      {
        path: "/settings/whatsapp-connections",
        element: <WhatsappConnections />,
      },
      {
        path: "/test-menu",
        element: <TestMenuPage />,
      },
    ],
  },
]);

export default routes;
