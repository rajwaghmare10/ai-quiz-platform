import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import classService from "../../api/classService";
import quizService from "../../api/quizService";
import StudentListItem from "../../components/teacher/StudentListItem";
import CreateQuizForm from "../../components/teacher/CreateQuizForm";
import QuizListItem from "../../components/teacher/QuizListItem";
import Modal from "../../components/layout/Modal";
import ConfirmDialog from "../../components/layout/ConfirmDialog";

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [quizzesLoading, setQuizzesLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [deleteClassOpen, setDeleteClassOpen] = useState(false);
  const [deleteQuizId, setDeleteQuizId] = useState(null);

  useEffect(() => {
    fetchClass();
    fetchStudents();
    fetchQuizzes();
  }, [classId]);

  const fetchClass = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await classService.getClassById(classId);
      setClassData(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load class");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const data = await classService.getClassStudents(classId);
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setStudentsLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    setQuizzesLoading(true);
    try {
      const data = await quizService.getQuizzesByClass(classId);
      setQuizzes(data);
    } catch (err) {
      console.error("Failed to load quizzes:", err);
    } finally {
      setQuizzesLoading(false);
    }
  };

  const handleCreateQuiz = async (quizData) => {
    const newQuiz = await quizService.createQuiz(quizData);
    setQuizzes((prev) => [newQuiz, ...prev]);
    setQuizModalOpen(false);
  };

  const handleUpdateQuiz = (updatedQuiz) => {
    setQuizzes((prev) =>
      prev.map((q) => (q.quiz_id === updatedQuiz.quiz_id ? updatedQuiz : q))
    );
  };

  const confirmDeleteQuiz = async () => {
    try {
      await quizService.deleteQuiz(deleteQuizId);
      setQuizzes((prev) => prev.filter((q) => q.quiz_id !== deleteQuizId));
      toast.success("Quiz deleted");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete quiz";
      toast.error(message);
    } finally {
      setDeleteQuizId(null);
    }
  };

  const handleDeleteClass = async () => {
    setDeleting(true);
    try {
      await classService.deleteClass(classId);
      toast.success("Class deleted");
      navigate("/teacher/dashboard", { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete class";
      toast.error(message);
      setDeleting(false);
      setDeleteClassOpen(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading class...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!classData) return null;

  return (
    <div>
      <Link
        to="/teacher/dashboard"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      {!classData.is_active && (
        <div className="mb-4 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700">
          This class has been archived.
        </div>
      )}

      <div className="mb-6 flex items-start justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{classData.class_name}</h1>
          {classData.description && (
            <p className="mt-1 text-sm text-gray-500">{classData.description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
              Code: {classData.class_code}
            </span>
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
              {classData.total_students} students
            </span>
          </div>
        </div>
        <button
          onClick={() => setDeleteClassOpen(true)}
          className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <Trash2 size={15} /> Delete
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Quizzes</h2>
        <button
          onClick={() => setQuizModalOpen(true)}
          className="flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus size={16} /> New Quiz
        </button>
      </div>

      {quizzesLoading && <p className="text-sm text-gray-500">Loading quizzes...</p>}
      {!quizzesLoading && quizzes.length === 0 && (
        <p className="text-sm text-gray-500">No quizzes created for this class yet.</p>
      )}
      <div className="mb-8 space-y-3">
        {!quizzesLoading &&
          quizzes.map((quiz) => (
            <QuizListItem
              key={quiz.quiz_id}
              quiz={quiz}
              onDelete={setDeleteQuizId}
              onUpdated={handleUpdateQuiz}
            />
          ))}
      </div>

      <h2 className="mb-3 text-lg font-semibold text-gray-800">Students</h2>
      {studentsLoading && <p className="text-sm text-gray-500">Loading students...</p>}
      {!studentsLoading && students.length === 0 && (
        <p className="text-sm text-gray-500">No students have joined this class yet.</p>
      )}
      {!studentsLoading && students.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {students.map((student) => (
            <StudentListItem key={student.user_id} student={student} />
          ))}
        </div>
      )}

      <Modal isOpen={quizModalOpen} onClose={() => setQuizModalOpen(false)} title="Create a Quiz">
        <CreateQuizForm classId={classId} onCreate={handleCreateQuiz} />
      </Modal>

      <ConfirmDialog
        isOpen={deleteClassOpen}
        onClose={() => setDeleteClassOpen(false)}
        onConfirm={handleDeleteClass}
        title="Delete Class"
        message={`Are you sure you want to delete "${classData.class_name}"? This will remove it from your dashboard.`}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        danger
      />

      <ConfirmDialog
        isOpen={!!deleteQuizId}
        onClose={() => setDeleteQuizId(null)}
        onConfirm={confirmDeleteQuiz}
        title="Delete Quiz"
        message="Are you sure you want to delete this quiz? This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
};

export default ClassDetail;