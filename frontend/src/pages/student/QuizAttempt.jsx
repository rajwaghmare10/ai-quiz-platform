import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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

            const questionsData = await attemptService.getAttemptQuestions(
                attemptData.attempt_id
            );
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

        const answersPayload = Object.entries(answers).map(
            ([questionId, selectedOption]) => ({
                questionId,
                selectedOption,
            })
        );

        try {
            await attemptService.submitQuiz(attempt.attempt_id, answersPayload);
            toast.success("Quiz submitted");
            navigate(`/student/attempts/${attempt.attempt_id}/result`, {
                replace: true,
            });
        } catch (err) {
            const message = err?.response?.data?.message || "Failed to submit quiz";
            toast.error(message);
            setSubmitting(false);
        }
    }, [answers, attempt, submitting, navigate]);

    const handleExpire = useCallback(() => {
        toast.error("Time's up! Submitting automatically.");
        handleSubmit();
    }, [handleSubmit]);

    if (loading) return <p style={{ padding: "24px" }}>Starting quiz...</p>;
    if (error) return <p style={{ padding: "24px", color: "red" }}>{error}</p>;
    if (!quiz || !attempt) return null;

    return (
        <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>{quiz.title}</h2>
                <QuizTimer
                    durationMinutes={quiz.duration_minutes}
                    startedAt={attempt.started_at}
                    onExpire={handleExpire}
                />
            </div>

            <p style={{ fontSize: "13px", color: "#666" }}>
                Answered {Object.keys(answers).length} of {questions.length}
            </p>

            {questions.map((question, index) => (
                <div
                    key={question.question_id}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        marginBottom: "10px",
                    }}
                >
                    <p style={{ fontWeight: 500 }}>
                        {index + 1}. {question.question_text}
                    </p>
                    {[1, 2, 3, 4].map((num) => (
                        <label key={num} style={{ display: "block", margin: "4px 0" }}>
                            <input
                                type="radio"
                                name={`question-${question.question_id}`}
                                checked={answers[question.question_id] === num}
                                onChange={() => handleSelect(question.question_id, num)}
                            />{" "}
                            {question.options[num]}
                        </label>
                    ))}
                </div>
            ))}

            <button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
        </div>
    );
};

export default QuizAttempt;