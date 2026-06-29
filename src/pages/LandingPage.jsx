import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import WorkflowDiagram from '../components/WorkflowDiagram';
import { createLead } from '../api';
import { 
  Zap, 
  Cpu, 
  Layers, 
  Activity, 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  ArrowRight, 
  Database, 
  Mail, 
  ArrowUpRight, 
  Check,
  Shield,
  Lock,
  Sparkles,
  RefreshCw,
  Users,
  Download,
  CheckCircle,
  BookOpen
} from 'lucide-react';

const AccountManagerIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="amGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366F1"/>
        <stop offset="100%" stopColor="#14B8A6"/>
      </linearGradient>
    </defs>
    <path d="M24 4L8 12v10c0 12.4 6.8 20 16 22 9.2-2 16-9.6 16-22V12L24 4z" stroke="url(#amGrad)" strokeWidth="2.5" strokeLinejoin="round"/>
    <circle cx="24" cy="22" r="5" stroke="url(#amGrad)" strokeWidth="2"/>
    <path d="M16 34c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="url(#amGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M34 14l-12 12-4-4" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10" cy="30" r="1.5" fill="#6366F1" fillOpacity="0.4"/>
    <circle cx="38" cy="32" r="1.5" fill="#14B8A6" fillOpacity="0.4"/>
    <line x1="10" y1="30" x2="15" y2="30" stroke="#6366F1" strokeWidth="1" strokeOpacity="0.3"/>
  </svg>
);

const AIFineTuningIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="aiGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366F1"/>
        <stop offset="100%" stopColor="#14B8A6"/>
      </linearGradient>
    </defs>
    <path d="M24 6c-8 0-12 4-12 8 0 2 .8 4 2 5.5-1.5 1.5-2.5 3.5-2.5 5.5 0 4 3.5 7 8 7.5" stroke="url(#aiGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 6c8 0 12 4 12 8 0 2-.8 4-2 5.5 1.5 1.5 2.5 3.5 2.5 5.5 0 4-3.5 7-8 7.5" stroke="url(#aiGrad)" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="24" cy="14" r="3" fill="url(#aiGrad)" fillOpacity="0.8"/>
    <circle cx="18" cy="24" r="2.5" fill="#6366F1" fillOpacity="0.6"/>
    <circle cx="30" cy="24" r="2.5" fill="#14B8A6" fillOpacity="0.6"/>
    <circle cx="24" cy="32" r="2" fill="url(#aiGrad)" fillOpacity="0.5"/>
    <line x1="21" y1="16" x2="19" y2="22" stroke="#6366F1" strokeWidth="1.2" strokeOpacity="0.4"/>
    <line x1="27" y1="16" x2="29" y2="22" stroke="#14B8A6" strokeWidth="1.2" strokeOpacity="0.4"/>
    <line x1="20" y1="26" x2="22" y2="30" stroke="#6366F1" strokeWidth="1.2" strokeOpacity="0.4"/>
    <line x1="28" y1="26" x2="26" y2="30" stroke="#14B8A6" strokeWidth="1.2" strokeOpacity="0.4"/>
    <line x1="36" y1="18" x2="36" y2="30" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5"/>
    <line x1="34" y1="22" x2="38" y2="22" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"/>
    <line x1="34" y1="26" x2="38" y2="26" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"/>
    <circle cx="36" cy="22" r="1.5" fill="#14B8A6" fillOpacity="0.6"/>
    <circle cx="36" cy="26" r="1.5" fill="#14B8A6" fillOpacity="0.6"/>
  </svg>
);

const PrivateAIInstanceIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="privGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366F1"/>
        <stop offset="100%" stopColor="#14B8A6"/>
      </linearGradient>
    </defs>
    <rect x="10" y="6" width="20" height="36" rx="3" stroke="url(#privGrad)" strokeWidth="2"/>
    <rect x="14" y="10" width="12" height="4" rx="1.5" stroke="#6366F1" strokeWidth="1.5" strokeOpacity="0.6"/>
    <rect x="14" y="18" width="12" height="4" rx="1.5" stroke="#14B8A6" strokeWidth="1.5" strokeOpacity="0.6"/>
    <rect x="14" y="26" width="12" height="4" rx="1.5" stroke="#6366F1" strokeWidth="1.5" strokeOpacity="0.6"/>
    <circle cx="28" cy="12" r="1.5" fill="#10B981" fillOpacity="0.8"/>
    <circle cx="28" cy="20" r="1.5" fill="#10B981" fillOpacity="0.8"/>
    <rect x="18" y="32" width="4" height="6" rx="1" stroke="#10B981" strokeWidth="1.5"/>
    <path d="M17 32v-3a3 3 0 016 0v3" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="37" cy="24" r="8" stroke="url(#privGrad)" strokeWidth="2" strokeDasharray="4 3" strokeOpacity="0.7"/>
    <circle cx="37" cy="24" r="3.5" fill="url(#privGrad)" fillOpacity="0.4"/>
    <circle cx="37" cy="24" r="1.5" fill="white" fillOpacity="0.6"/>
    <line x1="30" y1="24" x2="35" y2="24" stroke="#14B8A6" strokeWidth="1.2" strokeOpacity="0.35"/>
    <circle cx="33" cy="24" r="1" fill="#14B8A6" fillOpacity="0.4"/>
  </svg>
);

const SlaIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="slaGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366F1"/>
        <stop offset="100%" stopColor="#14B8A6"/>
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="18" stroke="url(#slaGrad)" strokeWidth="2.5"/>
    <line x1="24" y1="24" x2="24" y2="12" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.9"/>
    <line x1="24" y1="24" x2="34" y2="24" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9"/>
    <circle cx="24" cy="24" r="2.5" fill="url(#slaGrad)"/>
    <polygon points="30,10 24,22 28,22 22,34 30,20 26,20 32,10" fill="#FBBF24" fillOpacity="0.7"/>
    <path d="M14 28l4 4 8-8" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10" cy="14" r="1.5" fill="#6366F1" fillOpacity="0.4"/>
    <line x1="11" y1="14" x2="16" y2="14" stroke="#6366F1" strokeWidth="1" strokeOpacity="0.3"/>
    <text x="28" y="42" fontFamily="'JetBrains Mono',monospace" fontSize="7" fill="#64748B" fontWeight="700" fillOpacity="0.5">24h</text>
  </svg>
);

const LogoBar = () => (
  <section className="bg-white py-16 border-y border-slate-100 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10">COMPATIBLE WITH YOUR CRITICAL TECH STACK</p>
      <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
        {/* Zapier */}
        <div className="h-8 w-auto flex items-center">
          <svg viewBox="0 0 120 40" className="h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#94A3B8"><path d="M20 4h8l-8 16h8l-8 16h-8l8-16h-8l8-16z" fillOpacity="0.85"/></g>
            <text x="36" y="26" fontFamily="'Inter',sans-serif" fontSize="14" fontWeight="700" fill="#94A3B8" letterSpacing="-0.3">Zapier</text>
          </svg>
        </div>
        {/* Make */}
        <div className="h-8 w-auto flex items-center">
          <svg viewBox="0 0 120 40" className="h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#94A3B8">
              <rect x="4" y="8" width="6" height="24" rx="1.5" fillOpacity="0.85"/>
              <rect x="14" y="12" width="6" height="20" rx="1.5" fillOpacity="0.7"/>
              <rect x="24" y="18" width="6" height="14" rx="1.5" fillOpacity="0.55"/>
            </g>
            <text x="36" y="26" fontFamily="'Inter',sans-serif" fontSize="14" fontWeight="700" fill="#94A3B8" letterSpacing="-0.3">Make</text>
          </svg>
        </div>
        {/* Slack */}
        <div className="h-8 w-auto flex items-center">
          <svg viewBox="0 0 120 40" className="h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#94A3B8">
              <rect x="4" y="14" width="10" height="10" rx="2" fillOpacity="0.85"/>
              <rect x="14" y="4" width="10" height="10" rx="2" fillOpacity="0.7"/>
              <rect x="24" y="14" width="10" height="10" rx="2" fillOpacity="0.55"/>
              <rect x="14" y="24" width="10" height="10" rx="2" fillOpacity="0.4"/>
            </g>
            <text x="40" y="26" fontFamily="'Inter',sans-serif" fontSize="14" fontWeight="700" fill="#94A3B8" letterSpacing="-0.3">Slack</text>
          </svg>
        </div>
        {/* Salesforce */}
        <div className="h-8 w-auto flex items-center">
          <svg viewBox="0 0 140 40" className="h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#94A3B8">
              <circle cx="14" cy="20" r="10" fillOpacity="0.7"/>
              <circle cx="24" cy="18" r="8" fillOpacity="0.85"/>
              <circle cx="10" cy="22" r="6" fillOpacity="0.55"/>
              <circle cx="20" cy="24" r="5" fillOpacity="0.4"/>
            </g>
            <text x="38" y="26" fontFamily="'Inter',sans-serif" fontSize="13" fontWeight="700" fill="#94A3B8" letterSpacing="-0.3">Salesforce</text>
          </svg>
        </div>
        {/* HubSpot */}
        <div className="h-8 w-auto flex items-center">
          <svg viewBox="0 0 120 40" className="h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#94A3B8">
              <circle cx="10" cy="20" r="8" fillOpacity="0.85"/>
              <path d="M18 20h8" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7"/>
              <circle cx="30" cy="20" r="3" fill="#94A3B8" fillOpacity="0.55"/>
            </g>
            <text x="38" y="26" fontFamily="'Inter',sans-serif" fontSize="13" fontWeight="700" fill="#94A3B8" letterSpacing="-0.3">HubSpot</text>
          </svg>
        </div>
        {/* Notion */}
        <div className="h-8 w-auto flex items-center">
          <svg viewBox="0 0 120 40" className="h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#94A3B8">
              <rect x="4" y="6" width="26" height="28" rx="3" fillOpacity="0.85"/>
              <rect x="10" y="10" width="14" height="2" rx="1" fillOpacity="0.7"/>
              <rect x="10" y="16" width="14" height="2" rx="1" fillOpacity="0.55"/>
              <rect x="10" y="22" width="10" height="2" rx="1" fillOpacity="0.4"/>
            </g>
            <text x="36" y="26" fontFamily="'Inter',sans-serif" fontSize="14" fontWeight="700" fill="#94A3B8" letterSpacing="-0.3">Notion</text>
          </svg>
        </div>
      </div>
    </div>
  </section>
);

const SecureBadge = () => (
  <svg viewBox="0 0 140 36" className="h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="secureGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#10B981"/>
        <stop offset="100%" stopColor="#059669"/>
      </linearGradient>
    </defs>
    <rect x="0" y="4" width="140" height="28" rx="14" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1"/>
    <path d="M16 8l8 4v6c0 4.5-3.2 7.5-8 8.5-4.8-1-8-4-8-8.5v-6l8-4z" fill="none" stroke="url(#secureGrad)" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M13 16l2.5 2.5 5-5" fill="none" stroke="url(#secureGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="32" y="23" fontFamily="'Inter',sans-serif" fontSize="11" fontWeight="800" fill="#059669" letterSpacing="0.3">100% Secure</text>
  </svg>
);

const SlaBadge = () => (
  <svg viewBox="0 0 160 36" className="h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="slaGradBadge" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6366F1"/>
        <stop offset="100%" stopColor="#4F46E5"/>
      </linearGradient>
    </defs>
    <rect x="0" y="4" width="160" height="28" rx="14" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1"/>
    <circle cx="16" cy="18" r="7" fill="none" stroke="url(#slaGradBadge)" strokeWidth="1.8"/>
    <line x1="16" y1="18" x2="16" y2="12" stroke="url(#slaGradBadge)" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="16" y1="18" x2="20" y2="18" stroke="url(#slaGradBadge)" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="16" cy="18" r="1.5" fill="url(#slaGradBadge)"/>
    <polygon points="28,12 24,18 26,18 22,24 28,16 25.5,16" fill="#FBBF24" fillOpacity="0.8"/>
    <text x="36" y="23" fontFamily="'Inter',sans-serif" fontSize="11" fontWeight="800" fill="#4338CA" letterSpacing="0.3">48h SLA Guarantee</text>
  </svg>
);

const EngineerBadge = () => (
  <svg viewBox="0 0 180 36" className="h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="certGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#14B8A6"/>
        <stop offset="100%" stopColor="#0D9488"/>
      </linearGradient>
    </defs>
    <rect x="0" y="4" width="180" height="28" rx="14" fill="#F0FDFA" stroke="#99F6E4" strokeWidth="1"/>
    <path d="M16 8l2.5 5.5 6 .5-4.5 4 1.5 6-5.5-3-5.5 3 1.5-6-4.5-4 6-.5L16 8z" fill="none" stroke="url(#certGrad)" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M13 18l2 2 4-4" fill="none" stroke="url(#certGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="34" y="23" fontFamily="'Inter',sans-serif" fontSize="11" fontWeight="800" fill="#0D9488" letterSpacing="0.3">Certified Engineer</text>
  </svg>
);

const Testimonials = () => (
  <section className="py-24 bg-slate-50 border-t border-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
          Trusted by Forward-Thinking Agencies
        </h2>
        <p className="text-lg text-slate-600">
          See how we help agencies scale their operations without adding headcount.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Testimonial 1 */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-indigo-100 overflow-hidden ring-2 ring-indigo-50">
              <img src="/assets/branding/avatar-client-01.png" alt="Sarah Jenkins" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Sarah Jenkins</p>
              <p className="text-xs text-slate-500">Founder, Bloom Marketing</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed italic">"AutomateOS transformed our lead intake. We went from 24-hour response times to under 5 minutes. It's like having a full-time ops team for a fraction of the cost."</p>
        </div>

        {/* Testimonial 2 */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-teal-100 overflow-hidden ring-2 ring-teal-50">
              <img src="/assets/branding/avatar-client-02.png" alt="Marcus K." className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Marcus K. </p>
              <p className="text-xs text-slate-500">COO, ScaleFlow Ops</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed italic">"The ROI was immediate. We saved 30+ hours of manual data entry in our first month alone. The custom dashboard they built for us is a game-changer."</p>
        </div>

        {/* Testimonial 3 */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 overflow-hidden ring-2 ring-amber-50">
              <img src="/assets/branding/avatar-client-03.png" alt="David Thorne" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-slate-900">David Thorne</p>
              <p className="text-xs text-slate-500">Director, Nexus Creative</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed italic">"Finally, an automation partner that understands the agency model. Their 'Strategic Partner' approach is exactly what we needed to move up-market."</p>
        </div>

        {/* Testimonial 4 */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-indigo-100 overflow-hidden ring-2 ring-indigo-50">
              <img src="/assets/branding/avatar-client-04.png" alt="Elena R." className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Elena R.</p>
              <p className="text-xs text-slate-500">Founder, Elara Growth</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed italic">"The speed of execution is incredible. We had our first three workflows live in under a week. It's rare to find a team this skilled and reliable."</p>
        </div>
      </div>
    </div>
  </section>
);

const PremiumFeatureIcon = ({ feature, className }) => {
  if (feature.includes('Account Manager') || feature.includes('Account Director')) return <AccountManagerIcon className={className} />;
  if (feature.includes('AI Fine-tuning')) return <AIFineTuningIcon className={className} />;
  if (feature.includes('Private AI Instances')) return <PrivateAIInstanceIcon className={className} />;
  if (feature.includes('Same‑Day Response SLA')) return <SlaIcon className={className} />;
  return null;
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [leadForm, setLeadForm] = useState({ firstName: '', email: '', agencyName: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadError, setLeadError] = useState('');

  const handleNavigate = (path, e, eventLabel = null) => {
    if (e) e.preventDefault();
    // Fire conversion event for CTA clicks
    if (eventLabel) {
      if (window.gtag) {
        window.gtag('event', 'select_promotion', {
          event_category: 'engagement',
          event_label: eventLabel
        });
      }
      if (window.fbq) {
        window.fbq('track', 'InitiateCheckout', { content_name: eventLabel });
      }
    }
    navigate(path);
  };
  const plans = [
    {
      id: 'solo',
      name: 'Solo Spark',
      price: '$499',
      period: 'month',
      tagline: 'Simple. Reliable. Done.',
      description: 'The automated partner for solopreneurs. One high-impact workflow to handle your most repetitive task.',
      features: [
        '1 custom-built workflow',
        'Unlimited revisions',
        'Slack‑native support (72-hour SLA)',
        'Standard integrations included',
        'Monthly performance report',
        'Built for solopreneurs'
      ],
      perfectFor: 'Consultants and solo founders needing to automate a single bottleneck like lead intake or invoicing.',
      cta: 'Start small →',
      popular: false,
      stripeUrl: 'https://buy.stripe.com/9B66oHf1W3teaSo8785wI05',
    },
    {
      id: 'starter',
      name: 'Starter Flow',
      price: '$999',
      period: 'month',
      tagline: 'Stop copying. Start scaling.',
      description: 'The perfect entry point to eliminate your most painful manual tasks. Two custom workflows.',
      features: [
        '2 custom-built workflows',
        'Unlimited revisions',
        'Slack‑native support (48-hour SLA)',
        'Standard integrations included',
        'Monthly performance report',
        '30‑min onboarding call'
      ],
      perfectFor: 'Agency owners drowning in manual lead transfer. E‑commerce brands tired of copy‑pasting orders.',
      cta: 'Start automating →',
      popular: true,
      stripeUrl: 'https://buy.stripe.com/dRm28r1b6e7S9Ok2MO5wI00',
    },
    {
      id: 'growth',
      name: 'Growth Engine',
      price: '$2,499',
      period: 'month',
      description: 'Five intelligent workflows with AI-powered document extraction and multi‑tool orchestration.',
      tagline: 'Workflows that think.',
      features: [
        '5 custom AI-powered workflows',
        'AI document extraction (PDF/OCR)',
        'Dedicated Account Manager',
        'Custom AI Fine-tuning',
        'Custom database syncs',
        '24‑hour priority support',
        'Bi‑weekly strategy sync',
        'All Starter Flow features'
      ],
      roi: 'One client automated their lead pipeline and recovered 35+ hours/week.',
      cta: 'Scale smarter →',
      popular: false,
      stripeUrl: 'https://buy.stripe.com/fZu8wPaLG3ted0w7345wI01',
    },
    {
      id: 'dedicated',
      name: 'Dedicated Retainer',
      price: '$4,999',
      period: 'month',
      description: 'An entire automation department — strategist, engineer, and AI — dedicated to your business.',
      features: [
        'Unlimited active workflows',
        'Private AI Instances',
        'Same‑Day Response SLA',
        'Dedicated senior engineer',
        'Custom analytics dashboard',
        'Weekly strategy sync (60 min)',
        'Custom API & Legacy integrations',
        'Quarterly business review'
      ],
      cta: 'Hire the department →',
      alternative: 'Hiring a full‑time ops engineer costs $100k+/year. Get the team for half that.',
      popular: false,
      stripeUrl: 'https://buy.stripe.com/5kQ9ATf1W9RCbWs5Z05wI02',
    },
    {
      id: 'enterprise',
      name: 'Enterprise OS',
      price: '$9,999',
      period: 'month',
      description: 'White-glove infrastructure automation for high-volume enterprises and global organizations.',
      features: [
        'Multi-department deployment',
        'Custom private AI instances',
        'SOC2 compliant deployments',
        'On-site workshops available',
        'Dedicated Account Director',
        'Unlimited seats & requests',
        'Custom dev sandbox environments'
      ],
      cta: 'Go Enterprise →',
      popular: false,
      stripeUrl: 'https://buy.stripe.com/3cI8wP5rmgg0aSo4UW5wI06',
    }
  ];

  const trackInitiateCheckout = (planId) => {
    if (window.gtag) {
      window.gtag('event', 'select_promotion', {
        item_list_id: 'pricing_plans',
        item_list_name: 'Pricing Plans',
        items: [{ item_id: planId, item_name: planId }]
      });
    }
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', { content_category: 'subscription', content_ids: [planId] });
    }
    if (window.lintrk) {
      window.lintrk('track', { conversion_id: 654321 });
    }
  };

  const useCases = [
    {
      icon: <Mail className="w-6 h-6 text-indigo-500" />,
      title: "Lead Nurturing & Follow-up",
      description: "Instantly parse inbound leads from webforms, run AI qualification, enrich data with social handles, sync to your CRM, and ping your sales team in Slack in under 60 seconds."
    },
    {
      icon: <Cpu className="w-6 h-6 text-indigo-500" />,
      title: "AI Document & Invoice Processing",
      description: "Stop manual data entry. Upload PDFs of invoices, receipts, or contracts and let AI automatically extract the key values, format them, and write them into your accounting software."
    },
    {
      icon: <Database className="w-6 h-6 text-indigo-500" />,
      title: "Multi-Platform Database Syncing",
      description: "Keep Salesforce, HubSpot, Airtable, and custom SQL databases in lockstep. Eliminate manual CSV imports and ensure your sales and marketing teams always view the identical source of truth."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-indigo-500" />,
      title: "Auto-reply Email & Slack Bots",
      description: "Draft contextual customer replies based on past ticket history. Automatically escalate critical alerts, categorize support emails, and auto-reply to simple customer queries instantly."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Audit & Alignment",
      description: "We deep-dive into your existing tools, manual tasks, and bottlenecks during a detailed onboarding process."
    },
    {
      num: "02",
      title: "Build & Deploy",
      description: "Our certified operations engineers build, test, and safely deploy your custom integrations using Zapier, Make, or custom API code."
    },
    {
      num: "03",
      title: "Maintain & Optimize",
      description: "We provide round-the-clock proactive maintenance, live error tracking, and ongoing revisions to keep your system in perfect shape."
    }
  ];

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadLoading(true);
    setLeadError('');
    try {
      const utm_source = searchParams.get('utm_source') || '';
      const utm_medium = searchParams.get('utm_medium') || '';
      const utm_campaign = searchParams.get('utm_campaign') || '';

      await createLead({
        ...leadForm,
        source: 'landing-page',
        utm_source,
        utm_medium,
        utm_campaign
      });
      
      // Track Lead conversion
      if (window.gtag) {
        window.gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: 'Lead Magnet Download'
        });
      }
      if (window.fbq) {
        window.fbq('track', 'Lead', { content_name: 'Lead Magnet Guide' });
      }

      setLeadSubmitted(true);
      setLeadForm({ firstName: '', email: '', agencyName: '' });
    } catch (err) {
      setLeadError(err.message);
    } finally {
      setLeadLoading(false);
    }
  };

  const handleLeadInput = (e) => {
    setLeadForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-500 text-white p-2 rounded-lg">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">AutomateOSHQ</span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-indigo-500 transition">Features</a>
              <a href="#products" className="hover:text-indigo-500 transition">Products</a>
              <a href="#how-it-works" className="hover:text-indigo-500 transition">How It Works</a>
              <a href="#pricing" className="hover:text-indigo-500 transition">Pricing</a>
              <Link to="/resources" className="hover:text-indigo-500 transition">Resources</Link>
              <a href="#faq" className="hover:text-indigo-500 transition">FAQ</a>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={(e) => handleNavigate('/dashboard', e)} className="text-sm font-semibold text-slate-700 hover:text-indigo-500 transition cursor-pointer">
                Client Portal
              </button>
              <button onClick={(e) => handleNavigate('/onboarding', e, 'Nav - Get Started')} className="inline-flex items-center justify-center px-4 h-9 text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow-sm transition cursor-pointer">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-500 mb-6 border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> AI-Native Operations Department
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Productized <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">AI &amp; Workflow Automation</span> for Growing Agencies.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
              We build, manage, and scale your custom automated workflows and AI agents for a flat monthly subscription. Get the power of an elite in-house operations engineer at a fraction of the cost.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={(e) => handleNavigate('/onboarding', e, 'Hero - Start Automating Now')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-md transition-all duration-200 cursor-pointer">
                Start Automating Now <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <a href="#pricing" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-all duration-200">
                View Pricing Plans
              </a>
            </div>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              <SecureBadge />
              <SlaBadge />
              <EngineerBadge />
            </div>
            
            {/* Quick trust metrics */}
            <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-3 gap-4 max-w-xl mx-auto text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-500">48h</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Average Turnaround</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-500">100%</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Custom Built</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-500">150k+</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Hours Saved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LogoBar />

      {/* Lead Magnet Opt-in Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-teal-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Content */}
              <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 mb-6 w-fit">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Free Resource
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                  Recover 20+ Hours per Week with these <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">5 Workflows</span>
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                  Download the free guide used by high-growth agencies to eliminate "Manual Work Tax" and scale without adding headcount.
                </p>
                <div className="space-y-3 mb-2">
                  {['The Speed-to-Lead Engine — Automated Intake & AI Qualification', 'Seamless Onboarding — Payment → Project Kickoff in minutes', 'Hands-Off Reporter — Automated KPI Syncing', 'Frictionless Finance — Invoicing & Collections', 'Bottleneck Breaker — Content Approval Loops'].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-emerald-50 text-emerald-600 p-0.5 rounded-full mt-0.5 flex-shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-slate-700 text-xs sm:text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Form */}
              <div className="p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center">
                {leadSubmitted ? (
                  <div className="w-full text-center py-8">
                    <div className="p-3 bg-emerald-50 inline-flex rounded-2xl mb-4 border border-emerald-100">
                      <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-2">Check Your Inbox! 📬</h3>
                    <p className="text-slate-500 text-sm">We've sent the guide to <strong className="text-slate-700">{leadForm.email}</strong>. It should arrive in under 2 minutes.</p>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="w-full max-w-sm mx-auto space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="leadFirstName">First Name</label>
                      <input type="text" name="firstName" id="leadFirstName" placeholder="e.g. Sarah" required
                        value={leadForm.firstName} onChange={handleLeadInput}
                        className="w-full px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="leadEmail">Work Email</label>
                      <input type="email" name="email" id="leadEmail" placeholder="sarah@agency.com" required
                        value={leadForm.email} onChange={handleLeadInput}
                        className="w-full px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="leadAgency">Agency Name <span className="text-slate-300 font-normal normal-case">(optional)</span></label>
                      <input type="text" name="agencyName" id="leadAgency" placeholder="e.g. Acme Agency"
                        value={leadForm.agencyName} onChange={handleLeadInput}
                        className="w-full px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium" />
                    </div>

                    {leadError && <p className="text-xs font-bold text-red-500">{leadError}</p>}

                    <button type="submit" disabled={leadLoading || !leadForm.firstName || !leadForm.email}
                      className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 shadow-lg transition disabled:opacity-50">
                      {leadLoading ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : <><Download className="w-4 h-4 mr-2" /> Send Me the Free Guide →</>}
                    </button>

                    <p className="text-[10px] font-semibold text-slate-400 text-center pt-1">Join 150+ agency founders who have reclaimed their time. No spam, ever. <span className="text-indigo-400">Downloaded 47 times this week →</span></p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              What We Build For You
            </h2>
            <p className="text-lg text-slate-600">
              From straightforward API synchronization to sophisticated generative AI data pipelines, we engineer workflows that save hours of human labor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-indigo-50 inline-block rounded-xl mb-6">
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{useCase.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{useCase.description}</p>
                </div>
                <Link to="/onboarding" className="mt-6 pt-4 border-t border-slate-100 flex items-center text-indigo-500 text-sm font-semibold hover:text-indigo-600 cursor-pointer group">
                  Learn more <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Visualization Section */}
      <section className="py-24 bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
              <Zap className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> See It In Action
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              From Lead to Invoice — Fully Automated
            </h2>
            <p className="text-lg text-slate-400">
              A single form submission triggers AI qualification, CRM sync, and team notification — in under 60 seconds. No manual steps. No errors.
            </p>
          </div>

          <div className="relative flex justify-center">
            <WorkflowDiagram className="w-full max-w-5xl h-auto rounded-2xl shadow-2xl shadow-indigo-500/5" />
          </div>

          {/* Feature highlights under the diagram */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-black text-indigo-400 mb-1">&lt; 60s</div>
              <p className="text-sm text-slate-400 font-medium">End-to-end processing time</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-teal-400 mb-1">100%</div>
              <p className="text-sm text-slate-400 font-medium">Accuracy rate on data sync</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-400 mb-1">24/7</div>
              <p className="text-sm text-slate-400 font-medium">Non-stop operation, zero downtime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Before vs After Section */}
      <section className="py-24 bg-white border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100">
              <Activity className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> The AutomateOSHQ Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Before vs. After: Your Lead Pipeline
            </h2>
            <p className="text-lg text-slate-600">
              What used to take 4+ hours of manual copy-paste now happens automatically in minutes. See the difference.
            </p>
          </div>

          <div className="relative flex justify-center">
            <img
              src="/before-after.svg"
              alt="Before vs After comparison of agency lead pipeline: Manual workflow takes 80 minutes with data entry errors vs automated workflow reduces to 5 minutes with AI accuracy"
              loading="lazy"
              className="w-full max-w-5xl h-auto rounded-2xl shadow-xl border border-slate-100"
            />
          </div>

          <div className="mt-12 text-center">
            <Link 
              to="/onboarding"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-md transition-all duration-200"
            >
              Get Your Pipeline Automated <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <p className="mt-4 text-xs text-slate-400">No commitment required. First workflow built in 48 hours.</p>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              How AutomateOSHQ Works
            </h2>
            <p className="text-lg text-slate-600">
              Getting custom automations has never been this frictionless. No coding, no hiring headaches, just workflows delivered on demand.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-16 -z-0"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="text-5xl font-extrabold text-indigo-100 mb-4 tracking-tight">{step.num}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base max-w-sm">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between shadow-inner">
            <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Need a completely custom, heavy-duty build?</h4>
              <p className="text-slate-600 text-sm sm:text-base">We design scalable databases, custom webhooks, and complex third-party software syncs.</p>
            </div>
            <Link to="/onboarding?plan=dedicated" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg shadow transition">
              Book a Strategy Sync <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Service Delivery Blueprint Section */}
      <section className="py-24 bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
              <Layers className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Our Delivery Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Service Delivery Blueprint
            </h2>
            <p className="text-lg text-slate-400">
              From audit to ongoing operations — a proven 5-stage methodology that ensures every workflow is built right and stays running.
            </p>
          </div>

          <div className="relative flex justify-center">
            <img
              src="/service-delivery-blueprint.svg"
              alt="Service Delivery Blueprint for AI workflow automation: Phase 1 Audit → Phase 2 Blueprint → Phase 3 Build → Phase 4 Integrate → Phase 5 Manage & Optimize"
              loading="lazy"
              className="w-full max-w-6xl h-auto rounded-2xl shadow-2xl shadow-indigo-500/5"
            />
          </div>

          {/* Quick stats under the blueprint */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <p className="text-3xl font-black text-indigo-400 mb-1">12 Days</p>
              <p className="text-sm text-slate-400 font-medium">Average audit-to-deploy timeline</p>
            </div>
            <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <p className="text-3xl font-black text-teal-400 mb-1">100%</p>
              <p className="text-sm text-slate-400 font-medium">Custom-built for your stack</p>
            </div>
            <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <p className="text-3xl font-black text-emerald-400 mb-1">&infin;</p>
              <p className="text-sm text-slate-400 font-medium">Ongoing support & optimization</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bite-Sized Offers Section */}
      <section id="products" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 mb-4 border border-amber-200">
              <Zap className="w-3 h-3 mr-1.5 text-amber-500" /> Low-Commitment Options
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
              One-Off Automation Products
            </h2>
            <p className="text-base text-slate-500">
              Not ready for a subscription? Start with a single automation product. No commitment, instant value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {/* Product 1: Template Pack — Best for quick wins */}
            <div className="group relative bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white">
              <div className="absolute top-0 right-6 -translate-y-1/2 no-print">
                <span className="text-[8px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                  Best for quick wins
                </span>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 group-hover:scale-110 transition-all duration-300">
                  <Layers className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  One-Time
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">Template Pack</h3>
              <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-2">Lead Gen Essentials</p>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                3 pre-built automation templates for lead capture, CRM sync, and follow-up. Ready to deploy in your stack.
              </p>
              <div className="flex items-baseline mb-4 group-hover:scale-105 transition-transform duration-300 origin-left">
                <span className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">$149</span>
                <span className="text-xs text-slate-400 ml-1.5 font-medium">one-time</span>
              </div>
              <ul className="space-y-2 mb-5">
                {['Lead capture → CRM template', 'Auto follow-up sequence', 'Slack notification pipeline'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={(e) => handleNavigate('/templates', e, 'Product - Template Pack')}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-bold text-xs text-indigo-600 bg-white border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group/btn cursor-pointer"
              >
                Buy Templates <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Product 2: Strategy Session */}
            <div className="group bg-slate-50 border border-slate-200 hover:border-teal-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-teal-50 rounded-xl group-hover:bg-teal-100 group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="w-5 h-5 text-teal-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  One-Time
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">Strategy Session</h3>
              <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider mb-2">Workflow Audit & Roadmap</p>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                60-minute deep dive with a senior automation engineer. Get a prioritized roadmap of your biggest automation wins.
              </p>
              <div className="flex items-baseline mb-4 group-hover:scale-105 transition-transform duration-300 origin-left">
                <span className="text-2xl font-black text-slate-900 group-hover:text-teal-600 transition-colors">$299</span>
                <span className="text-xs text-slate-400 ml-1.5 font-medium">one-time</span>
              </div>
              <ul className="space-y-2 mb-5">
                {['Full tech stack audit', 'Top 3 automation opportunities', 'Custom roadmap document'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={(e) => handleNavigate('/audit', e, 'Product - Strategy Session')}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-bold text-xs text-indigo-600 bg-white border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group/btn cursor-pointer"
              >
                Book Session <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Product 3: Single Build */}
            <div className="group bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 group-hover:scale-110 transition-all duration-300">
                  <Zap className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  One-Time
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">Single Build</h3>
              <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider mb-2">Custom Integration</p>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                One custom integration or workflow, built and deployed by our engineers. Includes 30 days of post-launch support.
              </p>
              <div className="flex items-baseline mb-4 group-hover:scale-105 transition-transform duration-300 origin-left">
                <span className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">$1,499</span>
                <span className="text-xs text-slate-400 ml-1.5 font-medium">one-time</span>
              </div>
              <ul className="space-y-2 mb-5">
                {['Custom API integration', 'Zapier/Make/n8n workflow', '30-day support included'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={(e) => handleNavigate('/onboarding?product=single-integration', e, 'Product - Single Build')}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-bold text-xs text-indigo-600 bg-white border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group/btn cursor-pointer"
              >
                Order Build <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Bottom trust note */}
          <div className="mt-10 text-center">
            <p className="text-xs text-slate-400">
              All products include a <span className="font-bold text-slate-600">7-day satisfaction guarantee</span>. 
              Not sure what you need? <a href="#pricing" className="text-indigo-500 hover:text-indigo-600 font-semibold underline underline-offset-2">View our subscription plans →</a>
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-500 mb-4 border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> Simple, Predictable Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Choose Your Automation Plan
            </h2>
            <p className="text-lg text-slate-600">
              No hidden fees. Pause or cancel anytime. Start with the plan that fits your scale.
            </p>
          </div>

          {/* Trust markers bar above plans */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-12 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-500" /> 48-hour response guarantee</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="w-4 h-4 text-emerald-500" /> 100% secure checkout</span>
            <span className="inline-flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-emerald-500" /> Cancel or pause anytime</span>
          </div>

          {/* Popular Plans: 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {plans.filter(p => p.id !== 'dedicated' && p.id !== 'enterprise').map((plan) => (
              <div 
                key={plan.id} 
                className={`bg-white rounded-2xl border ${
                  plan.popular ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-xl relative z-10 scale-[1.02]' : 'border-slate-200 shadow-sm'
                } p-8 flex flex-col justify-between`}
              >
                <div>
                  {plan.popular && (
                    <span className="inline-block bg-gradient-to-r from-indigo-500 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 shadow-sm">
                      ★ Most Popular
                    </span>
                  )}
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{plan.name}</h3>
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4">{plan.tagline}</p>
                  <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed min-h-[60px]">{plan.description}</p>
                  
                  <div className="flex items-baseline mb-6 pt-4 border-t border-slate-100">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">{plan.price}</span>
                    <span className="text-slate-500 font-semibold text-sm ml-2">/ {plan.period}</span>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature, i) => {
                      const premiumIcon = <PremiumFeatureIcon feature={feature} className="w-5 h-5 mr-3 mt-0 flex-shrink-0" />;
                      return (
                        <li key={i} className="flex items-start">
                          {premiumIcon ? premiumIcon : (
                            <div className="bg-emerald-50 text-emerald-600 p-0.5 rounded-full mr-3 mt-0.5 flex-shrink-0">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <span className={`text-xs sm:text-sm leading-relaxed ${premiumIcon ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  {plan.perfectFor && (
                    <div className="mb-6 p-3 bg-slate-50 border border-slate-100 rounded-xl text-left">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Perfect For</p>
                      <p className="text-slate-600 text-[11px] leading-normal italic">{plan.perfectFor}</p>
                    </div>
                  )}

                  {plan.roi && (
                    <div className="mb-6 p-3 bg-teal-50/50 border border-teal-100 rounded-xl text-left">
                      <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-1">Estimated ROI</p>
                      <p className="text-slate-600 text-[11px] leading-normal italic">{plan.roi}</p>
                    </div>
                  )}

                  <Link 
                    to={`/onboarding?plan=${plan.id}`}
                    onClick={() => trackInitiateCheckout(plan.id)}
                    className={`w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm shadow-lg transition-all duration-200 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white shadow-indigo-200' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Scale Solutions: Dedicated + Enterprise */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 mb-3 border border-slate-200">
                <Users className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> For Teams &amp; Enterprises
              </span>
              <h3 className="text-xl font-bold text-slate-800">Scale Solutions</h3>
              <p className="text-sm text-slate-500 mt-1">Need dedicated resources or multi-department deployment?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.filter(p => p.id === 'dedicated' || p.id === 'enterprise').map((plan) => (
                <div key={plan.id} className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-1">{plan.name}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm mb-4 leading-relaxed">{plan.description}</p>
                    
                    <div className="flex items-baseline mb-5 pt-3 border-t border-slate-100">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{plan.price}</span>
                      <span className="text-slate-500 font-semibold text-sm ml-2">/ {plan.period}</span>
                    </div>

                    <ul className="space-y-2.5 mb-6">
                      {plan.features.map((feature, i) => {
                        const premiumIcon = <PremiumFeatureIcon feature={feature} className="w-5 h-5 mr-3 mt-0 flex-shrink-0" />;
                        return (
                          <li key={i} className="flex items-start">
                            {premiumIcon ? premiumIcon : (
                              <div className="bg-indigo-50 text-indigo-500 p-0.5 rounded-full mr-2.5 mt-0.5 flex-shrink-0">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                            <span className={`text-xs sm:text-sm leading-relaxed ${premiumIcon ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{feature}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {plan.alternative && (
                    <div className="mb-5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-left">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">The Alternative</p>
                      <p className="text-slate-600 text-[11px] leading-normal italic">{plan.alternative}</p>
                    </div>
                  )}

                  <Link 
                    to={`/onboarding?plan=${plan.id}`}
                    onClick={() => trackInitiateCheckout(plan.id)}
                    className="w-full inline-flex items-center justify-center py-3 px-6 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 shadow transition"
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Services — moved to own section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 mb-3 border border-amber-200">
                <Zap className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> One-Time Services
              </span>
              <h3 className="text-xl font-bold text-slate-800">Need a Single Build?</h3>
              <p className="text-sm text-slate-500 mt-1">No subscription required. Start with a one-time audit or custom integration.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Audit */}
              <div className="bg-white border-2 border-indigo-100 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition">
                <div>
                  <div className="bg-indigo-50 text-indigo-500 w-10 h-10 rounded-lg flex items-center justify-center mb-6">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Automation Audit</h4>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    A 60-minute deep dive into your current tech stack. We'll identify the "Manual Work Tax" 
                    and deliver a prioritized automation roadmap with ROI estimates.
                  </p>
                  <div className="text-2xl font-black text-slate-900 mb-6">$299 <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">/ one-time</span></div>
                </div>
                <button
                  onClick={(e) => handleNavigate('/audit', e, 'Bottom - Book Your Audit')}
                  className="w-full inline-flex items-center justify-center py-3 px-6 rounded-xl font-bold text-sm bg-indigo-500 text-white hover:bg-indigo-600 shadow transition cursor-pointer"
                >
                  <Activity className="w-4 h-4 mr-2" /> Book Your Audit
                </button>
              </div>
              {/* Single Build */}
              <div className="bg-white border-2 border-teal-100 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:border-teal-300 transition">
                <div>
                  <div className="bg-teal-50 text-teal-600 w-10 h-10 rounded-lg flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Custom Workflow Build</h4>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    Need one high-complexity workflow? We design, build, and deploy a single custom integration with 30 days of support.
                  </p>
                  <div className="text-2xl font-black text-slate-900 mb-6">$1,499 <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">/ one-time</span></div>
                </div>
                <button
                  onClick={(e) => handleNavigate('/onboarding?product=single-integration', e, 'Bottom - Request Build')}
                  className="w-full inline-flex items-center justify-center py-3 px-6 rounded-xl font-bold text-sm bg-teal-500 text-white hover:bg-teal-600 shadow transition cursor-pointer"
                >
                  <Zap className="w-4 h-4 mr-2" /> Request a Build
                </button>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-6">
            <SecureBadge />
            <SlaBadge />
            <EngineerBadge />
            <div className="flex items-center text-slate-500 text-sm font-semibold">
              <RefreshCw className="w-4 h-4 mr-1.5 text-emerald-500" /> Cancel or pause anytime
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white border-t border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-8 divide-y divide-slate-100">
            <div className="pt-8 first:pt-0">
              <h4 className="text-lg font-bold text-slate-900 mb-2">What is a "productized automation service"?</h4>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                It means instead of paying expensive freelancers by the hour or hiring a full-time in-house operations engineer, you subscribe to a predictable flat monthly fee. You can submit unlimited requests or request revisions, and we handle the design, build, deployment, and ongoing maintenance.
              </p>
            </div>
            <div className="pt-8">
              <h4 className="text-lg font-bold text-slate-900 mb-2">How fast will my automations be delivered?</h4>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                On average, custom workflows are designed, tested, and delivered within 48 hours. More complex systems (like AI models or database migrations) might require split sprints, but we keep you updated daily in your dashboard.
              </p>
            </div>
            <div className="pt-8">
              <h4 className="text-lg font-bold text-slate-900 mb-2">Can I pause or cancel my subscription?</h4>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Yes! If you only have one or two automations built and don't need ongoing updates, you can pause your subscription and resume whenever you need additional workflows. No contracts, no friction.
              </p>
            </div>
            <div className="pt-8">
              <h4 className="text-lg font-bold text-slate-900 mb-2">Which platforms do you integrate with?</h4>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Almost anything with an API! We regularly build using Zapier, Make.com, n8n, custom Node.js/Python microservices, Slack, Salesforce, HubSpot, ActiveCampaign, Airtable, Notion, Google Workspace, Stripe, OpenAI, Anthropic, and many more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 sm:mb-0">
            <div className="bg-indigo-500 text-white p-1.5 rounded-md">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">AutomateOSHQ</span>
          </div>
          <div className="flex space-x-6 text-sm mb-6 sm:mb-0">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
          </div>
          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} AutomateOSHQ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
