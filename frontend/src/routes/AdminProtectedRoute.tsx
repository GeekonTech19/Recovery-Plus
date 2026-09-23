import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
  const token = localStorage.getItem("recovery_plus_token");
  const storedUser = localStorage.getItem("recovery_plus_user");

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);

    if (
      user?.role !== "ADMIN" &&
      user?.role !== "SUPER_ADMIN"
    ) {
      return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
  } catch {
    return <Navigate to="/login" replace />;
  }
}