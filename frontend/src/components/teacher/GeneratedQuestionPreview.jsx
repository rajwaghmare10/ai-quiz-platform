import { Trash2 } from "lucide-react";

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
    <div className="mt-4 rounded-xl border border-primary-200 bg-primary-50/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-medium text-gray-800">
          Review Generated Questions ({questions.length})
        </h4>
        <button
          onClick={onSaveAll}
          disabled={saving}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : `Save ${questions.length} Questions`}
        </button>
      </div>

      <div className="space-y-3">
        {questions.map((q, index) => (
          <div key={index} className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-2 flex items-start gap-2">
              <input
                type="text"
                value={q.question_text}
                onChange={(e) => updateQuestion(index, "question_text", e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
              <button
                onClick={() => onRemove(index)}
                className="shrink-0 rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="space-y-1.5">
              {[1, 2, 3, 4].map((num) => (
                <label
                  key={num}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${
                    Number(q.correct_option) === num
                      ? "border-primary-400 bg-primary-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    checked={Number(q.correct_option) === num}
                    onChange={() => updateQuestion(index, "correct_option", num)}
                    className="accent-primary-600"
                  />
                  <input
                    type="text"
                    value={q.options[num] || ""}
                    onChange={(e) => updateOption(index, num, e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                </label>
              ))}
            </div>

            <div className="mt-2 flex items-center gap-2">
              <label className="text-xs text-gray-500">Marks</label>
              <input
                type="number"
                value={q.marks}
                onChange={(e) => updateQuestion(index, "marks", Number(e.target.value))}
                className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-sm outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedQuestionPreview;