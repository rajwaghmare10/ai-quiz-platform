import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import ClassDetail from "../pages/teacher/ClassDetail";
import StudentDashboard from "../pages/student/StudentDashboard";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import RoleRoute from "../components/layout/RoleRoute";
import QuizDetail from "../pages/teacher/QuizDetail";
import StudentClassDetail from "../pages/student/StudentClassDetail";
import QuizAttempt from "../pages/student/QuizAttempt";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={["teacher"]} />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/classes/:classId" element={<ClassDetail />} />
          <Route path="/teacher/quizzes/:quizId" element={<QuizDetail />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/classes/:classId" element={<StudentClassDetail />} />
          <Route path="/student/attempts/:quizId" element={<QuizAttempt />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;