import useAuth from "../../hooks/useAuth";
import useJoinedClasses from "../../hooks/useJoinedClasses";
import ClassCard from "../../components/common/ClassCard";
import JoinClassForm from "../../components/student/JoinClassForm";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { classes, loading, error, refetch } = useJoinedClasses();

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Welcome, {user?.name}</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <h3>Join a Class</h3>
      <JoinClassForm onJoined={refetch} />

      <h3>Your Classes</h3>
      {loading && <p>Loading classes...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && classes.length === 0 && (
        <p>You haven't joined any classes yet.</p>
      )}
      {!loading &&
        classes.map((classItem) => (
          <ClassCard
            key={classItem.class_id}
            classItem={classItem}
            linkTo={`/student/classes/${classItem.class_id}`}
          />
        ))}
    </div>
  );
};

export default StudentDashboard;