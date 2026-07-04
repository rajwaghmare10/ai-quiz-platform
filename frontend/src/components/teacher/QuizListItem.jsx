import { Link } from "react-router-dom";

const QuizListItem = ({ quiz, onDelete }) => {
  const startTime = new Date(quiz.start_time).toLocaleString();
  const endTime = new Date(quiz.end_time).toLocaleString();

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = window.confirm(
      `Delete "${quiz.title}"? This cannot be undone.`
    );
    if (confirmed) {
      onDelete(quiz.quiz_id);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px 16px",
        marginBottom: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <Link
        to={`/teacher/quizzes/${quiz.quiz_id}`}
        style={{ textDecoration: "none", color: "inherit", flex: 1 }}
      >
        <h4 style={{ margin: "0 0 6px 0" }}>{quiz.title}</h4>
        <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
          Duration: {quiz.duration_minutes} min &middot; Questions per attempt:{" "}
          {quiz.questions_per_attempt} &middot; Total questions:{" "}
          {quiz.total_questions}
        </p>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#888" }}>
          {startTime} &rarr; {endTime}
        </p>
      </Link>

      <button onClick={handleDelete} style={{ marginLeft: "12px" }}>
        Delete
      </button>
    </div>
  );
};

export default QuizListItem;