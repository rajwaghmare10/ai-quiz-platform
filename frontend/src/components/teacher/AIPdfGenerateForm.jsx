import { useState } from "react";
import toast from "react-hot-toast";
import { Sparkles, Upload } from "lucide-react";
import aiService from "../../api/aiService";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

const AIPdfGenerateForm = ({ quizId, onGenerated }) => {
  const [file, setFile] = useState(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }
    setGenerating(true);
    try {
      const questions = await aiService.generateFromPdf({ file, difficulty, quizId });
      onGenerated(questions, "AI_PDF");
      toast.success(`${questions.length} questions generated from PDF — review below`);
      setFile(null);
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to generate questions from PDF";
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600">
        <Upload size={18} />
        {file ? file.name : "Click to select a PDF of notes"}
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
      </label>
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
        {generating ? "Generating from PDF..." : "Generate from PDF"}
      </button>
    </form>
  );
};

export default AIPdfGenerateForm;