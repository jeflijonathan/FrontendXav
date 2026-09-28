import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./common/layouts/DashboardLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import DashboardProfilePage from "./pages/DashboardProfile/DashboardProfilePage";
// import EmployeeTable from "./pages/dashboardEmployee/List";
// import StudentTable from "./pages/dashboardStudent/List";
// import SubjectTable from "./pages/dashboardSubject/List";
// import CategorySubjectTable from "./pages/dashboardCategorySubject/List";
// import MajorTable from "./pages/dashboardMajor/List";
// import ClassTable from "./pages/dashboardClass/List";
// import ClassroomTable from "./pages/dashboardClassroom/List";
// import TeacherSubjectTable from "./pages/dashboardTeacherSubject/List";
// import SchoolInformationTable from "./pages/dashboardSchoolInformation/List";
// import EffectiveWeekTable from "./pages/dashboardEffectiveWeek/List";
// import CategoryScheduleTimeTable from "./pages/dashboardCategoryScheduleTime/List";
// import ScheduleTimeTable from "./pages/dashboardScheduleTime/List";
// import ScheduleTable from "./pages/dashboardSchedule/List";
import WhatsappConnections from "./pages/settings/WhatsappConnections";
import TestMenuPage from "./pages/testMenu";
import DashboardSchendule from "@pages/dashboardSchedules";

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
      // {
      //   path: "/employees",
      //   element: <EmployeeTable />,
      // },
      // {
      //   path: "/students",
      //   element: <StudentTable />,
      // },
      // {
      //   path: "/subjects",
      //   element: <SubjectTable />,
      // },
      // {
      //   path: "/category-subjects",
      //   element: <CategorySubjectTable />,
      // },
      // {
      //   path: "/majors",
      //   element: <MajorTable />,
      // },
      // {
      //   path: "/classes",
      //   element: <ClassTable />,
      // },
      // {
      //   path: "/classrooms",
      //   element: <ClassroomTable />,
      // },
      // {
      //   path: "/teacher-subjects",
      //   element: <TeacherSubjectTable />,
      // },
      // {
      //   path: "/school-informations",
      //   element: <SchoolInformationTable />,
      // },
      // {
      //   path: "/effective-weeks",
      //   element: <EffectiveWeekTable />,
      // },
      // {
      //   path: "/category-schedule-times",
      //   element: <CategoryScheduleTimeTable />,
      // },
      // {
      //   path: "/schedule-times",
      //   element: <ScheduleTimeTable />,
      // },
      {
        path: "/schedules",
        element: <DashboardSchendule />,
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
