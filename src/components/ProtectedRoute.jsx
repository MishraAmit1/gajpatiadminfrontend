import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "../stores/authStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const location = useLocation();
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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
