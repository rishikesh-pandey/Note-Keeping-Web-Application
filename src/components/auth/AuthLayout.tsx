import React from 'react';
import { FileText } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/20">
            <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Notes App
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;