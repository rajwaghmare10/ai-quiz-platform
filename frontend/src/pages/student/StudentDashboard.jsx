import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useJoinedClasses from "../../hooks/useJoinedClasses";
import ClassCard from "../../components/common/ClassCard";
import JoinClassForm from "../../components/student/JoinClassForm";
import Modal from "../../components/layout/Modal";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { classes, loading, error, refetch } = useJoinedClasses();
  const { search, modalOpen, setModalOpen } = useOutletContext();

  const filteredClasses = classes.filter((c) =>
    c.class_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoined = () => {
    refetch();
    setModalOpen(false);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">
        Welcome, {user?.name}
      </h1>

      {loading && <p className="text-gray-500">Loading classes...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && filteredClasses.length === 0 && (
        <p className="text-gray-500">
          {search ? "No classes match your search." : "You haven't joined any classes yet."}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((classItem) => (
          <ClassCard
            key={classItem.class_id}
            classItem={classItem}
            linkTo={`/student/classes/${classItem.class_id}`}
          />
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Join a Class"
      >
        <JoinClassForm onJoined={handleJoined} />
      </Modal>
    </div>
  );
};

export default StudentDashboard;