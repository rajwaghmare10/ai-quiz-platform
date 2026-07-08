import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import quizService from "../../api/quizService";
import aiService from "../../api/aiService";
import attemptService from "../../api/attemptService";
import ExcelUploadForm from "../../components/teacher/ExcelUploadForm";
import QuestionCard from "../../components/teacher/QuestionCard";
import AIGenerateForm from "../../components/teacher/AIGenerateForm";
import AIPdfGenerateForm from "../../components/teacher/AIPdfGenerateForm";
import GeneratedQuestionPreview from "../../components/teacher/GeneratedQuestionPreview";
import AttemptResultItem from "../../components/teacher/AttemptResultItem";

const QuizDetail = () => {
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [previewQuestions, setPreviewQuestions] = useState([]);
  const [previewSource, setPreviewSource] = useState("AI_TOPIC");
  const [savingPreview, setSavingPreview] = useState(false);

  const [attempts, setAttempts] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

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

  const handleQuestionDeleted = (questionId) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.question_id !== questionId),
    }));
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

      await aiService.saveGeneratedQuestions({
        quizId,
        questions: questionsToSave,
      });

      toast.success("Questions saved to quiz");
      setPreviewQuestions([]);
      fetchQuiz();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to save questions";
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

  if (loading) return <p style={{ padding: "24px" }}>Loading quiz...</p>;
  if (error) return <p style={{ padding: "24px", color: "red" }}>{error}</p>;
  if (!quiz) return null;

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <Link to={`/teacher/classes/${quiz.class_id}`}>&larr; Back to Class</Link>

      <h2>{quiz.title}</h2>
      <p style={{ fontSize: "13px", color: "#666" }}>
        Duration: {quiz.duration_minutes} min &middot; Questions per attempt:{" "}
        {quiz.questions_per_attempt} &middot; Total questions:{" "}
        {quiz.total_questions}
      </p>

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Student Attempts ({attempts.length})</h3>
        <button onClick={handleExport} disabled={exporting || attempts.length === 0}>
          {exporting ? "Exporting..." : "Export to Excel"}
        </button>
      </div>
      {attemptsLoading && <p>Loading attempts...</p>}
      {!attemptsLoading && attempts.length === 0 && (
        <p>No students have attempted this quiz yet.</p>
      )}
      {!attemptsLoading && attempts.length > 0 && (
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", marginBottom: "20px" }}>
          {attempts.map((attempt) => (
            <AttemptResultItem key={attempt.attempt_id} attempt={attempt} />
          ))}
        </div>
      )}

      <h3 style={{ marginTop: "20px" }}>Upload Questions (Excel)</h3>
      <ExcelUploadForm quizId={quizId} onUploaded={fetchQuiz} />

      <h3>Generate Questions with AI (Topic)</h3>
      <AIGenerateForm quizId={quizId} onGenerated={handleTopicGenerated} />

      <h3>Generate Questions with AI (from PDF Notes)</h3>
      <AIPdfGenerateForm quizId={quizId} onGenerated={handlePdfGenerated} />

      <GeneratedQuestionPreview
        questions={previewQuestions}
        onChange={setPreviewQuestions}
        onRemove={handleRemovePreview}
        onSaveAll={handleSaveGenerated}
        saving={savingPreview}
      />

      <h3 style={{ marginTop: "20px" }}>Questions ({quiz.questions.length})</h3>
      {quiz.questions.length === 0 && <p>No questions added yet.</p>}
      {quiz.questions.map((question) => (
        <QuestionCard
          key={question.question_id}
          question={question}
          onUpdated={handleQuestionUpdated}
          onDeleted={handleQuestionDeleted}
        />
      ))}
    </div>
  );
};

export default QuizDetail;