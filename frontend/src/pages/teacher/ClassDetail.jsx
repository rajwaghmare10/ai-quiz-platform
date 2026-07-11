import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Trash2, Plus, ListChecks, Users } from "lucide-react";
import classService from "../../api/classService";
import quizService from "../../api/quizService";
import StudentListItem from "../../components/teacher/StudentListItem";
import CreateQuizForm from "../../components/teacher/CreateQuizForm";
import QuizListItem from "../../components/teacher/QuizListItem";
import Modal from "../../components/layout/Modal";
import ConfirmDialog from "../../components/layout/ConfirmDialog";
import { getClassTheme } from "../../utils/classTheme";

const TABS = [
  { key: "quizzes", label: "Quizzes", icon: ListChecks },
  { key: "students", label: "Students", icon: Users },
];


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

  const [activeTab, setActiveTab] = useState("quizzes");
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

  const theme = getClassTheme(classData.class_id);

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

      {/* Hero header */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className={`relative bg-gradient-to-br ${theme.gradient} px-6 py-8`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{classData.class_name}</h1>
              {classData.description && (
                <p className="mt-1 text-sm text-white/85">{classData.description}</p>
              )}
            </div>
            <button
              onClick={() => setDeleteClassOpen(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/25"
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>

          {/* Decorative circles, subtle */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -right-2 bottom-0 h-16 w-16 rounded-full bg-white/10" />
        </div>

        <div className="flex flex-wrap items-center gap-3 px-6 py-4">
          <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-mono font-medium text-gray-700">
            {classData.class_code}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <Users size={15} /> {classData.total_students} students
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <ListChecks size={15} /> {quizzes.length} quizzes
          </span>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${activeTab === tab.key
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <Icon size={15} />
              {tab.label}
              <span
                className={`ml-1 rounded-full px-1.5 text-xs ${activeTab === tab.key ? "bg-primary-100 text-primary-700" : "bg-gray-200 text-gray-500"
                  }`}
              >
                {tab.key === "quizzes" ? quizzes.length : students.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quizzes tab */}
      {activeTab === "quizzes" && (
        <div>
          <div className="mb-3 flex justify-end">
            <button
              onClick={() => setQuizModalOpen(true)}
              className="flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Plus size={16} /> New Quiz
            </button>
          </div>

          {quizzesLoading && <p className="text-sm text-gray-500">Loading quizzes...</p>}
          {!quizzesLoading && quizzes.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center">
              <p className="text-sm text-gray-500">No quizzes created for this class yet.</p>
            </div>
          )}
          <div className="space-y-3">
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
        </div>
      )}

      {/* Students tab */}
      {activeTab === "students" && (
        <div>
          {studentsLoading && <p className="text-sm text-gray-500">Loading students...</p>}
          {!studentsLoading && students.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center">
              <p className="text-sm text-gray-500">No students have joined this class yet.</p>
            </div>
          )}
          {!studentsLoading && students.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {students.map((student) => (
                <StudentListItem key={student.user_id} student={student} />
              ))}
            </div>
          )}
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