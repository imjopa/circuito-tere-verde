import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

export interface ProtectedRouteProps {
  children?: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = sessionStorage.getItem("tv_admin_auth") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children ?? <Outlet />;
}
