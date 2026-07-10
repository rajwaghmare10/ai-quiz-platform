import { useEffect, useState, useRef } from "react";
import { Clock } from "lucide-react";

const QuizTimer = ({ durationMinutes, startedAt, onExpire }) => {
  const expiryRef = useRef(
    new Date(startedAt).getTime() + durationMinutes * 60 * 1000
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.max(0, Math.floor((expiryRef.current - Date.now()) / 1000))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsLeft = Math.max(0, Math.floor((expiryRef.current - Date.now()) / 1000));
      setRemainingSeconds(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [onExpire]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isLow = remainingSeconds < 60;

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-4 py-2 font-semibold ${
        isLow ? "animate-pulse bg-red-100 text-red-600" : "bg-primary-100 text-primary-700"
      }`}
    >
      <Clock size={18} />
      <span className="tabular-nums">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};

export default QuizTimer;