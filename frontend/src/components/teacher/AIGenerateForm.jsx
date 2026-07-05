import { useState } from "react";
import toast from "react-hot-toast";
import aiService from "../../api/aiService";

const AIGenerateForm = ({ quizId, onGenerated }) => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setGenerating(true);
    try {
      const questions = await aiService.generateQuestions({
        quizId,
        topic,
        difficulty,
        questionCount: Number(questionCount),
      });
      onGenerated(questions);
      toast.success(`${questions.length} questions generated — review below`);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to generate questions";
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "16px" }}>
      <div>
        <label>Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Normalization"
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

      <div>
        <label>Number of Questions</label>
        <input
          type="number"
          min="1"
          max="20"
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
        />
      </div>

      <button type="submit" disabled={generating}>
        {generating ? "Generating..." : "Generate Questions"}
      </button>
    </form>
  );
};

export default AIGenerateForm;