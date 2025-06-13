import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@supabase/supabase-js';
import { AuthState, SignUpInput, SignInInput, ResetPasswordInput } from '../types/auth';

// Ensure the URL has the proper protocol
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(
  supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}`,
  supabaseAnonKey
);

interface AuthStore extends AuthState {
  signUp: (data: SignUpInput) => Promise<void>;
  signIn: (data: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (data: ResetPasswordInput) => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      loading: true,
      error: null,

      signUp: async (data) => {
        try {
          set({ loading: true, error: null });
          
          // Sign up the user
          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                name: data.name,
                phone: data.phone,
              },
            },
          });

          if (signUpError) throw signUpError;

          set({
            loading: false,
            error: null,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred during sign up',
            loading: false,
            session: null,
            user: null,
          });
        }
      },

      signIn: async (data) => {
        try {
          set({ loading: true, error: null });
          const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });

          if (error) throw error;

          set({
            session: authData.session,
            user: authData.user,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Invalid email or password',
            loading: false,
            session: null,
            user: null,
          });
        }
      },

      signOut: async () => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          set({
            session: null,
            user: null,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error signing out',
            loading: false 
          });
        }
      },

      resetPassword: async (data) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          });
          
          if (error) throw error;
          
          set({ 
            loading: false,
            error: null,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error resetting password',
            loading: false 
          });
        }
      },

      refreshSession: async () => {
        try {
          set({ loading: true, error: null });
          
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          set({
            session,
            user: session?.user || null,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error refreshing session',
            loading: false,
            session: null,
            user: null,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        session: state.session,
        user: state.user,
      }),
    }
  )
);