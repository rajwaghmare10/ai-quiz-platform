import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useClasses from "../../hooks/useClasses";
import ClassCard from "../../components/common/ClassCard";
import CreateClassForm from "../../components/teacher/CreateClassForm";
import Modal from "../../components/layout/Modal";
import ConfirmDialog from "../../components/layout/ConfirmDialog";
import classService from "../../api/classService";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { classes, loading, error, addClass, refetch } = useClasses();
  const { search, modalOpen, setModalOpen } = useOutletContext();
  const [deleteClassId, setDeleteClassId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filteredClasses = classes.filter((c) =>
    c.class_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (data) => {
    await addClass(data);
    setModalOpen(false);
  };

  const confirmDeleteClass = async () => {
    setDeleting(true);
    try {
      await classService.deleteClass(deleteClassId);
      toast.success("Class deleted");
      refetch();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete class";
      toast.error(message);
    } finally {
      setDeleting(false);
      setDeleteClassId(null);
    }
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
          {search ? "No classes match your search." : "You haven't created any classes yet."}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((classItem) => (
          <ClassCard
            key={classItem.class_id}
            classItem={classItem}
            linkTo={`/teacher/classes/${classItem.class_id}`}
            onDeleted={setDeleteClassId}
          />
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create a Class"
      >
        <CreateClassForm onCreate={handleCreate} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteClassId}
        onClose={() => setDeleteClassId(null)}
        onConfirm={confirmDeleteClass}
        title="Delete Class"
        message="Are you sure you want to delete this class? This will remove it from your dashboard."
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        danger
      />
    </div>
  );
};

export default TeacherDashboard;