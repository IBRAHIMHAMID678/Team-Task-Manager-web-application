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
    <div className="min-h-screen bg-darkBg flex items-center justify-center relative overflow-hidden font-sans">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="z-10 w-full max-w-md p-10 bg-[#17181C] rounded-2xl border border-borderColor shadow-2xl relative shadow-[0_4px_30px_rgba(0,0,0,0.5)] my-8">
        <div className="mb-8 text-center pt-2">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Create an account</h1>
          <p className="text-sm text-textMuted tracking-wide">Join us and start managing tasks.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded bg-red-900/40 border border-red-800 text-red-200 text-sm flex items-center space-x-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="input-auth-label">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-auth"
              placeholder="e.g. johndoe"
              required
            />
          </div>
          
          <div>
            <label className="input-auth-label">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-auth"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="input-auth-label">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-auth"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="input-auth-label">CONFIRM PASSWORD</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-auth"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-auth mt-6"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              </svg>
            ) : (
              <span className="flex items-center space-x-2">
                <span>SIGN UP</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-textMuted tracking-wide">
          Already have an account?{' '}
          <Link to="/login" className="text-brandLime hover:text-brandLimeHover transition-colors ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
