import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Search, Filter, Download, Star, ArrowLeft, RefreshCw,
  CheckCircle, XCircle, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { fetchAdminLeads, updateLeadScore, exportLeadsCsv, checkAdminAuth } from '../api';

const AUTH_KEY = 'automateos_admin_token';

export default function AdminLeadsPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem(AUTH_KEY));
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCampaign, setFilterCampaign] = useState('');
  const [filterAgency, setFilterAgency] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Auth check on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) {
      navigate('/admin/login');
      return;
    }
    setToken(stored);
    checkAdminAuth(stored)
      .then(() => setAuthenticated(true))
      .catch(() => {
        localStorage.removeItem(AUTH_KEY);
        navigate('/admin/login');
      })
      .finally(() => setChecking(false));
  }, [navigate]);

  // Fetch leads
  const loadLeads = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterCampaign) params.campaign = filterCampaign;
      if (filterAgency) params.agency = filterAgency;
      const data = await fetchAdminLeads(token, params);
      setLeads(data);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }, [token, search, filterCampaign, filterAgency]);

  useEffect(() => {
    if (authenticated) loadLeads();
  }, [authenticated, loadLeads]);

  // Update score
  const handleScore = async (id, score) => {
    try {
      await updateLeadScore(id, score, token);
      setLeads(prev => prev.map(l => l.id === id ? { ...l, score } : l));
      setStatusMsg({ type: 'success', text: `Lead #${id} scored ${score}/5` });
      setTimeout(() => setStatusMsg(null), 2000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  // Export CSV
  const handleExport = async () => {
    setExporting(true);
    try {
      await exportLeadsCsv(token);
      setStatusMsg({ type: 'success', text: 'CSV downloaded' });
      setTimeout(() => setStatusMsg(null), 2000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setExporting(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearch('');
    setFilterCampaign('');
    setFilterAgency('');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!authenticated) return null;

  // Get unique campaigns and agencies for filter dropdowns
  const campaigns = [...new Set(leads.map(l => l.utm_campaign).filter(Boolean))];
  const agencies = [...new Set(leads.map(l => l.agencyName).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/admin')}
              className="p-2 hover:bg-slate-100 rounded-lg transition cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div className="bg-indigo-500 text-white p-1.5 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900">Lead Management</span>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{leads.length} leads</span>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={loadLeads}
              className="p-2 hover:bg-slate-100 rounded-lg transition cursor-pointer" title="Refresh">
              <RefreshCw className="w-4 h-4 text-slate-500" />
            </button>
            <button onClick={handleExport} disabled={exporting || leads.length === 0}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg disabled:opacity-50 transition cursor-pointer">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Status message */}
        {statusMsg && (
          <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${
            statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {statusMsg.text}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Filters</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search name, email, agency..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <select value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">All Campaigns</option>
              {campaigns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterAgency} onChange={e => setFilterAgency(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">All Agencies</option>
              {agencies.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <button onClick={clearFilters}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition cursor-pointer">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Agency</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">UTM Source</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Medium</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Campaign</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Created</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Delivered</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-medium text-slate-900">{lead.firstName}</td>
                    <td className="px-4 py-3 text-slate-600">{lead.email}</td>
                    <td className="px-4 py-3 text-slate-600">{lead.agencyName}</td>
                    <td className="px-4 py-3">
                      {lead.utm_source ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-600">
                          {lead.utm_source}
                        </span>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{lead.utm_medium || <span className="text-slate-300">—</span>}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs max-w-[120px] truncate">{lead.utm_campaign || <span className="text-slate-300">—</span>}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {lead.createdAt ? new Date(lead.createdAt + 'Z').toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {lead.delivered ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} onClick={() => handleScore(lead.id, s === lead.score ? 0 : s)}
                            className={`p-0.5 transition cursor-pointer ${
                              s <= (lead.score || 0) ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300'
                            }`}>
                            <Star className="w-4 h-4" fill={s <= (lead.score || 0) ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center">
                      <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No leads found matching your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}