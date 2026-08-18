import { Link } from "react-router-dom";

const DashboardProfilePage = () => {
  return (
    <>
      <Link to="/">Dashboard</Link>
      <a href="/dashboard-profile">Dashboard profile</a>
      <h1 className="text-blue-700">Welcome to Dashboard page</h1>
    </>
  );
};

export default DashboardProfilePage;
