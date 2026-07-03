import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import ClassDetail from "../pages/teacher/ClassDetail";
import StudentDashboard from "../pages/student/StudentDashboard";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import RoleRoute from "../components/layout/RoleRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={["teacher"]} />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/classes/:classId" element={<ClassDetail />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;