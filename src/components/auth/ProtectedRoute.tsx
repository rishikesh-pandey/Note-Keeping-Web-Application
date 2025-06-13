import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;