import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Zap, LayoutDashboard, Workflow, Activity, Clock, CheckCircle2,
  AlertCircle, PauseCircle, ArrowRight, TrendingUp, DollarSign,
  LogOut, Sparkles, BarChart3, RefreshCw
} from 'lucide-react';
import { portalLogin, fetchPortalClient } from '../api';

const statusConfig = {
  Running: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200', label: 'Running' },
  Paused: { icon: PauseCircle, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', label: 'Paused' },
  Error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 border-red-200', label: 'Error' },
};

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toLocaleString();
}

export default function ClientPortal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [clientId, setClientId] = useState(searchParams.get('clientId') || '');
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  // Auto-login if clientId is in URL
  useEffect(() => {
    if (clientId) {
      setLoggedIn(true);
      setLoading(true);
      fetchPortalClient(clientId)
        .then(data => {
          if (data.client) {
            setPortalData(data);
          } else {
            setError('Client not found');
          }
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [clientId]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoginLoading(true);
    setError('');
    try {
      const result = await portalLogin(email);
      setClientId(result.clientId);
      setLoggedIn(true);
      const data = await fetchPortalClient(result.clientId);
      setPortalData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setClientId('');
    setLoggedIn(false);
    setPortalData(null);
    setEmail('');
    navigate('/portal');
  };

  // Login Screen
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-indigo-500 text-white p-3 rounded-xl inline-flex mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Client Portal</h1>
            <p className="text-slate-500 mt-1">Enter your email to access your automation dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@agency.com"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loginLoading || !email}
              className="w-full py-2.5 bg-indigo-500 text-white text-sm font-semibold rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition cursor-pointer">
              {loginLoading ? 'Looking up...' : 'Access Portal →'}
            </button>
            <p className="text-xs text-slate-400 text-center">
              Demo: try sarah@acmeagency.com, marcus@velocity.io, or elena@apexretail.com
            </p>
          </form>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Access Error</h2>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <button onClick={handleLogout} className="text-indigo-500 text-sm font-semibold hover:text-indigo-600 cursor-pointer">
            Try a different email →
          </button>
        </div>
      </div>
    );
  }

  const { client, metrics, workflows } = portalData || {};
  if (!client) return null;

  const runningWfs = (workflows || []).filter(w => w.status === 'Running').length;
  const pausedWfs = (workflows || []).filter(w => w.status === 'Paused').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-500 text-white p-1.5 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900">AutomateOS</span>
            <span className="text-xs text-slate-400 ml-2">· {client.companyName || 'Client Portal'}</span>
          </div>
          <button onClick={handleLogout}
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 transition cursor-pointer">
            <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome + Quick Stats */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Welcome back, {client.contactName || 'Client'}
          </h1>
          <p className="text-slate-500">Here's your automation overview</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Workflow, label: 'Active Workflows', value: metrics?.workflowsTotal || runningWfs, color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { icon: Activity, label: 'Tasks This Month', value: formatNumber(metrics?.tasksMTD || 0), color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { icon: Clock, label: 'Hours Saved', value: metrics?.hoursSaved || 0, color: 'text-amber-500', bg: 'bg-amber-50' },
            { icon: TrendingUp, label: 'Value Created', value: metrics?.valueCreated ? `$${formatNumber(metrics.valueCreated)}` : '$0', color: 'text-violet-500', bg: 'bg-violet-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Workflow Status Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center">
              <BarChart3 className="w-4 h-4 mr-1.5 text-indigo-500" /> System Health
            </h2>
          </div>
          <div className="flex space-x-4">
            {[
              { label: 'Running', count: runningWfs, color: 'text-emerald-500', bar: 'bg-emerald-500' },
              { label: 'Paused', count: pausedWfs, color: 'text-amber-500', bar: 'bg-amber-500' },
            ].map((s, i) => (
              <div key={i} className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className={s.color}>{s.label}</span>
                  <span className="text-slate-500">{s.count}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${s.bar} rounded-full transition-all`}
                    style={{ width: `${workflows?.length ? (s.count / workflows.length) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflows List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center">
              <Workflow className="w-4 h-4 mr-1.5 text-indigo-500" /> Active Automations
            </h2>
            <span className="text-xs text-slate-400">{workflows?.length || 0} workflows</span>
          </div>
          <div className="divide-y divide-slate-100">
            {(workflows || []).map(wf => {
              const config = statusConfig[wf.status] || statusConfig.Paused;
              const StatusIcon = config.icon;
              return (
                <div key={wf.id} className="px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{wf.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{wf.description}</p>
                  </div>
                  <div className={`ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg}`}>
                    <StatusIcon className={`w-3 h-3 mr-1 ${config.color}`} />
                    {config.label}
                  </div>
                </div>
              );
            })}
            {(!workflows || workflows.length === 0) && (
              <div className="px-4 py-8 text-center">
                <Workflow className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No workflows configured yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Powered by <span className="text-indigo-500 font-semibold">AutomateOS</span> · Your automation operations department
          </p>
        </div>
      </main>
    </div>
  );
}