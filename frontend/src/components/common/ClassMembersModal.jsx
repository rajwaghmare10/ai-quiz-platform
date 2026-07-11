import { useEffect, useState } from "react";
import Modal from "../layout/Modal";
import classService from "../../api/classService";

const ClassMembersModal = ({ isOpen, onClose, classId, teacherName }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) fetchStudents();
  }, [isOpen, classId]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await classService.getClassStudents(classId);
      setStudents(data);
    } catch (err) {
      console.error("Failed to load class members:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Class Members">
      <div className="mb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Teacher</p>
        <p className="mt-1 text-sm font-medium text-gray-800">{teacherName || "—"}</p>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          Students ({students.length})
        </p>
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading && students.length === 0 && (
          <p className="text-sm text-gray-500">No students have joined yet.</p>
        )}
        {!loading && students.length > 0 && (
          <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-100">
            {students.map((student) => {
              const initial = student.name?.charAt(0).toUpperCase() || "?";
              return (
                <div
                  key={student.user_id}
                  className="flex items-center gap-3 border-b border-gray-100 px-3 py-2 last:border-b-0"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                    {initial}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ClassMembersModal;