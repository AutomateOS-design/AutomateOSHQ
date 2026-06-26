import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Workflow, Send, CreditCard, LifeBuoy,
  Zap, Activity, Clock, DollarSign, Plus, CheckCircle2, 
  ArrowUpRight, Check, AlertCircle, Sliders, Users,
  Sparkles, TrendingUp, RefreshCw, ChevronRight,
  Menu, X, BarChart3, Gauge, Layers, Bell,
  Percent, Star, ExternalLink, HelpCircle,
  AlertTriangle, Building2, Mail
} from 'lucide-react';
import { fetchClients, fetchRequests, createRequest } from '../api';

const SlackIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.043a2.528 2.528 0 0 1-2.522 2.52H8.824a2.528 2.528 0 0 1-2.52-2.52v-5.043zm2.52-6.341a2.528 2.528 0 0 1-2.52-2.52 2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522v2.52h-2.522zm0 1.261a2.528 2.528 0 0 1 2.522 2.52v5.043a2.528 2.528 0 0 1-2.522 2.52H3.782a2.528 2.528 0 0 1-2.52-2.52V10.08a2.528 2.528 0 0 1 2.52-2.52h5.043zm6.341 5.043a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522 2.528 2.528 0 0 1-2.522 2.52h-2.52v-2.52zm-1.261 0a2.528 2.528 0 0 1-2.52 2.52H6.341a2.528 2.528 0 0 1-2.522-2.52V8.824a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043zm-2.52 6.341a2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.522 2.528 2.528 0 0 1-2.522-2.522v-2.52h2.522zm0-1.261a2.528 2.528 0 0 1-2.522-2.52V6.341a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52-2.52H10.08z"/>
  </svg>
);

const planConfigurations = {
  starter: { name: 'Starter Flow', price: '$999/mo', limit: 2, badge: 'Starter' },
  growth: { name: 'Growth Engine', price: '$2,499/mo', limit: 5, badge: 'Growth' },
  dedicated: { name: 'Dedicated Retainer', price: '$4,999/mo', limit: Infinity, badge: 'Enterprise' }
};

// Status badge colors
const statusColors = {
  'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'In Development': 'bg-amber-50 text-amber-700 border-amber-200',
  'Under Review': 'bg-blue-50 text-blue-700 border-blue-200',
  'Pending': 'bg-slate-50 text-slate-600 border-slate-200',
  'Reviewing': 'bg-amber-50 text-amber-700 border-amber-200',
  'Approved': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Paused': 'bg-red-50 text-red-700 border-red-200'
};

const statusIcons = {
  'Active': CheckCircle2,
  'In Development': RefreshCw,
  'Under Review': AlertCircle,
  'Pending': Clock,
  'Reviewing': AlertCircle,
  'Approved': Check,
  'Paused': AlertTriangle
};

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'workflows', label: 'Workflows', icon: Workflow },
  { id: 'requests', label: 'Requests', icon: Send },
  { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  { id: 'support', label: 'Support', icon: LifeBuoy },
];

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const urlClientId = searchParams.get('clientId');
  const showWelcome = searchParams.get('onboarded') === 'true';

  const [welcomeDismissed, setWelcomeDismissed] = useState(!showWelcome);
  const [clients, setClients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [currentClient, setCurrentClient] = useState(null);
  const [newRequestTitle, setNewRequestTitle] = useState('');
  const [newRequestDesc, setNewRequestDesc] = useState('');
  const [newRequestPriority, setNewRequestPriority] = useState('normal');
  const [newRequestCategory, setNewRequestCategory] = useState('integration');
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clientsData, requestsData] = await Promise.all([
        fetchClients(),
        fetchRequests()
      ]);
      
      setClients(clientsData);
      setRequests(requestsData);

      let currentId = urlClientId;
      if (!currentId) {
        currentId = sessionStorage.getItem('automateos_current_client_id');
      }
      if (!currentId && clientsData.length > 0) {
        currentId = clientsData[0].id;
      }

      const matched = clientsData.find(c => c.id === currentId) || clientsData[0] || null;
      if (matched) {
        setCurrentClient(matched);
        sessionStorage.setItem('automateos_current_client_id', matched.id);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [urlClientId]);

  useEffect(() => {
    if (urlClientId && clients.length > 0) {
      const match = clients.find(c => c.id === urlClientId);
      if (match) {
        setCurrentClient(match);
        sessionStorage.setItem('automateos_current_client_id', match.id);
      }
    }
  }, [urlClientId, clients]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!newRequestTitle.trim() || !currentClient) return;

    try {
      const priorityLabels = { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' };
      const categoryLabels = { integration: 'Custom Integration', ai: 'AI Workflow', data: 'Data Sync', reporting: 'Reporting', other: 'Other' };

      await createRequest({
        id: Date.now(),
        clientId: currentClient.id,
        clientName: currentClient.companyName,
        title: newRequestTitle,
        description: newRequestDesc,
        type: categoryLabels[newRequestCategory],
        priority: priorityLabels[newRequestPriority],
        tools: JSON.stringify(['Custom App API', 'Workflow Engine']),
        status: 'Pending',
        hoursSaved: 0,
        runs: 0,
        submitted: 'Just now'
      });

      setNewRequestTitle('');
      setNewRequestDesc('');
      setNewRequestPriority('normal');
      setNewRequestCategory('integration');
      setRequestSuccess(true);
      setTimeout(() => setRequestSuccess(false), 4000);
      
      await loadData();
    } catch (err) {
      console.error('Failed to submit request:', err);
    }
  };

  if (loading || !currentClient) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center flex-col gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
        <p className="text-slate-400 text-sm font-semibold">
          {loading ? 'Connecting to secure database...' : 'No client data found'}
        </p>
      </div>
    );
  }

  const selectedPlan = currentClient.plan || 'starter';
  const currentConfig = planConfigurations[selectedPlan] || planConfigurations.starter;

  const clientAllRequests = requests.filter(r => r.clientId === currentClient.id);
  const automations = clientAllRequests.filter(r => r.status === 'Active' || r.status === 'In Development');
  const clientPending = clientAllRequests.filter(r => r.status === 'Pending' || r.status === 'Reviewing');

  const totalHoursSaved = currentClient.hoursSaved || currentClient.metrics?.hoursSaved || 0;
  const totalRuns = currentClient.executionsMTD || currentClient.metrics?.executionsMTD || 0;
  const dollarsSaved = currentClient.valueCreated || currentClient.metrics?.valueCreated || 0;
  const activeCount = automations.filter(r => r.status === 'Active').length;
  const workflowUsage = currentConfig.limit === Infinity ? 100 : Math.round((activeCount / currentConfig.limit) * 100);

  const initials = currentClient.contactName
    ? currentClient.contactName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const NavLink = ({ item, onClick }) => {
    const Icon = item.icon;
    const isActive = activeSection === item.id;
    return (
      <button
        onClick={() => { setActiveSection(item.id); onClick?.(); setSidebarOpen(false); }}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          isActive
            ? 'bg-indigo-500/10 text-indigo-400 shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
        {item.label}
        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
      </button>
    );
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-slate-800/60">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight">AutomateOS</span>
            <span className="block text-[9px] font-bold text-indigo-400 tracking-widest uppercase">Client Portal</span>
          </div>
        </Link>
      </div>

      {/* Client Info */}
      <div className="px-5 py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-indigo-500/20">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{currentClient.companyName || 'Unnamed Client'}</p>
            <p className="text-[10px] text-slate-500 font-semibold">{currentClient.contactName || 'Contact'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarItems.map(item => (
          <NavLink key={item.id} item={item} onClick={() => {}} />
        ))}
      </nav>

      {/* Plan Badge */}
      <div className="px-4 py-4 border-t border-slate-800/60">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Plan</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              selectedPlan === 'growth' ? 'bg-indigo-500/20 text-indigo-400' :
              selectedPlan === 'dedicated' ? 'bg-teal-500/20 text-teal-400' :
              'bg-slate-700 text-slate-300'
            }`}>
              {currentConfig.badge}
            </span>
          </div>
          <p className="text-sm font-bold text-white">{currentConfig.name}</p>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{currentConfig.price}</p>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <>
      {/* Greeting Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {greeting()}, {currentClient.contactName?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">Here's your automation performance summary.</p>
      </div>

      {/* Welcome Banner */}
      {!welcomeDismissed && (
        <div className="bg-gradient-to-r from-indigo-500 via-indigo-500 to-teal-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/10 relative mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 opacity-5">
            <Zap className="w-full h-full" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white mb-3 border border-white/10">
              <Sparkles className="w-3 h-3 mr-1" /> Registration Complete
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Welcome to AutomateOS!</h2>
            <p className="text-white/80 text-sm mt-2 leading-relaxed max-w-lg">
              Your <strong>{currentConfig.name}</strong> subscription is active. We've set up your Slack channel and assigned a dedicated automation engineer.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                onClick={() => setWelcomeDismissed(true)} 
                className="px-5 py-2.5 bg-white text-indigo-600 font-bold rounded-xl text-xs hover:bg-slate-50 transition shadow-lg"
              >
                Go to Dashboard
              </button>
              <a 
                href="https://slack.com" target="_blank" rel="noreferrer" 
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl text-xs transition inline-flex items-center gap-1.5"
              >
                <SlackIcon className="w-3.5 h-3.5" /> Open Support Slack
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 bg-indigo-50 rounded-xl">
              <Clock className="w-5 h-5 text-indigo-500" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">+12% vs last month</span>
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time Saved</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalHoursSaved} <span className="text-sm font-bold text-slate-400">hrs</span></p>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
            <TrendingUp className="w-3 h-3 text-emerald-500" /> Based on live workflow runs
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Value Generated</span>
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Value Created</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">${dollarsSaved.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
            <span className="text-emerald-500 font-bold">$45/hr</span> equivalent labor cost
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 bg-cyan-50 rounded-xl">
              <Activity className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-semibold text-emerald-600">Live</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Workflow Runs</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalRuns.toLocaleString()}</p>
          <div className="mt-2 text-[10px] text-slate-400 font-semibold">Executions this month</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 bg-indigo-50 rounded-xl">
              <Gauge className="w-5 h-5 text-indigo-500" />
            </div>
            <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">{activeCount} Active</span>
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Workflow Usage</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{currentConfig.limit === Infinity ? <>&infin;</> : activeCount}/{currentConfig.limit}</p>
          {currentConfig.limit !== Infinity && (
            <div className="mt-3">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(workflowUsage, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">{workflowUsage}% of plan limit used</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Workflows */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Workflows */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Active Workflows</h2>
                <p className="text-xs text-slate-500 mt-0.5">Automations currently running for your business.</p>
              </div>
              <Link
                to={`/onboarding?plan=${selectedPlan}`}
                className="text-xs font-bold text-indigo-500 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1"
              >
                Request New <Plus className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {automations.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Workflow className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 mb-1">No active workflows yet</p>
                  <p className="text-xs text-slate-400 mb-4">Submit your first automation request to get started.</p>
                  <Link
                    to={`/onboarding?plan=${selectedPlan}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500 text-white font-bold rounded-xl text-xs hover:bg-indigo-600 transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Submit Your First Request
                  </Link>
                </div>
              ) : (
                automations.map((automation) => {
                  const StatusIcon = statusIcons[automation.status] || CheckCircle2;
                  const statusClass = statusColors[automation.status] || 'bg-slate-50 text-slate-600 border-slate-200';
                  return (
                    <div key={automation.id} className="px-6 py-5 hover:bg-slate-50/60 transition group">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <h3 className="font-bold text-slate-900 text-sm truncate">{automation.title}</h3>
                            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${statusClass}`}>
                              <StatusIcon className="w-2.5 h-2.5" />
                              {automation.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{automation.type || 'Custom Integration'}</p>
                          
                          {automation.tools && (
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {(typeof automation.tools === 'string' ? JSON.parse(automation.tools) : automation.tools).map((tool, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
                          {automation.status === 'Active' && (
                            <div className="text-right bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Saved /mo</p>
                              <p className="text-sm font-extrabold text-indigo-500">{automation.hoursSaved || 0} hrs</p>
                            </div>
                          )}
                          <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> Updated {automation.updated || 'Today'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Slack Integration Box */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-100/50">
                <SlackIcon className="w-6 h-6 text-[#4A154B]" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Need Changes Now?</h4>
                <p className="text-xs text-slate-500 mt-0.5">Ping your engineer directly in the Slack support channel.</p>
              </div>
            </div>
            <a 
              href="https://slack.com" target="_blank" rel="noreferrer" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4A154B] hover:bg-[#3B113C] text-white font-bold rounded-xl text-xs shadow-sm transition group"
            >
              Open Slack Channel <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition" />
            </a>
          </div>
        </div>

        {/* Right Column: Request + Queue + Support */}
        <div className="space-y-6">
          {/* Submit Request */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-500" />
                New Automation Request
              </h2>
            </div>
            
            <div className="p-5">
              {requestSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-800">Request queued!</p>
                    <p className="text-[10px] text-emerald-600">Expect feedback in under 24 hours.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleRequestSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="requestCategory">Category</label>
                  <select
                    id="requestCategory"
                    value={newRequestCategory}
                    onChange={(e) => setNewRequestCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-xs font-semibold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="integration">Custom Integration</option>
                    <option value="ai">AI Workflow</option>
                    <option value="data">Data Sync</option>
                    <option value="reporting">Reporting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="requestTitle">Automation Goal</label>
                  <input 
                    type="text" 
                    id="requestTitle"
                    placeholder="e.g., Sync Typeform to Salesforce CRM"
                    value={newRequestTitle}
                    onChange={(e) => setNewRequestTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="requestDesc">Details (optional)</label>
                  <textarea 
                    id="requestDesc"
                    rows="2"
                    placeholder="Describe triggers, tools, and desired outcomes..."
                    value={newRequestDesc}
                    onChange={(e) => setNewRequestDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-xs resize-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priority</label>
                  <div className="flex gap-2">
                    {['low', 'normal', 'high', 'urgent'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewRequestPriority(p)}
                        className={`flex-1 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border ${
                          newRequestPriority === p
                            ? p === 'urgent' ? 'bg-red-50 border-red-200 text-red-700'
                              : p === 'high' ? 'bg-amber-50 border-amber-200 text-amber-700'
                              : p === 'normal' ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md shadow-indigo-500/20 transition"
                >
                  <Plus className="w-4 h-4" /> Queue Automation Request
                </button>
              </form>
            </div>
          </div>

          {/* Request Queue */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                Request Queue
              </h2>
            </div>

            <div className="p-5">
              {clientPending.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-slate-100">
                    <Check className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-xs font-bold text-slate-400">All caught up!</p>
                  <p className="text-[10px] text-slate-400 mt-1">No pending requests in queue.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {clientPending.map((req) => (
                    <div key={req.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between gap-3 hover:border-slate-300 transition">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            req.status === 'Reviewing' ? 'bg-amber-500' : 'bg-indigo-500'
                          }`} />
                          <h4 className="font-bold text-slate-800 text-xs truncate">{req.title}</h4>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1 ml-3.5">
                          <Clock className="w-2.5 h-2.5" /> Submitted {req.submitted || 'recently'}
                        </span>
                      </div>
                      <span className={`text-[8px] font-bold px-2 py-1 rounded-full whitespace-nowrap border ${
                        req.status === 'Reviewing' 
                          ? 'bg-amber-50 text-amber-700 border-amber-100' 
                          : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Support Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-teal-500/20 rounded-lg">
                  <LifeBuoy className="w-4 h-4 text-teal-400" />
                </div>
                <span className="text-[9px] font-bold text-teal-400 tracking-widest uppercase">Support Hotline</span>
              </div>
              <h3 className="text-base font-extrabold tracking-tight">Need Strategy Help?</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Book a personalized strategy review. We'll audit your tech stack and find additional efficiency gains.
              </p>
              <button className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-slate-900 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 transition shadow-lg shadow-teal-500/20">
                Book Strategy Review <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderWorkflows = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">All Workflows</h1>
        <p className="text-sm text-slate-500 mt-1">View and manage all your automated workflows.</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
        <Workflow className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-400">Detailed workflow management coming soon</p>
        <p className="text-xs text-slate-400 mt-1">You can view active workflows in Overview.</p>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Billing & Plan</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your subscription and payment details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Plan</p>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">{currentConfig.name}</h2>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${
              selectedPlan === 'growth' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
              selectedPlan === 'dedicated' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
              'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              {currentConfig.price}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Workflow Limit</span>
              <span className="font-bold text-slate-900">{currentConfig.limit === Infinity ? 'Unlimited' : `${activeCount}/${currentConfig.limit} used`}</span>
            </div>
            {currentConfig.limit !== Infinity && (
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full" style={{ width: `${Math.min(workflowUsage, 100)}%` }} />
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Next Billing</span>
              <span className="font-bold text-slate-900">July 20, 2026</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Support SLA</span>
              <span className="font-bold text-slate-900">
                {selectedPlan === 'starter' ? '48 hours' : selectedPlan === 'growth' ? '24 hours' : '1 hour'}
              </span>
            </div>
          </div>

          <Link
            to="/onboarding"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-indigo-500 hover:bg-indigo-600 transition shadow-sm"
          >
            Upgrade Plan <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Payment Method Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Method</p>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Visa •••• 4242</h2>
            </div>
            <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-200">
              Active
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Billing Cycle</span>
              <span className="font-bold text-slate-900">Monthly</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Last Payment</span>
              <span className="font-bold text-slate-900">June 20, 2026</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Total Spent</span>
              <span className="font-bold text-slate-900">${currentConfig.price.replace('/mo', '').replace('$', '')}.00</span>
            </div>
          </div>

          <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition">
            Manage Payment Method <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Invoice History */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Invoice History</p>
          <div className="space-y-2">
            {['Jun 20, 2026', 'May 20, 2026', 'Apr 20, 2026'].map((date, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-600">{date}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-900">{currentConfig.price}</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Paid</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cancel / Pause */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Plan Settings</p>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            You can pause or cancel your subscription at any time. Your workflows will remain active until the end of your billing period.
          </p>
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition">
              Pause Subscription
            </button>
            <button className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition">
              Cancel Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Request History</h1>
        <p className="text-sm text-slate-500 mt-1">Track all your automation requests and their status.</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {clientAllRequests.length === 0 ? (
            <div className="p-12 text-center">
              <Send className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-400">No requests yet</p>
              <p className="text-xs text-slate-400 mt-1">Submit your first automation request from the Overview page.</p>
            </div>
          ) : (
            clientAllRequests.map((req) => {
              const StatusIcon = statusIcons[req.status] || CheckCircle2;
              const statusClass = statusColors[req.status] || 'bg-slate-50 text-slate-600 border-slate-200';
              return (
                <div key={req.id} className="px-6 py-4 hover:bg-slate-50/60 transition flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{req.title}</h4>
                      <span className={`inline-flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${statusClass}`}>
                        <StatusIcon className="w-2 h-2" />
                        {req.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{req.type || 'Custom Integration'} · Submitted {req.submitted || 'recently'}</p>
                  </div>
                  {req.hoursSaved > 0 && (
                    <div className="text-right ml-4 shrink-0">
                      <p className="text-[9px] font-bold text-slate-400">Saved</p>
                      <p className="text-sm font-extrabold text-indigo-500">{req.hoursSaved} hrs</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Support</h1>
        <p className="text-sm text-slate-500 mt-1">Get help and connect with your automation team.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="p-2.5 bg-[#4A154B]/10 rounded-xl w-fit mb-4">
            <SlackIcon className="w-6 h-6 text-[#4A154B]" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Slack Support Channel</h3>
          <p className="text-sm text-slate-600 mb-4">Your dedicated channel is live. Ping your engineer anytime for immediate assistance.</p>
          <a href="https://slack.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4A154B] hover:bg-[#3B113C] text-white font-bold rounded-xl text-xs transition shadow-sm">
            Open Slack <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="p-2.5 bg-indigo-50 rounded-xl w-fit mb-4">
            <Mail className="w-6 h-6 text-indigo-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Email Support</h3>
          <p className="text-sm text-slate-600 mb-4">For non-urgent inquiries, email our support team and we'll respond within SLA.</p>
          <a href="mailto:support@automateos.io" className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-xl text-xs border border-indigo-100 transition">
            support@automateos.io <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-teal-400" />
            <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">Response Times</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-black text-white">{selectedPlan === 'starter' ? '48h' : selectedPlan === 'growth' ? '24h' : '1h'}</p>
              <p className="text-xs text-slate-400 font-semibold">Standard Response</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400">24/7</p>
              <p className="text-xs text-slate-400 font-semibold">Monitoring</p>
            </div>
            <div>
              <p className="text-2xl font-black text-indigo-400">100%</p>
              <p className="text-xs text-slate-400 font-semibold">Uptime Guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'workflows': return renderWorkflows();
      case 'requests': return renderRequests();
      case 'billing': return renderBilling();
      case 'support': return renderSupport();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-900 border-r border-slate-800 fixed inset-y-0 left-0 z-30">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="absolute top-4 right-4">
          <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <NavContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Left: Mobile menu toggle + breadcrumb */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 font-semibold">
                <span className="text-slate-900 font-bold">Dashboard</span>
                <ChevronRight className="w-3 h-3" />
                <span className="capitalize">{activeSection}</span>
              </div>
            </div>

            {/* Right: Client switcher + admin link + avatar */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-xl">
                <span className="text-[9px] font-bold text-slate-500 pl-2 uppercase tracking-wider">Client:</span>
                <select
                  value={currentClient.id}
                  onChange={(e) => {
                    const targetId = e.target.value;
                    const found = clients.find(c => c.id === targetId);
                    if (found) {
                      setCurrentClient(found);
                      sessionStorage.setItem('automateos_current_client_id', found.id);
                      setSearchParams({ clientId: found.id });
                    }
                  }}
                  className="bg-white border border-slate-200 text-xs font-black text-indigo-600 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer hover:border-indigo-300 transition"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({planConfigurations[c.plan]?.badge || c.plan})
                    </option>
                  ))}
                </select>
              </div>

              <Link
                to="/admin/login"
                className="px-3 py-1.5 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-[10px] transition inline-flex items-center gap-1.5 shadow-sm"
              >
                <Sliders className="w-3 h-3 text-indigo-500" />
                <span className="hidden sm:inline">Admin</span>
              </Link>

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-indigo-500/20">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white">
          <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
              <Building2 className="w-3 h-3" /> AutomateOS Portal — Confidential & Secure
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
              <span>Data persisted via Turso</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>SSL Encrypted</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}