const AttemptResultItem = ({ attempt }) => {
  const submittedDisplay = attempt.submitted_at
    ? new Date(attempt.submitted_at).toLocaleString()
    : "Not submitted";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 12px",
        borderBottom: "1px solid #eee",
      }}
    >
      <div>
        <p style={{ margin: 0, fontWeight: 500 }}>{attempt.name}</p>
        <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
          {attempt.email}
        </p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: 0, fontWeight: 500 }}>
          Score: {attempt.score ?? "—"}
        </p>
        <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
          {attempt.status} &middot; {submittedDisplay}
        </p>
      </div>
    </div>
  );
};

export default AttemptResultItem;