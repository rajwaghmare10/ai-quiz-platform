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
    <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
      <label>Class Code</label>
      <input
        type="text"
        value={classCode}
        onChange={(e) => setClassCode(e.target.value)}
        placeholder="e.g. 7LHSPY"
        style={{ marginLeft: "8px" }}
      />
      <button type="submit" disabled={joining} style={{ marginLeft: "8px" }}>
        {joining ? "Joining..." : "Join Class"}
      </button>
    </form>
  );
};

export default JoinClassForm;