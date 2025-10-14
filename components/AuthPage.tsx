import React, { useState } from 'react';
import { User } from '../types';
import { EyeIcon, EyeSlashIcon } from './Icons';

interface AuthPageProps {
  onLogin: (username: string, password: string) => { success: boolean; message: string; user?: User };
  onSignup: (username: string, password: string) => { success: boolean; message: string; user?: User };
  onAuthSuccess: (user: User, remember: boolean) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup, onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onLogin(username, password);
    if (result.success && result.user) {
      onAuthSuccess(result.user, rememberMe);
    } else {
      setError(result.message);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    if (!username.trim()) {
        setError("Username cannot be empty.");
        return;
    }
    const result = onSignup(username, password);
    if (result.success && result.user) {
      // Default to remembering the user on signup for better UX
      onAuthSuccess(result.user, true);
    } else {
      setError(result.message);
    }
  };

  const switchToLogin = () => {
    setIsLoginView(true);
    setError(null);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const switchToSignup = () => {
    setIsLoginView(false);
    setError(null);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };
  
  const FormHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-400">{subtitle}</p>
    </div>
  );

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1574887345625-97e3a3a42c2c?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Dark overlay to improve contrast */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Form container with glassmorphism effect */}
      <div className="relative w-full max-w-md bg-[#2f3136]/80 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-white/10">
        {isLoginView ? (
          <>
            <FormHeader title="Welcome Back!" subtitle="We're so excited to see you again!" />
            <form onSubmit={handleLoginSubmit} noValidate>
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2" htmlFor="login-username">
                  Username
                </label>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Vortex"
                  className="w-full bg-[#202225] p-3 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  autoComplete="username"
                />
              </div>
               <div className="mb-4">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2" htmlFor="login-password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#202225] p-3 pr-10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-500 rounded bg-gray-700"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Remember me
                  </label>
                </div>
              </div>
              {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
              <button type="submit" className="w-full bg-green-600 text-white font-semibold p-3 rounded-md hover:bg-green-700 transition-colors">
                Login
              </button>
            </form>
            <p className="text-center text-sm text-gray-400 mt-4">
              Need an account?{' '}
              <button onClick={switchToSignup} className="text-green-400 hover:underline font-semibold">
                Register
              </button>
            </p>
          </>
        ) : (
          <>
            <FormHeader title="Create an account" subtitle="Join the EchoLink community!" />
            <form onSubmit={handleSignupSubmit} noValidate>
               <div className="mb-4">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2" htmlFor="signup-username">
                  Username
                </label>
                <input
                  id="signup-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Phoenix"
                  className="w-full bg-[#202225] p-3 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  autoComplete="username"
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2" htmlFor="signup-password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#202225] p-3 pr-10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    autoComplete="new-password"
                  />
                   <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2" htmlFor="signup-confirm-password">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="signup-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#202225] p-3 pr-10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    autoComplete="new-password"
                  />
                   <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
               <button type="submit" className="w-full bg-green-600 text-white font-semibold p-3 rounded-md hover:bg-green-700 transition-colors">
                Sign Up
              </button>
            </form>
            <p className="text-center text-sm text-gray-400 mt-4">
              Already have an account?{' '}
              <button onClick={switchToLogin} className="text-green-400 hover:underline font-semibold">
                Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;