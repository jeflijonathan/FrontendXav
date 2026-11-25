import useAuthStore from "@common/store/useAuthStore";
import { getCookie } from "@utils/cookie";
import EmployeeProfile from "./EmployeeProfile/EmployeeProfile";
import StudentProfile from "./StudentProfile/StudentProfile";

const DashboardProfile = () => {
    const { activeRole, user } = useAuthStore();
    const cookieRole = getCookie("active_role");

    const currentRole = (
        activeRole ||
        cookieRole ||
        user?.active_role ||
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
