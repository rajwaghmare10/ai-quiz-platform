import { useState } from "react";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";
import aiService from "../../api/aiService";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

const AIGenerateForm = ({ quizId, onGenerated }) => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    setGenerating(true);
    try {
      const questions = await aiService.generateQuestions({ quizId, topic, difficulty });
      onGenerated(questions);
      toast.success(`${questions.length} questions generated — review below`);
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to generate questions";
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className={labelClass}>Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Normalization"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Difficulty</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={inputClass}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={generating}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Sparkles size={16} />
        {generating ? "Generating..." : "Generate Questions"}
      </button>
    </form>
  );
};

export default AIGenerateForm;