import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import classService from "../../api/classService";
import StudentListItem from "../../components/teacher/StudentListItem";

const ClassDetail = () => {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClass = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await classService.getClassById(classId);
        setClassData(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load class");
      } finally {
        setLoading(false);
      }
    };

    const fetchStudents = async () => {
      setStudentsLoading(true);
      try {
        const data = await classService.getClassStudents(classId);
        setStudents(data);
      } catch (err) {
        // Non-fatal: class details can still show even if student list fails
        console.error("Failed to load students:", err);
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchClass();
    fetchStudents();
  }, [classId]);

  if (loading) return <p style={{ padding: "24px" }}>Loading class...</p>;
  if (error) return <p style={{ padding: "24px", color: "red" }}>{error}</p>;
  if (!classData) return null;

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <Link to="/teacher/dashboard">&larr; Back to Dashboard</Link>

      <h2>{classData.class_name}</h2>
      {classData.description && <p>{classData.description}</p>}

      <div style={{ marginTop: "16px" }}>
        <p>
          <strong>Class Code:</strong> {classData.class_code}
        </p>
        <p>
          <strong>Teacher:</strong> {classData.teacher_name}
        </p>
        <p>
          <strong>Students Enrolled:</strong> {classData.total_students}
        </p>
      </div>

      <h3 style={{ marginTop: "24px" }}>Students</h3>
      {studentsLoading && <p>Loading students...</p>}
      {!studentsLoading && students.length === 0 && (
        <p>No students have joined this class yet.</p>
      )}
      {!studentsLoading && students.length > 0 && (
        <div style={{ border: "1px solid #ddd", borderRadius: "8px" }}>
          {students.map((student) => (
            <StudentListItem key={student.user_id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassDetail;