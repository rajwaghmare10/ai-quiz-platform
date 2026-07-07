import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import quizService from "../../api/quizService";
import { toDatetimeLocalValue } from "../../utils/dateHelpers";

const QuizListItem = ({ quiz, onDelete, onUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(quiz.title);
  const [durationMinutes, setDurationMinutes] = useState(quiz.duration_minutes);
  const [startTime, setStartTime] = useState(toDatetimeLocalValue(quiz.start_time));
  const [endTime, setEndTime] = useState(toDatetimeLocalValue(quiz.end_time));
  const [questionsPerAttempt, setQuestionsPerAttempt] = useState(quiz.questions_per_attempt);
  const [saving, setSaving] = useState(false);

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

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    // reset fields back to original values
    setTitle(quiz.title);
    setDurationMinutes(quiz.duration_minutes);
    setStartTime(toDatetimeLocalValue(quiz.start_time));
    setEndTime(toDatetimeLocalValue(quiz.end_time));
    setQuestionsPerAttempt(quiz.questions_per_attempt);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (new Date(endTime) <= new Date(startTime)) {
      toast.error("End time must be after start time");
      return;
    }

    setSaving(true);
    try {
      const updated = await quizService.updateQuiz(quiz.quiz_id, {
        title,
        durationMinutes: Number(durationMinutes),
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        questionsPerAttempt: Number(questionsPerAttempt),
      });
      toast.success("Quiz updated");
      onUpdated(updated);
      setIsEditing(false);
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to update quiz";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "10px",
        }}
      >
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label>Duration (minutes)</label>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
          />
        </div>

        <div>
          <label>Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div>
          <label>End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div>
          <label>Questions Per Attempt</label>
          <input
            type="number"
            value={questionsPerAttempt}
            onChange={(e) => setQuestionsPerAttempt(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "8px" }}>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={handleCancel} style={{ marginLeft: "8px" }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const startDisplay = new Date(quiz.start_time).toLocaleString();
  const endDisplay = new Date(quiz.end_time).toLocaleString();

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
          {startDisplay} &rarr; {endDisplay}
        </p>
      </Link>

      <div>
        <button onClick={handleEditClick}>Edit</button>
        <button onClick={handleDelete} style={{ marginLeft: "8px" }}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default QuizListItem;