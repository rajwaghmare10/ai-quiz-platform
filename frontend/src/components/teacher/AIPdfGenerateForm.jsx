import { useState } from "react";
import toast from "react-hot-toast";
import aiService from "../../api/aiService";

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
      const questions = await aiService.generateFromPdf({
        file,
        difficulty,
        quizId,
      });
      onGenerated(questions, "AI_PDF");
      toast.success(`${questions.length} questions generated from PDF — review below`);
      setFile(null);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to generate questions from PDF";
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "16px" }}>
      <div>
        <label>Upload Notes (PDF)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <div>
        <label>Difficulty</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <button type="submit" disabled={generating}>
        {generating ? "Generating from PDF..." : "Generate from PDF"}
      </button>
    </form>
  );
};

export default AIPdfGenerateForm;