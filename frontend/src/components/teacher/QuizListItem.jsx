import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Pencil, Trash2, Clock, ListChecks } from "lucide-react";
import quizService from "../../api/quizService";
import { toDatetimeLocalValue } from "../../utils/dateHelpers";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

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
    onDelete(quiz.quiz_id);
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
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Duration (min)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Questions/Attempt</label>
              <input
                type="number"
                value={questionsPerAttempt}
                onChange={(e) => setQuestionsPerAttempt(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
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
            onClick={handleCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const startDisplay = new Date(quiz.start_time).toLocaleString();
  const endDisplay = new Date(quiz.end_time).toLocaleString();

  return (
    <div className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <Link to={`/teacher/quizzes/${quiz.quiz_id}`} className="flex-1">
        <h4 className="font-medium text-gray-800">{quiz.title}</h4>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={13} /> {quiz.duration_minutes} min
          </span>
          <span className="flex items-center gap-1">
            <ListChecks size={13} /> {quiz.questions_per_attempt} of {quiz.total_questions}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {startDisplay} &rarr; {endDisplay}
        </p>
      </Link>

      <div className="ml-3 flex gap-1">
        <button
          onClick={handleEditClick}
          className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuizListItem;