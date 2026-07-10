import { useState } from "react";
import toast from "react-hot-toast";
import classService from "../../api/classService";

const JoinClassForm = ({ onJoined }) => {
  const [classCode, setClassCode] = useState("");
  const [joining, setJoining] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!classCode.trim()) {
      toast.error("Please enter a class code");
      return;
    }

    setJoining(true);
    try {
      await classService.joinClass(classCode.trim().toUpperCase());
      toast.success("Joined class successfully");
      setClassCode("");
      onJoined();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to join class";
      toast.error(message);
    } finally {
      setJoining(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Class Code
        </label>
        <input
          type="text"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          placeholder="e.g. 7LHSPY"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase tracking-wider outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <button
        type="submit"
        disabled={joining}
        className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {joining ? "Joining..." : "Join Class"}
      </button>
    </form>
  );
};

export default JoinClassForm;