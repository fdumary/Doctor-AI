import { useState } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Props {
  role: 'patient' | 'doctor';
  onComplete: (accountData: AccountData) => void;
  onBack: () => void;
  onSwitchToLogin: () => void;
}

export interface AccountData {
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  userId: string;
}

export function CreateAccount(props: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async function() {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create user via server endpoint to bypass email confirmation
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1eba7937/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: email,
            password: password,
            name: name,
            role: props.role,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      // Now sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        console.error('Supabase signIn error after signup:', signInError);
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (signInData.user) {
        props.onComplete({
          name: name,
          email: email,
          role: props.role,
          userId: signInData.user.id,
        });
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async function() {
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (signInError) {
        console.error('Supabase Google OAuth error:', signInError);
        setError(signInError.message);
        setLoading(false);
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleAppleSignIn = async function() {
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (signInError) {
        console.error('Supabase Apple OAuth error:', signInError);
        setError(signInError.message);
        setLoading(false);
      }
    } catch (err) {
      console.error('Apple sign-in error:', err);
      setError('Apple sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleNameChange = function(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  };

  const handleEmailChange = function(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  };

  const handlePasswordChange = function(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = function(e: React.ChangeEvent<HTMLInputElement>) {
    setConfirmPassword(e.target.value);
  };

  const canSubmit = name.length > 0 && email.length > 0 && password.length >= 8 && password === confirmPassword && !loading;
  const roleLabel = props.role === 'patient' ? 'Patient' : 'Doctor';
  const submitButtonClass = canSubmit
    ? 'w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors'
    : 'w-full bg-gray-300 text-gray-500 p-4 rounded-xl font-semibold cursor-not-allowed';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
      <div className="p-6">
        <button
          type="button"
          onClick={props.onBack}
          className="text-gray-600 mb-4"
        >
          {'<'} Back
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
            {props.role === 'patient' ? '👤' : '🩺'}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Create Account</h1>
            <p className="text-sm text-gray-600">{roleLabel} Registration</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your full name"
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="At least 8 characters"
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Re-enter your password"
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Privacy Notice:</span> Your data is secure and will only be used for health tracking purposes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={submitButtonClass}
        >
          {loading ? 'Creating Account...' : 'Continue'}
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">Or continue with</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 p-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium">Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={handleAppleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 p-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span className="font-medium">Continue with Apple</span>
          </button>
        </div>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={props.onSwitchToLogin}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}