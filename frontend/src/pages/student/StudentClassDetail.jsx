import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import classService from "../../api/classService";
import quizService from "../../api/quizService";

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

        if (now < start) return { label: "Upcoming", color: "#888" };
        if (now > end) return { label: "Ended", color: "#c0392b" };
        return { label: "Active", color: "#27ae60" };
    };

    if (loading) return <p style={{ padding: "24px" }}>Loading class...</p>;
    if (error) return <p style={{ padding: "24px", color: "red" }}>{error}</p>;
    if (!classData) return null;

    return (
        <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
            <Link to="/student/dashboard">&larr; Back to Dashboard</Link>

            <h2>{classData.class_name}</h2>
            {classData.description && <p>{classData.description}</p>}
            <p style={{ fontSize: "13px", color: "#666" }}>
                Teacher: {classData.teacher_name}
            </p>

            <h3 style={{ marginTop: "20px" }}>Quizzes</h3>
            {quizzesLoading && <p>Loading quizzes...</p>}
            {!quizzesLoading && quizzes.length === 0 && (
                <p>No quizzes available in this class yet.</p>
            )}
            {!quizzesLoading &&
                quizzes.map((quiz) => {
                    const status = getQuizStatus(quiz);
                    const isActive = status.label === "Active";

                    const cardContent = (
                        <div
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "12px 16px",
                                marginBottom: "10px",
                                cursor: isActive ? "pointer" : "default",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <h4 style={{ margin: 0 }}>{quiz.title}</h4>
                                <span style={{ color: status.color, fontSize: "13px", fontWeight: 500 }}>
                                    {status.label}
                                </span>
                            </div>
                            <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#666" }}>
                                Duration: {quiz.duration_minutes} min &middot; Questions:{" "}
                                {quiz.questions_per_attempt} of {quiz.total_questions}
                            </p>
                            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#888" }}>
                                {new Date(quiz.start_time).toLocaleString()} &rarr;{" "}
                                {new Date(quiz.end_time).toLocaleString()}
                            </p>
                        </div>
                    );

                    return isActive ? (
                        <Link
                            key={quiz.quiz_id}
                            to={`/student/attempts/${quiz.quiz_id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            {cardContent}
                        </Link>
                    ) : (
                        <div key={quiz.quiz_id}>{cardContent}</div>
                    );
                })}
        </div>
    );
};

export default StudentClassDetail;