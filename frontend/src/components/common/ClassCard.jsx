import { Link } from "react-router-dom";

const ClassCard = ({ classItem, linkTo }) => {
  const content = (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
        cursor: linkTo ? "pointer" : "default",
      }}
    >
      <h3>{classItem.class_name}</h3>
      {classItem.description && <p>{classItem.description}</p>}
      <p style={{ fontSize: "13px", color: "#666" }}>
        Class Code: <strong>{classItem.class_code}</strong>
      </p>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} style={{ textDecoration: "none", color: "inherit" }}>
        {content}
      </Link>
    );
  }

  return content;
};

export default ClassCard;