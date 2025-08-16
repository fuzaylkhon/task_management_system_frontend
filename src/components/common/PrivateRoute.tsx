import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
