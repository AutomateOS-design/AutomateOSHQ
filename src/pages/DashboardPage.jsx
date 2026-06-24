import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Zap, Activity, Clock, DollarSign, Plus, CheckCircle2, 
  ArrowUpRight, CheckCircle, AlertCircle, Sliders, Users,
  Sparkles, TrendingUp, RefreshCw
} from 'lucide-react';
import { fetchClients, fetchRequests, createRequest } from '../api';

const SlackIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.043a2.528 2.528 0 0 1-2.522 2.52H8.824a2.528 2.528 0 0 1-2.52-2.52v-5.043zm2.52-6.341a2.528 2.528 0 0 1-2.52-2.52 2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522v2.52h-2.522zm0 1.261a2.528 2.528 0 0 1 2.522 2.52v5.043a2.528 2.528 0 0 1-2.522 2.52H3.782a2.528 2.528 0 0 1-2.52-2.52V10.08a2.528 2.528 0 0 1 2.52-2.52h5.043zm6.341 5.043a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522 2.528 2.528 0 0 1-2.522 2.52h-2.52v-2.52zm-1.261 0a2.528 2.528 0 0 1-2.52 2.52H6.341a2.528 2.528 0 0 1-2.522-2.52V8.824a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043zm-2.52 6.341a2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.522 2.528 2.528 0 0 1-2.522-2.522v-2.52h2.522zm0-1.261a2.528 2.528 0 0 1-2.522-2.52V6.341a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52-2.52H10.08z"/>
  </svg>
);

const planConfigurations = {
  starter: { name: 'Starter Flow', price: '$999/mo', limit: '2' },
  growth: { name: 'Growth Engine', price: '$2,499/mo', limit: '5' },
  dedicated: { name: 'Dedicated Retainer', price: '$4,999/mo', limit: 'Infinite' }
};

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlClientId = searchParams.get('clientId');
  const showWelcome = searchParams.get('onboarded') === 'true';

  const [welcomeDismissed, setWelcomeDismissed] = useState(!showWelcome);
  const [clients, setClients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [currentClient, setCurrentClient] = useState(null);
  const [newRequestTitle, setNewRequestTitle] = useState('');
  const [newRequestDesc, setNewRequestDesc] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clientsData, requestsData] = await Promise.all([
        fetchClients(),
        fetchRequests()
      ]);
      
      setClients(clientsData);
      setRequests(requestsData);

      // Determine current client
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
    // Refresh every 30 seconds
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

  if (loading || !currentClient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" /> 
        {loading ? 'Connecting to database...' : 'No client data found'}
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

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!newRequestTitle.trim() || !currentClient) return;

    try {
      await createRequest({
        id: Date.now(),
        clientId: currentClient.id,
        clientName: currentClient.companyName,
        title: newRequestTitle,
        type: 'Custom Integration',
        tools: JSON.stringify(['Custom App API', 'Workflow Engine']),
        status: 'Pending',
        hoursSaved: 0,
        runs: 0,
        submitted: 'Just now'
      });

      setNewRequestTitle('');
      setNewRequestDesc('');
      setRequestSuccess(true);
      setTimeout(() => setRequestSuccess(false), 4000);
      
      await loadData();
    } catch (err) {
      console.error('Failed to submit request:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-indigo-500 text-white p-1.5 rounded-lg">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">AutomateOS</span>
              </Link>
              <span className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-600 px-2.5 py-0.5 rounded-md font-bold">
                CLIENT PORTAL
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Client session switcher */}
              <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 p-1 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 pl-2 uppercase tracking-wider hidden lg:inline">Account:</span>
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
                      {c.companyName} ({c.plan === 'starter' ? 'Starter' : c.plan === 'growth' ? 'Growth' : 'Dedicated'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Admin Console Link */}
              <Link
                to="/admin/login"
                className="px-3.5 py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-100 font-extrabold rounded-xl text-xs transition inline-flex items-center space-x-1.5 shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400 stroke-[2.5]" />
                <span className="hidden sm:inline">Admin</span>
              </Link>

              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-extrabold text-sm border border-indigo-200 shadow-inner">
                {currentClient.contactName ? currentClient.contactName.split(' ').map(n => n[0]).join('') : '?'}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Banner for Newly Onboarded Users */}
        {!welcomeDismissed && (
          <div className="bg-gradient-to-r from-indigo-500 to-teal-500 rounded-2xl p-6 sm:p-8 text-white shadow-md relative mb-8 overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white mb-3">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Registration & Payment Complete
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome to AutomateOS!</h1>
              <p className="text-white/80 text-sm sm:text-base mt-2 leading-relaxed">
                Your subscription is active. We've set up your shared Slack channel and assigned a dedicated automation engineer to your account.
              </p>
              <div className="mt-6 flex space-x-4">
                <button 
                  onClick={() => setWelcomeDismissed(true)} 
                  className="px-5 py-2 bg-white text-indigo-500 font-bold rounded-lg text-xs hover:bg-slate-50 transition"
                >
                  Go to Dashboard
                </button>
                <a href="https://slack.com" target="_blank" rel="noreferrer" className="px-5 py-2 bg-indigo-600/40 hover:bg-indigo-600/60 text-white border border-white/20 font-bold rounded-lg text-xs transition inline-flex items-center">
                  Open Support Slack
                </a>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 hidden md:block pointer-events-none">
              <Zap className="w-full h-full text-white" />
            </div>
          </div>
        )}

        {/* Value Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Time Saved</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{totalHoursSaved} Hrs</h3>
              </div>
              <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-500">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Based on live workflow runs
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Value Created</p>
                <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">${dollarsSaved.toLocaleString()}</h3>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-500">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-slate-400">
              <span className="text-emerald-500 font-bold mr-1">$45/hr</span> equivalent manual labor cost
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Workflow Runs (MTD)</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{totalRuns.toLocaleString()}</h3>
              </div>
              <div className="bg-sky-50 p-2.5 rounded-xl text-sky-500">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> Systems live & operational
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Subscription</p>
                <h3 className="text-xl font-extrabold text-slate-900 mt-3">{currentConfig.name}</h3>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-500 px-2.5 py-1 rounded-lg text-xs font-bold">
                {currentConfig.price}
              </div>
            </div>
            <div className="mt-5 flex justify-between items-center text-xs font-semibold pt-1 border-t border-slate-100">
              <span className="text-slate-500">Next billing: July 20, 2026</span>
              <span className="text-indigo-500 font-semibold">{currentConfig.limit} Workflow Limit</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Column: Active Workflows */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200/60 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Active Automated Workflows</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Integrations built and managed by AutomateOS.</p>
                </div>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                  {automations.length} Running
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {automations.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-sm font-bold">
                    No active automation workflows yet. Submit requests below!
                  </div>
                ) : (
                  automations.map((automation) => (
                    <div key={automation.id} className="p-6 hover:bg-slate-50/60 transition">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                          <div className="flex items-center space-x-2.5">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{automation.title}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              automation.status === 'Active' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {automation.status}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs mt-1 font-semibold">{automation.type || 'Custom Integration'}</p>
                          
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {automation.tools && automation.tools.map((tool, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-2">
                          {automation.status === 'Active' && (
                            <div className="text-right">
                              <span className="text-xs font-bold text-slate-400 block sm:inline">Saved</span>
                              <span className="text-sm font-extrabold text-indigo-500 sm:block sm:mt-0.5"> {automation.hoursSaved} hrs/mo</span>
                            </div>
                          )}
                          <span className="text-[10px] text-slate-400 font-semibold sm:mt-1">
                            Updated {automation.updated || 'Yesterday'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Slack Integration Box */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="p-3 bg-white text-indigo-500 rounded-xl shadow-sm">
                  <SlackIcon className="w-6 h-6 text-[#4A154B]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-sm">Need immediate operational changes?</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Ping your engineer directly inside your Slack support channel.</p>
                </div>
              </div>
              <a href="https://slack.com" target="_blank" rel="noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-[#4A154B] hover:bg-[#3B113C] text-white font-bold rounded-xl text-xs shadow-sm transition">
                Go to Slack Channel
              </a>
            </div>
          </div>

          {/* Right Column: Submit Request & Status */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-950 mb-4">Submit New Request</h2>
              
              {requestSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                  Request successfully queued! Expect feedback in under 24 hours.
                </div>
              )}

              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5" htmlFor="requestTitle">Automation Goal</label>
                  <input 
                    type="text" 
                    id="requestTitle"
                    placeholder="e.g., Sync Typeform to Salesforce CRM"
                    value={newRequestTitle}
                    onChange={(e) => setNewRequestTitle(e.target.value)}
                    className="w-full px-4.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5" htmlFor="requestDesc">Request Description & Details</label>
                  <textarea 
                    id="requestDesc"
                    rows="3"
                    placeholder="Provide details about fields, triggers, or specific tools..."
                    value={newRequestDesc}
                    onChange={(e) => setNewRequestDesc(e.target.value)}
                    className="w-full px-4.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-xs resize-none font-semibold"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-indigo-500 hover:bg-indigo-600 shadow transition"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Queue Automation Request
                </button>
              </form>
            </div>

            {/* Request Queue Status */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-950 mb-3">Request Queue</h2>
              <p className="text-slate-400 text-xs mb-4 font-semibold">Track requests currently in review or development.</p>

              <div className="space-y-3">
                {clientPending.length === 0 ? (
                  <div className="text-xs text-slate-400 font-bold p-4 text-center border-2 border-dashed border-slate-100 rounded-xl">
                    No pending requests in queue.
                  </div>
                ) : (
                  clientPending.map((req) => (
                    <div key={req.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex justify-between items-center">
                      <div className="truncate pr-3">
                        <h4 className="font-bold text-slate-800 text-xs truncate">{req.title}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">Submitted {req.submitted}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === 'Reviewing' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm">
              <span className="text-teal-500 text-[10px] font-bold tracking-widest uppercase">Support Hotline</span>
              <h3 className="text-lg font-extrabold mt-1">Need Strategy Help?</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                As an AutomateOS subscriber, you have access to a personalized strategy review to audit your tech stack and find additional efficiency leakages.
              </p>
              <button className="w-full mt-4 inline-flex items-center justify-center py-2.5 px-4 rounded-xl font-bold text-xs text-slate-900 bg-teal-500 hover:bg-teal-400 transition">
                Book Next Strategy Review
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-slate-400 bg-white border-t border-slate-200">
        &copy; {new Date().getFullYear()} AutomateOS Portal. Data persisted via Turso. Confidential & Secure.
      </footer>
    </div>
  );
}