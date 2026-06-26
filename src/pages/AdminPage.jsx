import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap, Users, Activity, Clock, DollarSign, CheckCircle, AlertCircle,
  ArrowLeft, Sliders, Sparkles, RefreshCw, Layers, Check, ChevronRight,
  TrendingUp, X, Plus, LogOut
} from 'lucide-react';
import { fetchClients, fetchRequests, updateClient, updateRequest, fetchAdminStats } from '../api';

const AUTH_KEY = 'automateos_admin_token';

export default function AdminPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  const [clients, setClients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('clients');
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Client editor state
  const [editPlan, setEditPlan] = useState('starter');
  const [editStatus, setEditStatus] = useState('Active');
  const [editHoursSaved, setEditHoursSaved] = useState(0);
  const [editExecutions, setEditExecutions] = useState(0);
  const [editValueCreated, setEditValueCreated] = useState(0);

  // Check auth on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_KEY);
    if (!stored) {
      navigate('/admin/login', { replace: true });
      return;
    }
    setToken(stored);
    setAuthenticated(true);
    setChecking(false);
  }, [navigate]);

  // Load all data when authenticated
  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [clientsData, requestsData, statsData] = await Promise.all([
        fetchClients(),
        fetchRequests(),
        fetchAdminStats(token)
      ]);
      setClients(clientsData);
      setRequests(requestsData);
      setStats(statsData);

      // Keep selected client in sync
      if (selectedClient) {
        const updated = clientsData.find(c => c.id === selectedClient.id);
        if (updated) setSelectedClient(updated);
      }
    } catch (err) {
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        sessionStorage.removeItem(AUTH_KEY);
        navigate('/admin/login', { replace: true });
      }
      showMessage('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated && token) {
      loadData();
    }
  }, [authenticated, token]);

  // Update editor values when selected client changes
  useEffect(() => {
    if (selectedClient) {
      setEditPlan(selectedClient.plan);
      setEditStatus(selectedClient.status || 'Active');
      setEditHoursSaved(selectedClient.metrics?.hoursSaved || selectedClient.hoursSaved || 0);
      setEditExecutions(selectedClient.metrics?.executionsMTD || selectedClient.executionsMTD || 0);
      setEditValueCreated(selectedClient.metrics?.valueCreated || selectedClient.valueCreated || 0);
    }
  }, [selectedClient]);

  const showMessage = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    navigate('/admin/login', { replace: true });
  };

  const handleUpdateClientMetrics = async (e) => {
    e.preventDefault();
    if (!selectedClient || !token) return;

    try {
      const result = await updateClient(selectedClient.id, {
        plan: editPlan,
        status: editStatus,
        metrics: {
          hoursSaved: Number(editHoursSaved),
          executionsMTD: Number(editExecutions),
          valueCreated: Number(editValueCreated)
        }
      }, token);
      
      showMessage('success', `Successfully updated ${selectedClient.companyName} configuration!`);
      await loadData();
    } catch (err) {
      showMessage('error', err.message);
    }
  };

  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    if (!token) return;
    
    const defaultHours = newStatus === 'Active' ? 12 : 0;
    const defaultRuns = newStatus === 'Active' ? 150 : 0;

    try {
      await updateRequest(requestId, {
        status: newStatus,
        hoursSaved: newStatus === 'Active' ? defaultHours : undefined,
        runs: newStatus === 'Active' ? defaultRuns : undefined
      }, token);
      
      showMessage('success', `Request status updated to "${newStatus}"!`);
      await loadData();
    } catch (err) {
      showMessage('error', err.message);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-400 font-bold">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" /> Checking authorization...
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  const totalAutomations = automations => automations.filter(r => r.status === 'Active').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-tr from-indigo-500 to-teal-500 text-white p-1.5 rounded-lg">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">AutomateOSHQ</span>
            </Link>
            <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              Admin Ops Console
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Link 
              to="/dashboard" 
              className="px-4 py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 font-bold rounded-xl text-xs transition inline-flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portal</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 border border-red-900/50 hover:border-red-700 text-red-400 font-bold rounded-xl text-xs transition inline-flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top bar & Notification */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Sliders className="text-indigo-500 w-7 h-7" /> Operations Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage client subscriptions, active workflows, and real-time value metrics.</p>
          </div>
          
          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs font-bold shadow-md flex items-center ${
              statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4 mr-1.5" /> : <AlertCircle className="w-4 h-4 mr-1.5" />}
              {statusMessage.text}
            </div>
          )}
        </div>

        {/* Global Business KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* KPI 1: Monthly Recurring Revenue */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Estimated MRR</p>
            <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mt-2">
              ${(stats?.totalMRR || 0).toLocaleString()}
            </h3>
            <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-1">
              <TrendingUp className="text-emerald-500 w-3.5 h-3.5" /> Active accounts only
            </div>
            <div className="absolute right-3 bottom-3 text-slate-800">
              <DollarSign className="w-12 h-12 stroke-[1.5]" />
            </div>
          </div>

          {/* KPI 2: Total Clients */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Clients</p>
            <h3 className="text-3xl font-black text-white mt-2">
              {stats?.totalClients || 0} Clients
            </h3>
            <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-1">
              <Users className="text-indigo-400 w-3.5 h-3.5" /> Turso Persisted
            </div>
            <div className="absolute right-3 bottom-3 text-slate-800">
              <Users className="w-12 h-12 stroke-[1.5]" />
            </div>
          </div>

          {/* KPI 3: Live Automations */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Automations</p>
            <h3 className="text-3xl font-black text-white mt-2">
              {stats?.totalActiveAutomations || 0} Live
            </h3>
            <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-1">
              <Activity className="text-teal-400 w-3.5 h-3.5" /> Serving live webhooks
            </div>
            <div className="absolute right-3 bottom-3 text-slate-800">
              <Activity className="w-12 h-12 stroke-[1.5]" />
            </div>
          </div>

          {/* KPI 4: Cumulative Hours Saved */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Time Saved</p>
            <h3 className="text-3xl font-black text-white mt-2">
              {stats?.totalHoursSavedAcrossAll || 0} Hours
            </h3>
            <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-1">
              <Clock className="text-sky-400 w-3.5 h-3.5" /> Equiv. ${(stats?.dollarValue || 0).toLocaleString()} Saved
            </div>
            <div className="absolute right-3 bottom-3 text-slate-800">
              <Clock className="w-12 h-12 stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'clients' ? 'border-indigo-500 text-white bg-slate-800/20' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Client Directory & Metrics Updater
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition flex items-center gap-2 relative ${
              activeTab === 'requests' ? 'border-indigo-500 text-white bg-slate-800/20' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" /> Operations Queue
            {requests.filter(r => r.status === 'Pending' || r.status === 'Reviewing').length > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            )}
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center py-8 text-slate-500">
            <RefreshCw className="w-5 h-5 animate-spin mr-2 text-indigo-500" />
            <span className="text-sm font-bold">Loading data from database...</span>
          </div>
        )}

        {/* Dynamic Admin Body */}
        {!loading && activeTab === 'clients' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Client Directory List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800/60 flex justify-between items-center bg-slate-950/40">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="text-indigo-400 w-5 h-5" /> Registered Clients
                  </h2>
                  <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
                    {clients.length} Total
                  </span>
                </div>

                <div className="divide-y divide-slate-800/50">
                  {clients.map((client) => (
                    <div 
                      key={client.id} 
                      onClick={() => setSelectedClient(client)}
                      className={`p-6 transition cursor-pointer flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ${
                        selectedClient?.id === client.id ? 'bg-indigo-500/5 border-l-4 border-indigo-500' : 'hover:bg-slate-900/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-white text-base">{client.companyName}</h3>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            client.plan === 'dedicated' 
                              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' 
                              : client.plan === 'growth' 
                              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {client.plan === 'starter' ? 'Starter' : client.plan === 'growth' ? 'Growth' : 'Dedicated'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            client.status === 'Active' || client.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {client.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1 font-semibold">{client.contactName} ({client.email})</p>
                        
                        <div className="flex gap-4 mt-4 flex-wrap">
                          <div className="text-xs">
                            <span className="text-slate-500">Hours Saved:</span> <strong className="text-indigo-400 font-extrabold">{client.hoursSaved || 0} hrs</strong>
                          </div>
                          <div className="text-xs">
                            <span className="text-slate-500">Executions MTD:</span> <strong className="text-white font-extrabold">{client.executionsMTD || 0}</strong>
                          </div>
                          <div className="text-xs">
                            <span className="text-slate-500">Value Created:</span> <strong className="text-emerald-400 font-extrabold">${(client.valueCreated || 0).toLocaleString()}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 font-bold text-xs flex-shrink-0">
                        <span>Click to Update</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Client Configurator Panel */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sliders className="text-indigo-400 w-5 h-5" /> Client Configurator
              </h2>

              {selectedClient ? (
                <form onSubmit={handleUpdateClientMetrics} className="space-y-5">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-widest block font-bold">Selected Account</span>
                    <h3 className="text-xl font-black text-white mt-1">{selectedClient.companyName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Contact: {selectedClient.contactName}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Subscription Plan</label>
                    <select 
                      value={editPlan}
                      onChange={(e) => setEditPlan(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl outline-none text-xs text-white"
                    >
                      <option value="starter">Starter Flow ($999/mo)</option>
                      <option value="growth">Growth Engine ($2,499/mo)</option>
                      <option value="dedicated">Dedicated Retainer ($4,999/mo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Account Status</label>
                    <select 
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl outline-none text-xs text-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                      <option value="Reviewing">Reviewing</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-1 border-t border-slate-900">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Hours Saved (Hrs)</label>
                      <input 
                        type="number"
                        value={editHoursSaved}
                        onChange={(e) => setEditHoursSaved(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl outline-none text-xs text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Executions MTD</label>
                      <input 
                        type="number"
                        value={editExecutions}
                        onChange={(e) => setEditExecutions(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl outline-none text-xs text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Cumulative Value Created ($)</label>
                      <input 
                        type="number"
                        value={editValueCreated}
                        onChange={(e) => setEditValueCreated(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl outline-none text-xs text-white font-bold"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-indigo-500 hover:bg-indigo-600 shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Save Configuration
                  </button>
                </form>
              ) : (
                <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-800/40 rounded-xl">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-slate-700" />
                  <p className="text-xs font-bold">Select a client from the directory to update real-time metrics & status.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Operations / Requests Queue Tab */}
        {!loading && activeTab === 'requests' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800/60 flex justify-between items-center bg-slate-950/40">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="text-indigo-400 w-5 h-5" /> Operations Requests Queue
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">Process pending custom integrations, approve requests, and activate workflows.</p>
              </div>
              <span className="text-xs font-bold bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
                {requests.filter(r => r.status !== 'Active').length} Pending / Reviewing
              </span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {requests.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <p className="font-bold text-sm">No client-submitted requests found.</p>
                </div>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="p-6 hover:bg-slate-900/30 transition flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500">ID #{req.id}</span>
                        <strong className="text-indigo-400 font-extrabold text-xs uppercase px-2 py-0.5 bg-indigo-500/10 rounded-md border border-indigo-500/20">
                          {req.clientName}
                        </strong>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          req.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : req.status === 'Reviewing' 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <h3 className="text-white font-extrabold text-sm sm:text-base leading-snug">{req.title}</h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {req.tools && req.tools.map((t, idx) => (
                          <span key={idx} className="bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded text-[9px] font-bold">
                            {t}
                          </span>
                        ))}
                      </div>
                      <p className="text-slate-500 text-[10px] font-semibold">Submitted: {req.submitted} | Updated: {req.updated || 'Never'}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:self-center">
                      {req.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateRequestStatus(req.id, 'Reviewing')}
                            className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-lg transition"
                          >
                            Mark Reviewing
                          </button>
                          <button
                            onClick={() => handleUpdateRequestStatus(req.id, 'Active')}
                            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold rounded-lg transition flex items-center gap-1 shadow-md shadow-emerald-500/10"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Activate Now
                          </button>
                        </>
                      )}
                      {req.status === 'Reviewing' && (
                        <button
                          onClick={() => handleUpdateRequestStatus(req.id, 'Active')}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold rounded-lg transition flex items-center gap-1 shadow-md shadow-emerald-500/10"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Activate Now
                        </button>
                      )}
                      {req.status === 'Active' && (
                        <button
                          onClick={() => handleUpdateRequestStatus(req.id, 'Reviewing')}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-bold rounded-lg transition"
                        >
                          Deactivate / Review
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <footer className="py-6 text-center text-xs text-slate-500 bg-slate-950 border-t border-slate-900 mt-auto">
        &copy; {new Date().getFullYear()} AutomateOSHQ Admin Engine. Data persisted via Turso. All rights reserved.
      </footer>
    </div>
  );
}