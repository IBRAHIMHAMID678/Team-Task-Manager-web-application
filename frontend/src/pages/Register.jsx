import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err) {
      setError(Object.values(err.response?.data || {}).join(' ') || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-surface-50 min-h-screen">
      {/* Right side Visual (Swapped for Register) */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-600 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-500 opacity-90 z-0"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-300 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        <div className="z-10 text-center text-white px-12 max-w-xl">
          <h2 className="text-4xl font-bold mb-6">Join our growing community</h2>
          <p className="text-brand-100 text-lg leading-relaxed">
            Create an account and start managing your team's tasks more efficiently today. Experience the boost in productivity.
          </p>
        </div>
      </div>

      {/* Left side Form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 px-8 sm:px-16 animate-[fadeIn_0.5s_ease-out]">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-soft border border-surface-100 relative">
          
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-surface-900 mb-2">Create Account</h1>
            <p className="text-surface-500">Sign up to get started with Team Task Manager.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1 ml-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-primary py-2 px-3 lg:py-2.5 lg:px-4 text-sm"
                placeholder="Choose a username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1 ml-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-primary py-2 px-3 lg:py-2.5 lg:px-4 text-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="sm:flex sm:space-x-4">
              <div className="w-full mb-4 sm:mb-0">
                <label className="block text-sm font-medium text-surface-700 mb-1 ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-primary py-2 px-3 lg:py-2.5 lg:px-4 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-surface-700 mb-1 ml-1">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-primary py-2 px-3 lg:py-2.5 lg:px-4 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center h-12 mt-6"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-surface-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
