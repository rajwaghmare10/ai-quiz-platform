import useAuth from "../../hooks/useAuth";

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "24px" }}>
      <h2>Student Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default StudentDashboard;