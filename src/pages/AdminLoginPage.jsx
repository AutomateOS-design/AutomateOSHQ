import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Lock, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { adminLogin } from '../api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await adminLogin(password);
      // Store token in sessionStorage (cleared when tab closes)
      sessionStorage.setItem('automateos_admin_token', result.token);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo link */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="bg-gradient-to-tr from-indigo-500 to-teal-500 text-white p-2 rounded-lg">
            <Zap className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            AutomateOS
          </span>
        </Link>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="p-3 bg-indigo-500/10 inline-flex rounded-2xl mb-4 border border-indigo-500/20">
              <Lock className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Console Login</h1>
            <p className="text-slate-400 text-sm mt-1.5">Enter the admin password to access the operations dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5" htmlFor="password">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-11 pr-10 py-3 bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:bg-slate-900 rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium text-white placeholder-slate-600"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!password || loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Unlock Console
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition">
              ← Back to main site
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6 font-semibold">
          Secured operations panel. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}