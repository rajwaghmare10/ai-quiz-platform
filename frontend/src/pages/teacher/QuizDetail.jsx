import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Download, FileSpreadsheet, Sparkles, FileText } from "lucide-react";
import quizService from "../../api/quizService";
import aiService from "../../api/aiService";
import attemptService from "../../api/attemptService";
import questionService from "../../api/questionService";   // <-- this is the line to add
import ExcelUploadForm from "../../components/teacher/ExcelUploadForm";
import QuestionCard from "../../components/teacher/QuestionCard";
import AIGenerateForm from "../../components/teacher/AIGenerateForm";
import AIPdfGenerateForm from "../../components/teacher/AIPdfGenerateForm";
import GeneratedQuestionPreview from "../../components/teacher/GeneratedQuestionPreview";
import AttemptResultItem from "../../components/teacher/AttemptResultItem";
import ConfirmDialog from "../../components/layout/ConfirmDialog";

const TABS = [
  { key: "excel", label: "Excel Upload", icon: FileSpreadsheet },
  { key: "topic", label: "AI · Topic", icon: Sparkles },
  { key: "pdf", label: "AI · PDF Notes", icon: FileText },
];

const QuizDetail = () => {
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("excel");
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
      const questionService = (await import("../../api/questionService")).default;
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

  if (loading) return <p className="text-gray-500">Loading quiz...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!quiz) return null;

  return (
    <div>
      <Link
        to={`/teacher/classes/${quiz.class_id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
      >
        <ArrowLeft size={16} /> Back to Class
      </Link>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">{quiz.title}</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-600">
            {quiz.duration_minutes} min
          </span>
          <span className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-600">
            {quiz.questions_per_attempt} of {quiz.total_questions} questions
          </span>
        </div>
      </div>

      {/* Student Attempts */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
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

        {attemptsLoading && <p className="text-sm text-gray-500">Loading attempts...</p>}
        {!attemptsLoading && attempts.length === 0 && (
          <p className="text-sm text-gray-500">No students have attempted this quiz yet.</p>
        )}
        {!attemptsLoading && attempts.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {attempts.map((attempt) => (
              <AttemptResultItem key={attempt.attempt_id} attempt={attempt} />
            ))}
          </div>
        )}
      </div>

      {/* Add Questions */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Add Questions</h2>

        <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
                  activeTab === tab.key
                    ? "bg-white text-primary-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {activeTab === "excel" && <ExcelUploadForm quizId={quizId} onUploaded={fetchQuiz} />}
          {activeTab === "topic" && (
            <AIGenerateForm quizId={quizId} onGenerated={handleTopicGenerated} />
          )}
          {activeTab === "pdf" && (
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

      {/* Confirmed Questions */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Questions ({quiz.questions.length})
        </h2>
        {quiz.questions.length === 0 && (
          <p className="text-sm text-gray-500">No questions added yet.</p>
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