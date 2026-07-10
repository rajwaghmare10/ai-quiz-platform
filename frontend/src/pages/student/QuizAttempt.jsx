import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import attemptService from "../../api/attemptService";
import quizService from "../../api/quizService";
import QuizTimer from "../../components/student/QuizTimer";

const QuizAttempt = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    initAttempt();
  }, [quizId]);

  const initAttempt = async () => {
    setLoading(true);
    setError(null);
    try {
      const quizData = await quizService.getQuizDetails(quizId);
      setQuiz(quizData);

      const attemptData = await attemptService.startQuiz(quizId);
      setAttempt(attemptData);

      const questionsData = await attemptService.getAttemptQuestions(attemptData.attempt_id);
      setQuestions(questionsData);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to start quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionId, optionNum) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionNum }));
  };

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    const answersPayload = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    try {
      await attemptService.submitQuiz(attempt.attempt_id, answersPayload);
      toast.success("Quiz submitted successfully");
      navigate(`/student/classes/${quiz.class_id}`, { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to submit quiz";
      toast.error(message);
      setSubmitting(false);
    }
  }, [answers, attempt, submitting, navigate, quiz]);

  const handleExpire = useCallback(() => {
    toast.error("Time's up! Submitting automatically.");
    handleSubmit();
  }, [handleSubmit]);

  if (loading) return <p className="text-gray-500">Starting quiz...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!quiz || !attempt) return null;

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="mx-auto max-w-2xl pb-24">
      <div className="sticky top-16 z-30 mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">{quiz.title}</h1>
          <QuizTimer
            durationMinutes={quiz.duration_minutes}
            startedAt={attempt.started_at}
            onExpire={handleExpire}
          />
        </div>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>Answered {answeredCount} of {questions.length}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-primary-600 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={question.question_id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="mb-3 font-medium text-gray-800">
              <span className="mr-2 text-gray-400">{index + 1}.</span>
              {question.question_text}
            </p>

            <div className="space-y-2">
              {[1, 2, 3, 4].map((num) => {
                const isSelected = answers[question.question_id] === num;
                return (
                  <label
                    key={num}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                      isSelected
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected ? "border-primary-600 bg-primary-600" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check size={12} className="text-white" />}
                    </span>
                    <input
                      type="radio"
                      name={`question-${question.question_id}`}
                      checked={isSelected}
                      onChange={() => handleSelect(question.question_id, num)}
                      className="hidden"
                    />
                    {question.options[num]}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white p-4">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;