import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Zap, RefreshCw } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { createProductCheckoutSession } from '../api';

const AuditPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBookAudit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const utm_source = searchParams.get('utm_source') || '';
      const utm_medium = searchParams.get('utm_medium') || '';
      const utm_campaign = searchParams.get('utm_campaign') || '';

      // For the audit, we don't have an email form on this page yet, 
      // but the API requires one. We'll use a placeholder or prompt.
      // Ideally, we'd have a small email input here. 
      // For now, let's just use the direct API call and let Stripe handle the email.
      const result = await createProductCheckoutSession('automation-audit', '', {
        utm_source,
        utm_medium,
        utm_campaign
      });

      window.location.href = result.url;
    } catch (err) {
      setError(err.message || 'Failed to initiate checkout');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Zap className="text-white w-5 h-5" fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">AutomateOSHQ</span>
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-16 pb-24 text-center">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-8">
          <Clock className="w-4 h-4 mr-2" /> 60-Minute Deep Dive
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
          Stop Paying the <span className="text-indigo-500">"Manual Work Tax"</span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          Our 60-minute Automation Audit identifies your top 3 bottlenecks and gives you a technical roadmap to eliminate them.
        </p>

        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-slate-200 border border-slate-200 mb-12 text-left">
          <h3 className="text-2xl font-bold mb-6">What you get for $299:</h3>
          <ul className="space-y-4 mb-10">
            {[
              "Complete map of your current operations stack",
              "Identification of your 3 biggest time-sinks",
              "Custom technical roadmap for AI & automation",
              "The exact tools and triggers you need to scale",
              "Full credit toward any subscription tier if you join within 7 days"
            ].map((item, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-indigo-500 mr-3 shrink-0" />
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>

          {error && <p className="text-red-500 text-sm mb-4 font-bold">{error}</p>}

          <button 
            onClick={handleBookAudit}
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Preparing Checkout...</>
            ) : (
              <>Book Your Audit for $299 <ArrowRight className="w-5 h-5 ml-2" /></>
            )}
          </button>
          <p className="mt-4 text-center text-sm text-slate-400">
            Only 3 spots remaining for July.
          </p>
        </div>

        <Link to="/" className="text-indigo-500 hover:text-indigo-600 font-semibold flex items-center justify-center">
          Back to home
        </Link>
      </main>
    </div>
  );
};

export default AuditPage;
