import {
  Navigate,
  Outlet,
  useOutletContext,
} from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // Get context from AppLayout
  const context = useOutletContext();

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  // Forward it to child routes
  return <Outlet context={context} />;
};

export default RoleRoute;