const StudentListItem = ({ student }) => {
  const joinedDate = new Date(student.joined_at).toLocaleDateString();

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
        <p style={{ margin: 0, fontWeight: 500 }}>{student.name}</p>
        <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
          {student.email}
        </p>
      </div>
      <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
        Joined {joinedDate}
      </p>
    </div>
  );
};

export default StudentListItem;