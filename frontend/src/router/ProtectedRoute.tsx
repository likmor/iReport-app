import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ role }: { role?: string }) {
  const { isLoggedIn, role: userRole } = useAuthStore();

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/" />;

  return <Outlet />;
}
