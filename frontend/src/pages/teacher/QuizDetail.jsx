import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Sparkles,
  FileText,
  Clock,
  ListChecks,
  Users,
  LayoutDashboard,
} from "lucide-react";
import quizService from "../../api/quizService";
import aiService from "../../api/aiService";
import attemptService from "../../api/attemptService";
import questionService from "../../api/questionService";
import ExcelUploadForm from "../../components/teacher/ExcelUploadForm";
import QuestionCard from "../../components/teacher/QuestionCard";
import AIGenerateForm from "../../components/teacher/AIGenerateForm";
import AIPdfGenerateForm from "../../components/teacher/AIPdfGenerateForm";
import GeneratedQuestionPreview from "../../components/teacher/GeneratedQuestionPreview";
import AttemptResultItem from "../../components/teacher/AttemptResultItem";
import ConfirmDialog from "../../components/layout/ConfirmDialog";

const SECTIONS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "questions", label: "Questions", icon: ListChecks },
  { key: "results", label: "Results", icon: Users },
];

const QUESTION_TABS = [
  { key: "excel", label: "Excel Upload", icon: FileSpreadsheet },
  { key: "topic", label: "AI · Topic", icon: Sparkles },
  { key: "pdf", label: "AI · PDF Notes", icon: FileText },
];

const QuizDetail = () => {
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeSection, setActiveSection] = useState("overview");
  const [activeQuestionTab, setActiveQuestionTab] = useState("excel");

  const [previewQuestions, setPreviewQuestions] = useState([]);
  const [previewSource, setPreviewSource] = useState("AI_TOPIC");
  const [savingPreview, setSavingPreview] = useState(false);

  const [attempts, setAttempts] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [deleteQuestionId, setDeleteQuestionId] = useState(null);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await quizService.getQuizDetails(quizId);
      setQuiz(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempts = async () => {
    setAttemptsLoading(true);
    try {
      const data = await attemptService.getQuizAttempts(quizId);
      setAttempts(data);
    } catch (err) {
      console.error("Failed to load attempts:", err);
    } finally {
      setAttemptsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
    fetchAttempts();
  }, [quizId]);

  const handleQuestionUpdated = (updatedQuestion) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.question_id === updatedQuestion.question_id ? updatedQuestion : q
      ),
    }));
  };

  const confirmDeleteQuestion = async () => {
    try {
      await questionService.deleteQuestion(deleteQuestionId);
      setQuiz((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.question_id !== deleteQuestionId),
      }));
      toast.success("Question deleted");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete question";
      toast.error(message);
    } finally {
      setDeleteQuestionId(null);
    }
  };

  const handleTopicGenerated = (questions) => {
    setPreviewQuestions(questions);
    setPreviewSource("AI_TOPIC");
  };

  const handlePdfGenerated = (questions, source) => {
    setPreviewQuestions(questions);
    setPreviewSource(source);
  };

  const handleRemovePreview = (index) => {
    setPreviewQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveGenerated = async () => {
    setSavingPreview(true);
    try {
      const questionsToSave = previewQuestions.map((q) => ({
        ...q,
        question_source: previewSource,
      }));

      await aiService.saveGeneratedQuestions({ quizId, questions: questionsToSave });
      toast.success("Questions saved to quiz");
      setPreviewQuestions([]);
      fetchQuiz();
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to save questions";
      toast.error(message);
    } finally {
      setSavingPreview(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await attemptService.exportQuizResults(quizId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${quiz.title}-results.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to export results");
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <p className="text-gray-600">Loading quiz...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!quiz) return null;

  const submittedCount = attempts.filter((a) => a.status === "submitted").length;
  const avgScore =
    submittedCount > 0
      ? (
          attempts
            .filter((a) => a.status === "submitted")
            .reduce((sum, a) => sum + (a.score || 0), 0) / submittedCount
        ).toFixed(1)
      : null;

  return (
    <div>
      <Link
        to={`/teacher/classes/${quiz.class_id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600"
      >
        <ArrowLeft size={16} /> Back to Class
      </Link>

      {/* Hero header */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 px-6 py-8">
          <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-md bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              <Clock size={13} /> {quiz.duration_minutes} min
            </span>
            <span className="flex items-center gap-1 rounded-md bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              <ListChecks size={13} /> {quiz.questions_per_attempt} of {quiz.total_questions} questions
            </span>
          </div>
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Section switcher */}
      <div className="mb-5 flex gap-1 rounded-lg bg-gray-100 p-1">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
                activeSection === section.key
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-700"
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview section */}
      {activeSection === "overview" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Duration</p>
            <p className="mt-1 text-2xl font-semibold text-gray-800">{quiz.duration_minutes}<span className="text-sm font-normal text-gray-500"> min</span></p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Questions</p>
            <p className="mt-1 text-2xl font-semibold text-gray-800">
              {quiz.questions_per_attempt}<span className="text-sm font-normal text-gray-500"> of {quiz.total_questions}</span>
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Submissions</p>
            <p className="mt-1 text-2xl font-semibold text-gray-800">
              {submittedCount}
              {avgScore !== null && (
                <span className="text-sm font-normal text-gray-500"> &middot; avg {avgScore}</span>
              )}
            </p>
          </div>

          <div className="sm:col-span-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Time Window</p>
            <p className="text-sm text-gray-700">
              {new Date(quiz.start_time).toLocaleString()} &rarr; {new Date(quiz.end_time).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Questions section */}
      {activeSection === "questions" && (
        <div>
          <div className="mb-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
              Add Questions
            </h2>
            <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1">
              {QUESTION_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveQuestionTab(tab.key)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
                      activeQuestionTab === tab.key
                        ? "bg-white text-primary-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-700"
                    }`}
                  >
                    <Icon size={15} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              {activeQuestionTab === "excel" && (
                <ExcelUploadForm quizId={quizId} onUploaded={fetchQuiz} />
              )}
              {activeQuestionTab === "topic" && (
                <AIGenerateForm quizId={quizId} onGenerated={handleTopicGenerated} />
              )}
              {activeQuestionTab === "pdf" && (
                <AIPdfGenerateForm quizId={quizId} onGenerated={handlePdfGenerated} />
              )}
            </div>

            <GeneratedQuestionPreview
              questions={previewQuestions}
              onChange={setPreviewQuestions}
              onRemove={handleRemovePreview}
              onSaveAll={handleSaveGenerated}
              saving={savingPreview}
            />
          </div>

          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
            All Questions ({quiz.questions.length})
          </h2>
          {quiz.questions.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center">
              <p className="text-sm text-gray-600">No questions added yet.</p>
            </div>
          )}
          <div className="space-y-3">
            {quiz.questions.map((question) => (
              <QuestionCard
                key={question.question_id}
                question={question}
                onUpdated={handleQuestionUpdated}
                onDeleteRequest={setDeleteQuestionId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Results section */}
      {activeSection === "results" && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
              Student Attempts ({attempts.length})
            </h2>
            <button
              onClick={handleExport}
              disabled={exporting || attempts.length === 0}
              className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={15} />
              {exporting ? "Exporting..." : "Export to Excel"}
            </button>
          </div>

          {attemptsLoading && <p className="text-sm text-gray-600">Loading attempts...</p>}
          {!attemptsLoading && attempts.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center">
              <p className="text-sm text-gray-600">No students have attempted this quiz yet.</p>
            </div>
          )}
          {!attemptsLoading && attempts.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {attempts.map((attempt) => (
                <AttemptResultItem key={attempt.attempt_id} attempt={attempt} />
              ))}
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteQuestionId}
        onClose={() => setDeleteQuestionId(null)}
        onConfirm={confirmDeleteQuestion}
        title="Delete Question"
        message="Are you sure you want to delete this question? This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
};

export default QuizDetail;