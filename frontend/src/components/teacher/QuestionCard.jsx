import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, Check } from "lucide-react";
import questionService from "../../api/questionService";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

const SOURCE_LABELS = {
  EXCEL: { label: "Excel", color: "bg-blue-100 text-blue-700" },
  AI_TOPIC: { label: "AI · Topic", color: "bg-purple-100 text-purple-700" },
  AI_PDF: { label: "AI · PDF", color: "bg-amber-100 text-amber-700" },
};

const QuestionCard = ({ question, onUpdated, onDeleted, onDeleteRequest }) => {
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
      const message = error?.response?.data?.message || "Failed to update question";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const sourceTag = SOURCE_LABELS[question.question_source] || {
    label: question.question_source,
    color: "bg-gray-100 text-gray-600",
  };

  if (isEditing) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className={`${inputClass} mb-3`}
        />

        <div className="space-y-2">
          {[1, 2, 3, 4].map((num) => (
            <label
              key={num}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                Number(correctOption) === num
                  ? "border-primary-400 bg-primary-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                checked={Number(correctOption) === num}
                onChange={() => setCorrectOption(num)}
                className="accent-primary-600"
              />
              <input
                type="text"
                value={options[num] || ""}
                onChange={(e) => setOptions({ ...options, [num]: e.target.value })}
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </label>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <label className="text-sm text-gray-600">Marks</label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm outline-none focus:border-primary-500"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="font-medium text-gray-800">{question.question_text}</p>
        <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${sourceTag.color}`}>
          {sourceTag.label}
        </span>
      </div>

      <div className="space-y-1.5">
        {[1, 2, 3, 4].map((num) => {
          const isCorrect = Number(question.correct_option) === num;
          return (
            <div
              key={num}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                isCorrect ? "bg-primary-50 text-primary-700" : "text-gray-600"
              }`}
            >
              {isCorrect && <Check size={14} />}
              <span>{question.options[num]}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">Marks: {question.marks}</span>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDeleteRequest(question.question_id)}
            className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;