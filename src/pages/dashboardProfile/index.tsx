import LocalStorage from "@utils/localStorage";
import useAuthStore from "@common/store/useAuthStore";
import EmployeeProfile from "./EmployeeProfile/EmployeeProfile";
import StudentProfile from "./StudentProfile/StudentProfile";

const DashboardProfile = () => {
    const { activeRole, user } = useAuthStore();
    const storedUser: any = LocalStorage().getItem<any>("user");
    const storedActiveRole = LocalStorage().getItem<string>("active_role");

    const currentRole = (
        activeRole ||
        storedActiveRole ||
        user?.active_role ||
        storedUser?.active_role ||
        (user?.user_type === "employee" ? "guru" : "student") ||
        ""
    ).toLowerCase().trim();

    const listProfileComponents = [
        {
            role: ["student", "pengurus kelas"],
            component: <StudentProfile />
        },
        {
            role: ["kurikulum", "guru", "walikelas", "tu", "admin", "superadmin", "employee"],
            component: <EmployeeProfile />
        }
    ];

    const matched = listProfileComponents.find((item) =>
        item.role.some((r) => r.toLowerCase() === currentRole)
    );

    return matched ? matched.component : (user?.user_type === "employee" ? <EmployeeProfile /> : <StudentProfile />);
};

export default DashboardProfile;
