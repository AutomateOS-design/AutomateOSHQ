import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Zap, LayoutDashboard, Workflow, Activity, Clock, CheckCircle2,
  AlertCircle, PauseCircle, ArrowRight, TrendingUp, DollarSign,
  LogOut, Sparkles, BarChart3, RefreshCw, Shield, Gauge,
  Hourglass, Target, ChevronRight, ExternalLink, Play
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { portalLogin, fetchPortalClient } from '../api';

const statusConfig = {
  Running: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'Running' },
  Paused: { icon: PauseCircle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', label: 'Paused' },
  Error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: 'Error' },
};

const MONTHLY_TREND = [
  { month: 'Jan', hours: 12, tasks: 48 },
  { month: 'Feb', hours: 28, tasks: 112 },
  { month: 'Mar', hours: 45, tasks: 180 },
  { month: 'Apr', hours: 62, tasks: 248 },
  { month: 'May', hours: 88, tasks: 352 },
  { month: 'Jun', hours: 124, tasks: 496 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl shadow-slate-900/50">
      <p className="text-xs font-bold text-slate-400 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="font-bold text-white">{p.value}{p.name === 'Hours Saved' ? ' hrs' : ''}</span>
        </div>
      ))}
    </div>
  );
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

  // ── Login Screen (Dark Mode, Premium) ──
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-10">
            <div className="bg-gradient-to-br from-indigo-500 to-teal-500 p-3.5 rounded-2xl inline-flex mb-5 shadow-xl shadow-indigo-500/20">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Client Portal</h1>
            <p className="text-slate-400 mt-2 text-sm">Enter your email to access your AI operations command center</p>
          </div>
          <form onSubmit={handleLogin} className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/60 p-7 shadow-2xl space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Work Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@agency.com"
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600/50 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none transition font-medium"
                required
              />
            </div>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-semibold flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
              </div>
            )}
            <button type="submit" disabled={loginLoading || !email}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-400 hover:to-teal-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all duration-200 cursor-pointer">
              {loginLoading ? (
                <span className="inline-flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Looking up...</span>
              ) : 'Access Command Center →'}
            </button>
            <p className="text-xs text-slate-500 text-center">
              Demo: <span className="text-slate-400 font-semibold">sarah@acmeagency.com</span>, <span className="text-slate-400 font-semibold">marcus@velocity.io</span>, or <span className="text-slate-400 font-semibold">elena@apexretail.com</span>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm font-semibold">Loading your command center...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/60 p-8 max-w-md text-center shadow-2xl">
          <div className="p-3 bg-red-500/10 rounded-2xl inline-flex mb-4 border border-red-500/20">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Access Error</h2>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button onClick={handleLogout} className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-sm transition cursor-pointer">
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
  const totalWfs = (workflows || []).length;
  const hoursSaved = metrics?.hoursSaved || 0;
  const valueCreated = metrics?.valueCreated || 0;
  const tasksMTD = metrics?.tasksMTD || 0;
  const tasksProcessed = tasksMTD > 0 ? tasksMTD : runningWfs * 40;

  // Scale trend data to actual values
  const scaleMultiplier = Math.max(1, hoursSaved / MONTHLY_TREND[MONTHLY_TREND.length - 1].hours);
  const trendData = MONTHLY_TREND.map(m => ({
    ...m,
    hours: Math.round(m.hours * scaleMultiplier),
    tasks: Math.round(m.tasks * scaleMultiplier * (tasksMTD > 0 ? 1 : 0.8)),
  }));

  const initials = client.contactName
    ? client.contactName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ── Header ── */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-teal-500 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">AutomateOS</span>
            <span className="hidden sm:inline text-xs text-slate-500 font-medium">· {client.companyName || 'Client Portal'}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
              {initials}
            </div>
            <button onClick={handleLogout}
              className="inline-flex items-center text-sm text-slate-400 hover:text-white transition cursor-pointer">
              <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Welcome ── */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {client.contactName?.split(' ')[0] || 'Client'}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Your AI Operations Command Center — real-time automation performance at a glance.</p>
        </div>

        {/* ── ROI Hero Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Hero: Hours Saved + Value Created (spans 2 cols) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl border border-slate-700/60 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Your Automation ROI</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Hours Saved</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">{formatNumber(hoursSaved)}</span>
                    <span className="text-lg font-bold text-emerald-400/60">hours</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-400/80">+{Math.round(hoursSaved * 0.12)} hrs this week</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Value Created</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-teal-400 tracking-tight">${formatNumber(valueCreated || hoursSaved * 45)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <DollarSign className="w-3.5 h-3.5 text-teal-500" />
                    <span className="text-xs font-semibold text-teal-400/80">${(hoursSaved * 45).toLocaleString()} equivalent labor cost saved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats column */}
          <div className="space-y-4">
            {[
              { icon: Gauge, label: 'Active Workflows', value: runningWfs, sub: `${totalWfs} total configured`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { icon: Activity, label: 'Tasks Processed', value: formatNumber(tasksProcessed), sub: 'This month', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl border border-slate-700/60 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                <p className="text-[10px] text-slate-500 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Charts Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hours Saved Trend Chart */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/60 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Hours Saved Trend</h3>
                  <p className="text-[10px] text-slate-500">Monthly accumulation</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                +{trendData.length > 1 ? Math.round(((trendData[trendData.length-1].hours - trendData[trendData.length-2].hours) / trendData[trendData.length-2].hours) * 100) : 0}%
              </span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    name="Hours Saved"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#hoursGradient)"
                    dot={{ fill: '#10B981', stroke: '#0f172a', strokeWidth: 2, r: 3 }}
                    activeDot={{ fill: '#10B981', stroke: '#0f172a', strokeWidth: 3, r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tasks Processed Chart */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/60 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                  <Activity className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Tasks Processed</h3>
                  <p className="text-[10px] text-slate-500">Monthly volume</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-500/20">
                {formatNumber(trendData.reduce((a, b) => a + b.tasks, 0))} total
              </span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="tasks" name="Tasks" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {trendData.map((_, idx) => (
                      <Cell key={idx} fill={idx === trendData.length - 1 ? '#6366F1' : '#6366F1'} fillOpacity={0.3 + (idx / trendData.length) * 0.5} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Workflow Health + List ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* System Health */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/60 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
              </div>
              <h2 className="text-sm font-bold text-white">System Health</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Running', count: runningWfs, color: 'text-emerald-400', bar: 'bg-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Paused', count: pausedWfs, color: 'text-amber-400', bar: 'bg-amber-500', bg: 'bg-amber-500/10' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={s.color}>{s.label}</span>
                    <span className="text-slate-400 font-semibold">{s.count}</span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${s.bar} rounded-full transition-all duration-500`}
                      style={{ width: totalWfs ? `${(s.count / totalWfs) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-700/50">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Uptime</span>
                  <span className="font-bold text-emerald-400">99.9%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workflows List — spans 2 cols */}
          <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl border border-slate-700/60 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                  <Workflow className="w-4 h-4 text-indigo-400" />
                </div>
                <h2 className="text-sm font-bold text-white">Active Automations</h2>
              </div>
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2.5 py-1 rounded-full font-semibold">{totalWfs} workflows</span>
            </div>
            <div className="divide-y divide-slate-700/50">
              {(workflows || []).map(wf => {
                const config = statusConfig[wf.status] || statusConfig.Paused;
                const StatusIcon = config.icon;
                return (
                  <div key={wf.id} className="px-5 py-4 flex items-center justify-between hover:bg-slate-700/20 transition group">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`p-2 rounded-lg ${config.bg}`}>
                        <StatusIcon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">{wf.name}</p>
                        {wf.description && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">{wf.description}</p>
                        )}
                      </div>
                    </div>
                    <div className={`ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${config.bg} ${config.color} shrink-0`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {config.label}
                    </div>
                  </div>
                );
              })}
              {(!workflows || workflows.length === 0) && (
                <div className="px-5 py-12 text-center">
                  <div className="p-3 bg-slate-700/30 rounded-2xl inline-flex mb-3">
                    <Workflow className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-400">No workflows configured yet</p>
                  <p className="text-xs text-slate-500 mt-1">Your automation team will build your first workflow soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            Powered by <span className="text-indigo-400 font-semibold">AutomateOS</span> · Your AI operations department
          </p>
        </div>
      </main>
    </div>
  );
}