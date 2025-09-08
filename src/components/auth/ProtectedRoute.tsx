import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, emailVerified, hasOnboarded } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but email not verified → redirect to email verification
  if (!emailVerified && location.pathname !== "/verify-email") {
    return <Navigate to="/verify-email" replace />;
  }

  // Email verified but not onboarded → redirect to onboarding
  if (emailVerified && !hasOnboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // Email verified and onboarded but on verify/onboarding pages → redirect to dashboard
  if (emailVerified && hasOnboarded && (location.pathname === "/verify-email" || location.pathname === "/onboarding")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
