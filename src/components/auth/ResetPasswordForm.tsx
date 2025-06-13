import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { resetPasswordSchema, ResetPasswordInput } from '../../types/auth';
import { useAuthStore } from '../../store/auth';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPasswordForm: React.FC = () => {
  const { resetPassword, loading, error } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    await resetPassword(data);
    if (!error) {
      toast.success('Password reset instructions sent to your email');
      reset();
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reset Password</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email address
        </label>
        <div className="mt-1">
          <input
            {...register('email')}
            type="email"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Sending instructions...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </div>

      <div className="text-sm text-center">
        <Link
          to="/auth/signin"
          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Back to Sign in
        </Link>
      </div>
    </form>
  );
};

export default ResetPasswordForm;