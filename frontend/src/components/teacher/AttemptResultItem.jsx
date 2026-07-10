const STATUS_STYLES = {
  submitted: "bg-primary-100 text-primary-700",
  in_progress: "bg-amber-100 text-amber-700",
};

const AttemptResultItem = ({ attempt }) => {
  const submittedDisplay = attempt.submitted_at
    ? new Date(attempt.submitted_at).toLocaleString()
    : "Not submitted";
  const initial = attempt.name?.charAt(0).toUpperCase() || "?";
  const statusStyle = STATUS_STYLES[attempt.status] || "bg-gray-100 text-gray-600";

  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
          {initial}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{attempt.name}</p>
          <p className="text-xs text-gray-500">{attempt.email}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-800">
          Score: {attempt.score ?? "—"}
        </p>
        <div className="mt-0.5 flex items-center justify-end gap-2">
          <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusStyle}`}>
            {attempt.status}
          </span>
          <span className="text-xs text-gray-400">{submittedDisplay}</span>
        </div>
      </div>
    </div>
  );
};

export default AttemptResultItem;