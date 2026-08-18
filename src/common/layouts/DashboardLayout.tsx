import { Outlet } from "react-router-dom";
import NavbarApp from "./NavbarApp";
import SidebarApp from "./SidebarApp";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-theme-primary transition-colors duration-300">
      <SidebarApp />
      <main className="flex flex-col flex-1 h-full overflow-hidden">
        <NavbarApp />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-theme-secondary text-primary-txt transition-colors duration-300">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
