import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-surface-50 min-h-screen">
      {/* Left side Form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 px-8 sm:px-16 animate-[fadeIn_0.5s_ease-out]">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-surface-900 mb-2">Welcome Back</h1>
            <p className="text-surface-500">Please enter your details to sign in.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5 ml-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-primary"
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5 ml-1 flex justify-between">
                <span>Password</span>
                <span className="text-brand-600 hover:text-brand-700 cursor-pointer text-xs font-medium">Forgot password?</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-primary"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center h-12 mt-4"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-surface-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700 transition">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right side Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-600 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-800 opacity-90 z-0"></div>
        {/* Abstract shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-brand-300 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="z-10 text-center text-white px-12 max-w-xl">
          <h2 className="text-4xl font-bold mb-6">Manage your team's work in one place</h2>
          <p className="text-brand-100 text-lg leading-relaxed">
            Collaborate seamlessly, organize tasks efficiently, and deliver projects faster with our intuitive team task manager.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
