import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Users, 
  Activity, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Sliders, 
  Sparkles, 
  RefreshCw, 
  Layers,
  Check,
  ChevronRight,
  TrendingUp,
  X,
  Plus
} from 'lucide-react';

const initializeState = () => {
  if (!localStorage.getItem('automateos_clients')) {
    const defaultClients = [
      {
        id: 'acme',
        companyName: 'Acme Agency',
        contactName: 'Sarah Jenkins',
        email: 'sarah@acmeagency.com',
        phone: '+1 (555) 321-9876',
        plan: 'starter',
        status: 'Active',
        metrics: {
          hoursSaved: 36,
          executionsMTD: 450,
          valueCreated: 1620
        }
      },
      {
        id: 'velocity',
        companyName: 'Velocity Agency',
        contactName: 'Marcus Thorne',
        email: 'marcus@velocity.io',
        phone: '+1 (555) 765-4321',
        plan: 'growth',
        status: 'Active',
        metrics: {
          hoursSaved: 96,
          executionsMTD: 5800,
          valueCreated: 4320
        }
      },
      {
        id: 'apex',
        companyName: 'Apex Retail',
        contactName: 'Elena Rostova',
        email: 'elena@apexretail.com',
        phone: '+1 (555) 987-6543',
        plan: 'dedicated',
        status: 'Active',
        metrics: {
          hoursSaved: 170,
          executionsMTD: 11800,
          valueCreated: 7650
        }
      }
    ];
    localStorage.setItem('automateos_clients', JSON.stringify(defaultClients));
  }

  if (!localStorage.getItem('automateos_requests')) {
    const defaultRequests = [
      {
        id: 101,
        clientId: 'acme',
        clientName: 'Acme Agency',
        title: 'Airtable to Slack Live Lead Sync',
        type: 'CRM & Lead Management',
        tools: ['Airtable', 'Slack', 'Zapier'],
        status: 'Active',
        hoursSaved: 24,
        runs: 310,
        updated: '1 hour ago',
        submitted: '4 days ago'
      },
      {
        id: 102,
        clientId: 'acme',
        clientName: 'Acme Agency',
        title: 'Gmail Attachment Auto-Saver to Drive',
        type: 'File Management',
        tools: ['Gmail', 'Google Drive', 'Make.com'],
        status: 'Active',
        hoursSaved: 12,
        runs: 140,
        updated: 'Yesterday',
        submitted: '3 days ago'
      },
      {
        id: 103,
        clientId: 'acme',
        clientName: 'Acme Agency',
        title: 'Airtable sync to Webflow multi-reference fields',
        type: 'Reporting & Data Sync',
        tools: ['Airtable', 'Webflow'],
        status: 'Reviewing',
        hoursSaved: 0,
        runs: 0,
        updated: 'Today',
        submitted: 'Today'
      },
      {
        id: 201,
        clientId: 'velocity',
        clientName: 'Velocity Agency',
        title: 'AI Invoice Extractor & QuickBooks Sync',
        type: 'AI & Document Processing',
        tools: ['Gmail', 'GPT-4', 'QuickBooks', 'Airtable'],
        status: 'Active',
        hoursSaved: 48,
        runs: 1240,
        updated: '2 hours ago',
        submitted: '6 days ago'
      },
      {
        id: 202,
        clientId: 'velocity',
        clientName: 'Velocity Agency',
        title: 'HubSpot to Slack Live Lead Qualifier',
        type: 'Lead Nurturing',
        tools: ['HubSpot', 'Zapier', 'Slack'],
        status: 'Active',
        hoursSaved: 36,
        runs: 4820,
        updated: 'Yesterday',
        submitted: '5 days ago'
      },
      {
        id: 203,
        clientId: 'velocity',
        clientName: 'Velocity Agency',
        title: 'Customer Support Auto-Reply Draft Bot',
        type: 'AI Agent / Automation',
        tools: ['Gmail', 'Claude 3.5', 'Notion'],
        status: 'Pending',
        hoursSaved: 0,
        runs: 0,
        updated: '1 day ago',
        submitted: '1 day ago'
      },
      {
        id: 204,
        clientId: 'velocity',
        clientName: 'Velocity Agency',
        title: 'Monthly PDF Analytics Compiler',
        type: 'Reporting & Data Sync',
        tools: ['Google Drive', 'Make.com', 'Slack'],
        status: 'Active',
        hoursSaved: 12,
        runs: 82,
        updated: '3 days ago',
        submitted: '3 days ago'
      },
      {
        id: 205,
        clientId: 'velocity',
        clientName: 'Velocity Agency',
        title: 'Auto-reply to Instagram DMs via OpenAI integration',
        type: 'AI Agent / Automation',
        tools: ['Instagram', 'OpenAI'],
        status: 'Reviewing',
        hoursSaved: 0,
        runs: 0,
        updated: '3 days ago',
        submitted: '3 days ago'
      },
      {
        id: 301,
        clientId: 'apex',
        clientName: 'Apex Retail',
        title: 'AI Invoice Extractor & QuickBooks Sync',
        type: 'AI & Document Processing',
        tools: ['Gmail', 'GPT-4', 'QuickBooks', 'Airtable'],
        status: 'Active',
        hoursSaved: 48,
        runs: 1240,
        updated: '2 hours ago',
        submitted: '8 days ago'
      },
      {
        id: 302,
        clientId: 'apex',
        clientName: 'Apex Retail',
        title: 'HubSpot to Slack Live Lead Qualifier',
        type: 'Lead Nurturing',
        tools: ['HubSpot', 'Zapier', 'Slack'],
        status: 'Active',
        hoursSaved: 36,
        runs: 4820,
        updated: 'Yesterday',
        submitted: '7 days ago'
      },
      {
        id: 303,
        clientId: 'apex',
        clientName: 'Apex Retail',
        title: 'Customer Support Auto-Reply Draft Bot',
        type: 'AI Agent / Automation',
        tools: ['Gmail', 'Claude 3.5', 'Notion'],
        status: 'Active',
        hoursSaved: 40,
        runs: 2310,
        updated: 'Yesterday',
        submitted: '6 days ago'
      },
      {
        id: 304,
        clientId: 'apex',
        clientName: 'Apex Retail',
        title: 'Monthly PDF Analytics Compiler',
        type: 'Reporting & Data Sync',
        tools: ['Google Drive', 'Make.com', 'Slack'],
        status: 'Active',
        hoursSaved: 24,
        runs: 110,
        updated: '3 days ago',
        submitted: '5 days ago'
      },
      {
        id: 305,
        clientId: 'apex',
        clientName: 'Apex Retail',
        title: 'Custom API Multi-Channel Inventory Sync',
        type: 'Custom API Sync',
        tools: ['Node.js', 'Stripe', 'Salesforce', 'Shopify'],
        status: 'Active',
        hoursSaved: 60,
        runs: 8140,
        updated: '4 days ago',
        submitted: '4 days ago'
      },
      {
        id: 306,
        clientId: 'apex',
        clientName: 'Apex Retail',
        title: 'Automatic High-Priority Support Escalations',
        type: 'Workflow Routing',
        tools: ['Intercom', 'PagerDuty', 'Slack'],
        status: 'Reviewing',
        hoursSaved: 0,
        runs: 0,
        updated: 'Just now',
        submitted: 'Just now'
      }
    ];
    localStorage.setItem('automateos_requests', JSON.stringify(defaultRequests));
  }
};

export default function AdminPage() {
  const [clients, setClients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' | 'requests'
  const [statusMessage, setStatusMessage] = useState(null);

  // Client editor state
  const [editPlan, setEditPlan] = useState('starter');
  const [editStatus, setEditStatus] = useState('Active');
  const [editHoursSaved, setEditHoursSaved] = useState(0);
  const [editExecutions, setEditExecutions] = useState(0);
  const [editValueCreated, setEditValueCreated] = useState(0);

  // Load and refresh state
  const loadState = () => {
    initializeState();
    const storedClients = JSON.parse(localStorage.getItem('automateos_clients') || '[]');
    const storedRequests = JSON.parse(localStorage.getItem('automateos_requests') || '[]');
    setClients(storedClients);
    setRequests(storedRequests);
  };

  useEffect(() => {
    loadState();

    // Support real-time sync with other open client dashboard tabs!
    const handleStorageChange = (e) => {
      if (e.key === 'automateos_clients' || e.key === 'automateos_requests') {
        loadState();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update editor values when selected client changes
  useEffect(() => {
    if (selectedClient) {
      setEditPlan(selectedClient.plan);
      setEditStatus(selectedClient.status || 'Active');
      setEditHoursSaved(selectedClient.metrics?.hoursSaved || 0);
      setEditExecutions(selectedClient.metrics?.executionsMTD || 0);
      setEditValueCreated(selectedClient.metrics?.valueCreated || 0);
    }
  }, [selectedClient]);

  const handleUpdateClientMetrics = (e) => {
    e.preventDefault();
    if (!selectedClient) return;

    const updatedClients = clients.map(c => {
      if (c.id === selectedClient.id) {
        return {
          ...c,
          plan: editPlan,
          status: editStatus,
          metrics: {
            hoursSaved: Number(editHoursSaved),
            executionsMTD: Number(editExecutions),
            valueCreated: Number(editValueCreated)
          }
        };
      }
      return c;
    });

    localStorage.setItem('automateos_clients', JSON.stringify(updatedClients));
    setClients(updatedClients);
    
    // Clear selection or show feedback
    const newlyUpdated = updatedClients.find(c => c.id === selectedClient.id);
    setSelectedClient(newlyUpdated);

    setStatusMessage({
      type: 'success',
      text: `Successfully updated ${selectedClient.companyName} configuration!`
    });

    // Notify other components via storage event dispatch (local)
    window.dispatchEvent(new Event('storage'));

    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleUpdateRequestStatus = (requestId, newStatus) => {
    let assignedHours = 0;
    let assignedRuns = 0;

    // Default stats to give when transitioning a request to Active
    if (newStatus === 'Active') {
      assignedHours = 12;
      assignedRuns = 150;
    }

    const updatedRequests = requests.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: newStatus,
          hoursSaved: newStatus === 'Active' ? assignedHours : r.hoursSaved,
          runs: newStatus === 'Active' ? assignedRuns : r.runs,
          updated: 'Just now'
        };
      }
      return r;
    });

    localStorage.setItem('automateos_requests', JSON.stringify(updatedRequests));
    setRequests(updatedRequests);

    // If activated, let's also automatically increment the client's metrics!
    if (newStatus === 'Active') {
      const targetRequest = requests.find(r => r.id === requestId);
      if (targetRequest) {
        const updatedClients = clients.map(c => {
          if (c.id === targetRequest.clientId) {
            const currentHours = c.metrics?.hoursSaved || 0;
            const currentRuns = c.metrics?.executionsMTD || 0;
            const currentValue = c.metrics?.valueCreated || 0;
            
            const addedHours = assignedHours;
            const addedRuns = assignedRuns;
            const addedValue = addedHours * 45; // $45/hr

            return {
              ...c,
              metrics: {
                hoursSaved: currentHours + addedHours,
                executionsMTD: currentRuns + addedRuns,
                valueCreated: currentValue + addedValue
              }
            };
          }
          return c;
        });
        localStorage.setItem('automateos_clients', JSON.stringify(updatedClients));
        setClients(updatedClients);
        
        // If the selected client is this one, update the edit view in real time
        if (selectedClient && selectedClient.id === targetRequest.clientId) {
          const matchingClient = updatedClients.find(c => c.id === targetRequest.clientId);
          setSelectedClient(matchingClient);
        }
      }
    }

    setStatusMessage({
      type: 'success',
      text: `Request status updated to "${newStatus}"!`
    });

    // Dispatch event to sync other tabs
    window.dispatchEvent(new Event('storage'));

    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Calculations for Admin Stats Cards
  const totalClients = clients.length;
  const totalActiveAutomations = requests.filter(r => r.status === 'Active').length;
  
  const totalHoursSavedAcrossAll = clients.reduce((acc, c) => acc + (c.metrics?.hoursSaved || 0), 0);
  
  const planRates = { starter: 999, growth: 2499, dedicated: 4999 };
  const totalMRR = clients.reduce((acc, c) => {
    if (c.status === 'Active' || c.status === 'active') {
      return acc + (planRates[c.plan] || 0);
    }
    return acc;
  }, 0);

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
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">AutomateOS</span>
            </Link>
            <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              Admin Ops Console
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="px-4 py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 font-bold rounded-xl text-xs transition inline-flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal</span>
            </Link>
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
          
          {/* Status Alert Banner */}
          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs font-bold shadow-md flex items-center animate-pulse ${
              statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              <CheckCircle className="w-4 h-4 mr-1.5" />
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
              ${totalMRR.toLocaleString()}
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
              {totalClients} Clients
            </h3>
            <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-1">
              <Users className="text-indigo-400 w-3.5 h-3.5" /> Shared Sandbox State
            </div>
            <div className="absolute right-3 bottom-3 text-slate-800">
              <Users className="w-12 h-12 stroke-[1.5]" />
            </div>
          </div>

          {/* KPI 3: Live Automations */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Automations</p>
            <h3 className="text-3xl font-black text-white mt-2">
              {totalActiveAutomations} Live
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
              {totalHoursSavedAcrossAll} Hours
            </h3>
            <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-1">
              <Clock className="text-sky-400 w-3.5 h-3.5" /> Equiv. ${ (totalHoursSavedAcrossAll * 45).toLocaleString() } Saved
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

        {/* Dynamic Admin Body */}
        {activeTab === 'clients' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left/Middle: Client Directory List */}
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
                        <div className="flex items-center gap-2">
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
                        
                        {/* Compact Stats */}
                        <div className="flex gap-4 mt-4">
                          <div className="text-xs">
                            <span className="text-slate-500">Hours Saved:</span> <strong className="text-indigo-400 font-extrabold">{client.metrics?.hoursSaved || 0} hrs</strong>
                          </div>
                          <div className="text-xs">
                            <span className="text-slate-500">Executions MTD:</span> <strong className="text-white font-extrabold">{client.metrics?.executionsMTD || 0}</strong>
                          </div>
                          <div className="text-xs">
                            <span className="text-slate-500">Value Created:</span> <strong className="text-emerald-400 font-extrabold">${(client.metrics?.valueCreated || 0).toLocaleString()}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                        <span>Click to Update</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Metrics & Status Updater Panel */}
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

                  {/* Plan Selector */}
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

                  {/* Status Selector */}
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

                  {/* Numeric Metrics */}
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
                  <p className="text-xs font-bold">Select a client from the directory list to update real-time metrics & status.</p>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* Operations / Requests Queue Tab */
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

                    {/* Operational Action Controls */}
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

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 bg-slate-950 border-t border-slate-900 mt-auto">
        &copy; {new Date().getFullYear()} AutomateOS Admin Engine. All rights reserved. Confidential.
      </footer>
    </div>
  );
}