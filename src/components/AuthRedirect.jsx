import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "../stores/authStore";

const AuthRedirect = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated && !isLoading) {
        await checkAuth();
      }
      setIsChecking(false);
    };

    verifyAuth();
  }, [isAuthenticated, isLoading, checkAuth]);

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Render children if not authenticated
  return children;
};

export default AuthRedirect;
