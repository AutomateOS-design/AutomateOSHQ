import React from 'react';
import { Link } from 'react-router-dom';
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
  Sparkles,
  RefreshCw,
  Users
} from 'lucide-react';

export default function LandingPage() {
  const plans = [
    {
      id: 'starter',
      name: 'Starter Flow',
      price: '$999',
      period: 'month',
      tagline: 'Stop copying. Start scaling.',
      description: 'The perfect entry point to eliminate your most painful manual tasks. Two custom workflows. Unlimited revisions. Zero downtime.',
      features: [
        '2 custom-built workflows — Designed, built, and deployed by our automation engineers',
        'Unlimited revisions — We iterate until your workflows run exactly how you envision',
        'Slack‑native support — Open a thread and we’re on it (48-hour response SLA)',
        'Standard integrations — Zapier, Make, Gmail, Slack, Calendly, Notion, Airtable',
        'Monthly performance report — See exactly how many hours and dollars you saved',
        '30‑min onboarding call — We learn your stack in one session'
      ],
      perfectFor: 'Agency owners drowning in manual lead transfer. E‑commerce brands tired of copy‑pasting orders into shipping. Real estate teams still entering client data by hand.',
      cta: 'Start automating →',
      popular: false,
    },
    {
      id: 'growth',
      name: 'Growth Engine',
      price: '$2,499',
      period: 'month',
      description: 'Five intelligent workflows with AI-powered document extraction, smart replies, and multi‑tool orchestration. Scale without the headcount.',
      tagline: 'Workflows that think. Systems that scale.',
      features: [
        '5 custom AI-powered workflows — Including GPT-4 and Claude integrations',
        'AI document extraction — Parse invoices, contracts, emails into structured data automatically',
        'Smart reply automation — AI drafts contextual responses for leads and clients',
        'Custom database syncs — Keep your CRM, ERP, and analytics in lockstep',
        '24‑hour priority support — We never let a broken workflow stop your business',
        'Bi‑weekly strategy sync — 30 min every two weeks to plan your next automation',
        'All Starter Flow features included'
      ],
      roi: 'One client automated their lead‑to‑invoice pipeline and recovered 35+ hours/week. Another cut invoice processing from 4 hours to 4 minutes.',
      cta: 'Scale smarter →',
      popular: true,
    },
    {
      id: 'dedicated',
      name: 'Dedicated Retainer',
      price: '$4,999',
      period: 'month',
      description: 'An entire automation department — strategist, engineer, and AI — dedicated to your business. Unlimited workflows. Custom dashboards. Weekly strategy.',
      features: [
        'Unlimited active workflows — Build as many automations as you need',
        'Dedicated automation team — Your personal strategist + senior engineer',
        'Custom analytics dashboard — Real-time visibility into every automated process',
        'Weekly strategy sync — 60-min deep dive on what to automate next',
        'Custom API integrations — Connect proprietary tools, legacy systems, anything',
        '1-hour emergency response — If it breaks, we fix it. Immediately.',
        'Quarterly business review — We audit your ops and present a roadmap'
      ],
      cta: 'Talk to our team →',
      alternative: 'Hiring a full‑time ops engineer costs $85,000–$120,000/year plus benefits. Dedicated Retainer gives you a whole team for less than $60,000/year. No recruiting. No PTO. No overhead.',
      popular: false,
    }
  ];

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
              <span className="text-xl font-bold tracking-tight text-slate-900">AutomateOS</span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-indigo-500 transition">Features</a>
              <a href="#how-it-works" className="hover:text-indigo-500 transition">How It Works</a>
              <a href="#pricing" className="hover:text-indigo-500 transition">Pricing</a>
              <a href="#faq" className="hover:text-indigo-500 transition">FAQ</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-sm font-semibold text-slate-700 hover:text-indigo-500 transition">
                Client Portal
              </Link>
              <Link to="/onboarding" className="inline-flex items-center justify-center px-4 h-9 text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow-sm transition">
                Get Started
              </Link>
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
              Stop building automations. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">Start owning your time.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
              We build, manage, and scale your custom automated workflows and AI agents for a flat monthly subscription. Get the power of an elite in-house operations engineer at a fraction of the cost.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#pricing" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-md transition-all duration-200">
                View Plans <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <Link to="/dashboard" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-all duration-200">
                Explore Demo Portal
              </Link>
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

      {/* Visual Workflow Map (SVG Graphic Overlay) */}
      <section className="bg-white py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">COMPATIBLE WITH ALL YOUR CRITICAL BUSINESS TOOLS</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            <span className="font-semibold text-lg text-slate-700">Slack</span>
            <span className="font-semibold text-lg text-slate-700">Salesforce</span>
            <span className="font-semibold text-lg text-slate-700">HubSpot</span>
            <span className="font-semibold text-lg text-slate-700">Airtable</span>
            <span className="font-semibold text-lg text-slate-700">Zapier</span>
            <span className="font-semibold text-lg text-slate-700">Make.com</span>
            <span className="font-semibold text-lg text-slate-700">Notion</span>
            <span className="font-semibold text-lg text-slate-700">Stripe</span>
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
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-indigo-500 text-sm font-semibold hover:text-indigo-600 cursor-pointer group">
                  Learn more <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              How AutomateOS Works
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Simple, Predictable Subscription Pricing
            </h2>
            <p className="text-lg text-slate-600">
              No hidden fees. Pause or cancel anytime. Choose the plan that fits your business scale.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`bg-white rounded-2xl border ${
                  plan.popular ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg relative z-10' : 'border-slate-200 shadow-sm'
                } p-8 flex flex-col justify-between`}
              >
                <div>
                  {plan.popular && (
                    <span className="inline-block bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                      Most Popular
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
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className="bg-emerald-50 text-emerald-600 p-0.5 rounded-full mr-3 mt-0.5 flex-shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-slate-600 text-xs sm:text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
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

                  {plan.alternative && (
                    <div className="mb-6 p-3 bg-slate-50 border border-slate-100 rounded-xl text-left">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">The Alternative</p>
                      <p className="text-slate-600 text-[11px] leading-normal italic">{plan.alternative}</p>
                    </div>
                  )}

                  <Link 
                    to={`/onboarding?plan=${plan.id}`}
                    className={`w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm shadow transition-all duration-200 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center text-slate-500 text-sm flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8">
            <span className="flex items-center"><Shield className="w-4 h-4 mr-1.5 text-slate-400" /> Cancel or pause anytime</span>
            <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-1.5 text-slate-400" /> Unlimited revisions</span>
            <span className="flex items-center"><Users className="w-4 h-4 mr-1.5 text-slate-400" /> 1-on-1 direct support</span>
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
            <span className="text-white font-bold text-lg tracking-tight">AutomateOS</span>
          </div>
          <div className="flex space-x-6 text-sm mb-6 sm:mb-0">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
          </div>
          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} AutomateOS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
