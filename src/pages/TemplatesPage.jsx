import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Download, Zap, RefreshCw } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { createProductCheckoutSession } from '../api';

const TemplatesPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGrabPack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const utm_source = searchParams.get('utm_source') || '';
      const utm_medium = searchParams.get('utm_medium') || '';
      const utm_campaign = searchParams.get('utm_campaign') || '';

      const result = await createProductCheckoutSession('template-pack', '', {
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
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Zap className="text-white w-5 h-5" fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">AutomateOSHQ</span>
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-16 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-semibold mb-8">
              <Download className="w-4 h-4 mr-2" /> Instant Digital Delivery
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              The <span className="text-indigo-500">Lead Gen Essentials</span> Template Pack
            </h1>
            
            <p className="text-xl text-slate-600 mb-8">
              Stop losing leads to slow response times. Get the exact Zapier & Make workflows we use to qualify, enrich, and notify leads in under 60 seconds.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "Speed-to-Lead Intake Engine (Zapier/Make)",
                "AI Qualification & Enrichment Logic",
                "Personalized Follow-up Sequence Blueprint",
                "Slack War Room Notification Pipeline",
                "Implementation Quick-Start Guide"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] text-white shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <span className="text-slate-400 font-medium">Single Payment</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</span>
              </div>
              
              <div className="mb-8">
                <span className="text-5xl font-bold">$149</span>
                <span className="text-slate-400 ml-2">one-time</span>
              </div>

              {error && <p className="text-red-400 text-sm mb-4 font-bold">{error}</p>}

              <button 
                onClick={handleGrabPack}
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all mb-6 disabled:opacity-50"
              >
                {loading ? (
                  <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Preparing Checkout...</>
                ) : (
                  <>Grab the Pack Now <ArrowRight className="w-5 h-5 ml-2" /></>
                )}
              </button>

              <p className="text-sm text-slate-400 text-center">
                Includes full instructions and access to our private blueprint library.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TemplatesPage;
