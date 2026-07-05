import { useEffect, useState, useRef } from "react";

const QuizTimer = ({ durationMinutes, startedAt, onExpire }) => {
  const expiryRef = useRef(
    new Date(startedAt).getTime() + durationMinutes * 60 * 1000
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.max(0, Math.floor((expiryRef.current - Date.now()) / 1000))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsLeft = Math.max(
        0,
        Math.floor((expiryRef.current - Date.now()) / 1000)
      );
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

  return (
    <div
      style={{
        fontWeight: "bold",
        color: remainingSeconds < 60 ? "red" : "#333",
        fontSize: "18px",
      }}
    >
      {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
};

export default QuizTimer;