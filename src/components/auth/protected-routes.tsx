import { checkRole } from "@/middleware/auth";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";

type Props = {
  roles: string[];
};

export default function ProtectedRoute({ roles }: Props) {
  const isAllowed = checkRole(roles);

  if (!isAllowed) {
    toast.error("You do not have permission to access this page");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
