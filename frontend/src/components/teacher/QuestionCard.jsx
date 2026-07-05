import { useState } from "react";
import toast from "react-hot-toast";
import questionService from "../../api/questionService";

const QuestionCard = ({ question, onUpdated, onDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [questionText, setQuestionText] = useState(question.question_text);
  const [options, setOptions] = useState({ ...question.options });
  const [correctOption, setCorrectOption] = useState(question.correct_option);
  const [marks, setMarks] = useState(question.marks);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await questionService.updateQuestion(question.question_id, {
        questionText,
        options,
        correctOption: Number(correctOption),
        marks: Number(marks),
      });
      toast.success("Question updated");
      onUpdated(updated);
      setIsEditing(false);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update question";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this question?");
    if (!confirmed) return;

    try {
      await questionService.deleteQuestion(question.question_id);
      toast.success("Question deleted");
      onDeleted(question.question_id);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to delete question";
      toast.error(message);
    }
  };

  if (isEditing) {
    return (
      <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "12px", marginBottom: "10px" }}>
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          style={{ width: "100%", marginBottom: "8px" }}
        />

        {[1, 2, 3, 4].map((num) => (
          <div key={num} style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <input
              type="radio"
              checked={Number(correctOption) === num}
              onChange={() => setCorrectOption(num)}
            />
            <input
              type="text"
              value={options[num] || ""}
              onChange={(e) => setOptions({ ...options, [num]: e.target.value })}
              style={{ marginLeft: "6px", flex: 1 }}
            />
          </div>
        ))}

        <div style={{ marginTop: "6px" }}>
          <label>Marks: </label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            style={{ width: "60px" }}
          />
        </div>

        <div style={{ marginTop: "8px" }}>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={() => setIsEditing(false)} style={{ marginLeft: "8px" }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px", marginBottom: "10px" }}>
      <p style={{ fontWeight: 500 }}>{question.question_text}</p>
      <ul style={{ margin: "6px 0", paddingLeft: "20px" }}>
        {[1, 2, 3, 4].map((num) => (
          <li
            key={num}
            style={{
              fontWeight: Number(question.correct_option) === num ? "bold" : "normal",
              color: Number(question.correct_option) === num ? "green" : "inherit",
            }}
          >
            {question.options[num]}
          </li>
        ))}
      </ul>
      <p style={{ fontSize: "12px", color: "#888" }}>
        Marks: {question.marks} &middot; Source: {question.question_source}
      </p>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={handleDelete} style={{ marginLeft: "8px" }}>
        Delete
      </button>
    </div>
  );
};

export default QuestionCard;