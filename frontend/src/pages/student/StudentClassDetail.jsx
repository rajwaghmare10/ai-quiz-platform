import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, ListChecks } from "lucide-react";
import classService from "../../api/classService";
import quizService from "../../api/quizService";

const STATUS_STYLES = {
  Active: "bg-primary-100 text-primary-700",
  Upcoming: "bg-gray-100 text-gray-600",
  Ended: "bg-red-100 text-red-600",
};

const StudentClassDetail = () => {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizzesLoading, setQuizzesLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClass();
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

  const getQuizStatus = (quiz) => {
    const now = new Date();
    const start = new Date(quiz.start_time);
    const end = new Date(quiz.end_time);
    if (now < start) return "Upcoming";
    if (now > end) return "Ended";
    return "Active";
  };

  if (loading) return <p className="text-gray-500">Loading class...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!classData) return null;

  return (
    <div>
      <Link
        to="/student/dashboard"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">{classData.class_name}</h1>
        {classData.description && (
          <p className="mt-1 text-sm text-gray-500">{classData.description}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">Teacher: {classData.teacher_name}</p>
      </div>

      <h2 className="mb-3 text-lg font-semibold text-gray-800">Quizzes</h2>
      {quizzesLoading && <p className="text-sm text-gray-500">Loading quizzes...</p>}
      {!quizzesLoading && quizzes.length === 0 && (
        <p className="text-sm text-gray-500">No quizzes available in this class yet.</p>
      )}

      <div className="space-y-3">
        {!quizzesLoading &&
          quizzes.map((quiz) => {
            const status = getQuizStatus(quiz);
            const isActive = status === "Active";

            const card = (
              <div
                className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition ${
                  isActive ? "hover:shadow-md" : "opacity-70"
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-800">{quiz.title}</h4>
                  <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
                    {status}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {quiz.duration_minutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <ListChecks size={13} /> {quiz.questions_per_attempt} of {quiz.total_questions}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(quiz.start_time).toLocaleString()} &rarr;{" "}
                  {new Date(quiz.end_time).toLocaleString()}
                </p>
              </div>
            );

            return isActive ? (
              <Link key={quiz.quiz_id} to={`/student/attempts/${quiz.quiz_id}`}>
                {card}
              </Link>
            ) : (
              <div key={quiz.quiz_id}>{card}</div>
            );
          })}
      </div>
    </div>
  );
};

export default StudentClassDetail;