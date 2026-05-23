import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = sessionStorage.getItem("tv_admin_auth") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
