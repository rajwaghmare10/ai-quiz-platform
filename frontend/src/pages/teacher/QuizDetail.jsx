import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import quizService from "../../api/quizService";
import aiService from "../../api/aiService";
import ExcelUploadForm from "../../components/teacher/ExcelUploadForm";
import QuestionCard from "../../components/teacher/QuestionCard";
import AIGenerateForm from "../../components/teacher/AIGenerateForm";
import GeneratedQuestionPreview from "../../components/teacher/GeneratedQuestionPreview";

const QuizDetail = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewQuestions, setPreviewQuestions] = useState([]);
  const [savingPreview, setSavingPreview] = useState(false);

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

  useEffect(() => {
    fetchQuiz();
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

  const handleRemovePreview = (index) => {
    setPreviewQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveGenerated = async () => {
    setSavingPreview(true);
    try {
      const questionsToSave = previewQuestions.map((q) => ({
        ...q,
        question_source: "AI_TOPIC",
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

      <h3 style={{ marginTop: "20px" }}>Upload Questions (Excel)</h3>
      <ExcelUploadForm quizId={quizId} onUploaded={fetchQuiz} />

      <h3>Generate Questions with AI</h3>
      <AIGenerateForm quizId={quizId} onGenerated={setPreviewQuestions} />
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