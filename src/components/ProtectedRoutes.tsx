import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import type { JSX } from "react";
import { getDecodedToken } from "@/utils/auth";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
  userRole?: string;
}

const ProtectedRoute = ({
  children,
  allowedRoles,
  userRole,
}: ProtectedRouteProps) => {
  const accessToken = Cookies.get("access_token");
  const payload = getDecodedToken();
  payload?.role;
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    toast.error("You do not have permission to access this page");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
