import useAuth from "../../hooks/useAuth";
import useClasses from "../../hooks/useClasses";
import ClassCard from "../../components/common/ClassCard";
import CreateClassForm from "../../components/teacher/CreateClassForm";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const { classes, loading, error, addClass } = useClasses();

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Welcome, {user?.name}</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <h3>Create a New Class</h3>
      <CreateClassForm onCreate={addClass} />

      <h3>Your Classes</h3>
      {loading && <p>Loading classes...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && classes.length === 0 && (
        <p>You haven't created any classes yet.</p>
      )}
      {!loading &&
        classes.map((classItem) => (
          <ClassCard
            key={classItem.class_id}
            classItem={classItem}
            linkTo={`/teacher/classes/${classItem.class_id}`}
          />
        ))}
    </div>
  );
};

export default TeacherDashboard;
