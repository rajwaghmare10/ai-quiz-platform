import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import classService from "../../api/classService";
import quizService from "../../api/quizService";
import StudentListItem from "../../components/teacher/StudentListItem";
import CreateQuizForm from "../../components/teacher/CreateQuizForm";
import QuizListItem from "../../components/teacher/QuizListItem";

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
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await quizService.deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((q) => q.quiz_id !== quizId));
      toast.success("Quiz deleted");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete quiz";
      toast.error(message);
    }
  };

  const handleDeleteClass = async () => {
    const confirmed = window.confirm(
      `Delete "${classData.class_name}"? This will remove it from your dashboard.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await classService.deleteClass(classId);
      toast.success("Class deleted");
      navigate("/teacher/dashboard", { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete class";
      toast.error(message);
      setDeleting(false);
    }
  };

  if (loading) return <p style={{ padding: "24px" }}>Loading class...</p>;
  if (error) return <p style={{ padding: "24px", color: "red" }}>{error}</p>;
  if (!classData) return null;

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <Link to="/teacher/dashboard">&larr; Back to Dashboard</Link>

      {!classData.is_active && (
        <p style={{ color: "#a15c00", background: "#fff4e0", padding: "8px 12px", borderRadius: "6px" }}>
          This class has been archived.
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "16px" }}>
        <div>
          <h2 style={{ margin: 0 }}>{classData.class_name}</h2>
          {classData.description && <p>{classData.description}</p>}
        </div>

        <button
          onClick={handleDeleteClass}
          disabled={deleting}
          style={{ color: "red" }}
        >
          {deleting ? "Deleting..." : "Delete Class"}
        </button>
      </div>

      <div style={{ marginTop: "16px" }}>
        <p>
          <strong>Class Code:</strong> {classData.class_code}
        </p>
        <p>
          <strong>Teacher:</strong> {classData.teacher_name}
        </p>
        <p>
          <strong>Students Enrolled:</strong> {classData.total_students}
        </p>
      </div>

      <h3 style={{ marginTop: "24px" }}>Create a Quiz</h3>
      <CreateQuizForm classId={classId} onCreate={handleCreateQuiz} />

      <h3>Quizzes</h3>
      {quizzesLoading && <p>Loading quizzes...</p>}
      {!quizzesLoading && quizzes.length === 0 && (
        <p>No quizzes created for this class yet.</p>
      )}
      {!quizzesLoading &&
        quizzes.map((quiz) => (
          <QuizListItem key={quiz.quiz_id} quiz={quiz} onDelete={handleDeleteQuiz} />
        ))}

      <h3 style={{ marginTop: "24px" }}>Students</h3>
      {studentsLoading && <p>Loading students...</p>}
      {!studentsLoading && students.length === 0 && (
        <p>No students have joined this class yet.</p>
      )}
      {!studentsLoading && students.length > 0 && (
        <div style={{ border: "1px solid #ddd", borderRadius: "8px" }}>
          {students.map((student) => (
            <StudentListItem key={student.user_id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassDetail;