import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Check, ChevronLeft, ChevronRight, Clock, ListChecks } from "lucide-react";
import attemptService from "../../api/attemptService";
import quizService from "../../api/quizService";
import QuizTimer from "../../components/student/QuizTimer";
import QuestionPalette from "../../components/student/QuestionPalette";
import ConfirmDialog from "../../components/layout/ConfirmDialog";

const QuizAttempt = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [quizLoading, setQuizLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);

  const hasFetchedQuiz = useRef(false);

  useEffect(() => {
    if (hasFetchedQuiz.current) return;
    hasFetchedQuiz.current = true;
    fetchQuizInfo();
  }, [quizId]);

  const fetchQuizInfo = async () => {
    setQuizLoading(true);
    setError(null);
    try {
      const quizData = await quizService.getQuizDetails(quizId);
      setQuiz(quizData);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load quiz");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    setStarting(true);
    try {
      const attemptData = await attemptService.startQuiz(quizId);
      setAttempt(attemptData);

      const questionsData = await attemptService.getAttemptQuestions(attemptData.attempt_id);
      setQuestions(questionsData);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to start quiz";
      toast.error(message);
    } finally {
      setStarting(false);
    }
  };

  const handleSelect = (questionId, optionNum) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionNum }));
  };

  const performSubmit = useCallback(async () => {
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
    performSubmit();
  }, [performSubmit]);

  const requestSubmit = () => setSubmitConfirmOpen(true);

  const confirmSubmit = () => {
    setSubmitConfirmOpen(false);
    performSubmit();
  };

  if (quizLoading) return <p className="text-gray-500">Loading quiz...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!quiz) return null;

  // --- Pre-start intro screen ---
  if (!attempt) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">{quiz.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Read the details below before you begin. Once started, the timer cannot be paused.
          </p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={15} /> Duration: {quiz.duration_minutes} minutes
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ListChecks size={15} /> Questions: {quiz.questions_per_attempt}
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={starting}
            className="mt-6 w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {starting ? "Starting..." : "Start Quiz"}
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === questions.length - 1;

  const goNext = () => setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
  const goPrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="pb-6">
      <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">{quiz.title}</h1>
          <p className="text-sm text-gray-500">
            Question {currentIndex + 1} of {questions.length} &middot; Answered {answeredCount}
          </p>
        </div>
        <QuizTimer
          durationMinutes={quiz.duration_minutes}
          startedAt={attempt.started_at}
          onExpire={handleExpire}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-4 font-medium text-gray-800">
              <span className="mr-2 text-gray-400">{currentIndex + 1}.</span>
              {currentQuestion.question_text}
            </p>

            <div className="space-y-2">
              {[1, 2, 3, 4].map((num) => {
                const isSelected = answers[currentQuestion.question_id] === num;
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
                      name={`question-${currentQuestion.question_id}`}
                      checked={isSelected}
                      onChange={() => handleSelect(currentQuestion.question_id, num)}
                      className="hidden"
                    />
                    {currentQuestion.options[num]}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={requestSubmit}
                disabled={submitting}
                className="flex-1 rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            ) : (
              <button
                onClick={goNext}
                className="flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <QuestionPalette
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
            onJumpTo={setCurrentIndex}
          />

          <button
            onClick={requestSubmit}
            disabled={submitting}
            className="mt-3 w-full rounded-lg border border-primary-200 bg-primary-50 py-2.5 text-sm font-medium text-primary-700 hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={submitConfirmOpen}
        onClose={() => setSubmitConfirmOpen(false)}
        onConfirm={confirmSubmit}
        title="Submit Quiz"
        message={
          answeredCount < questions.length
            ? `You've answered ${answeredCount} of ${questions.length} questions. Unanswered questions will be marked incorrect. Submit anyway?`
            : "Are you sure you want to submit? You won't be able to change your answers after this."
        }
        confirmLabel="Submit"
        danger={answeredCount < questions.length}
      />
    </div>
  );
};

export default QuizAttempt;