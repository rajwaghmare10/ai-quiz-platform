const GeneratedQuestionPreview = ({ questions, onChange, onRemove, onSaveAll, saving }) => {
  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const updateOption = (index, optionKey, value) => {
    const updated = [...questions];
    updated[index] = {
      ...updated[index],
      options: { ...updated[index].options, [optionKey]: value },
    };
    onChange(updated);
  };

  if (questions.length === 0) return null;

  return (
    <div style={{ marginTop: "16px" }}>
      <h4>Review Generated Questions ({questions.length})</h4>

      {questions.map((q, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "10px",
          }}
        >
          <input
            type="text"
            value={q.question_text}
            onChange={(e) => updateQuestion(index, "question_text", e.target.value)}
            style={{ width: "100%", marginBottom: "8px" }}
          />

          {[1, 2, 3, 4].map((num) => (
            <div key={num} style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
              <input
                type="radio"
                checked={Number(q.correct_option) === num}
                onChange={() => updateQuestion(index, "correct_option", num)}
              />
              <input
                type="text"
                value={q.options[num] || ""}
                onChange={(e) => updateOption(index, num, e.target.value)}
                style={{ marginLeft: "6px", flex: 1 }}
              />
            </div>
          ))}

          <div style={{ marginTop: "6px" }}>
            <label>Marks: </label>
            <input
              type="number"
              value={q.marks}
              onChange={(e) => updateQuestion(index, "marks", Number(e.target.value))}
              style={{ width: "60px" }}
            />
          </div>

          <button onClick={() => onRemove(index)} style={{ marginTop: "8px" }}>
            Remove
          </button>
        </div>
      ))}

      <button onClick={onSaveAll} disabled={saving}>
        {saving ? "Saving..." : `Save ${questions.length} Questions`}
      </button>
    </div>
  );
};

export default GeneratedQuestionPreview;