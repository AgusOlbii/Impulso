import { Navigate, Outlet } from "react-router-dom";
import Unauthorized from "./components/Unauthorized"; 

export const ProtectedRoute = ({ user, allowedRoles, children }) => {

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Unauthorized />;
  }
  
  return children ? children : <Outlet />;
};