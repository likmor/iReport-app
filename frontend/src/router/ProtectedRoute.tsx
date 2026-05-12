import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ roles }: { roles?: string[] }) {
  const { isLoggedIn, role: userRole } = useAuthStore();

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (roles && !roles.includes(userRole ?? "")) return <Navigate to="/" />;

  return <Outlet />;
}
