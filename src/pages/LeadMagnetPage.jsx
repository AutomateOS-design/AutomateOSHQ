import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, CheckCircle2, Download } from 'lucide-react';

const workflows = [
  {
    id: 1,
    title: 'The "Speed-to-Lead" Engine: Automated Intake & AI Qualification',
    problem: 'Leads wait hours for a response. By the time a human checks the inbox, the lead has moved on to a competitor.',
    solution: [
      'A new lead submits a form (Typeform, Webflow, Facebook Lead Ads)',
      'AI (GPT-4) analyzes the submission against your Ideal Customer Profile (ICP)',
      'If qualified, the lead is automatically added to your CRM (HubSpot/Salesforce) and a high-priority Slack alert is sent to your sales team with a summary',
      'An automated, personalized "Next Steps" email is sent instantly'
    ],
    impact: 'Increase conversion rates by up to 30% by responding in under 60 seconds.',
    svg: '/workflows/workflow-01-speed-to-lead.svg'
  },
  {
    id: 2,
    title: 'Seamless Onboarding: From "Payment Received" to "Project Kickoff"',
    problem: 'The "dead zone" between a client signing a contract and the project actually starting. Manual setup of folders, boards, and portals takes hours.',
    solution: [
      'Successful payment in Stripe or signed contract in PandaDoc',
      'Create a project board in ClickUp/Asana using your "New Client Template"',
      'Create a shared Google Drive or Dropbox folder with the correct permissions',
      'Invite the client to their custom AutomateOS dashboard/portal',
      'Send a personalized welcome sequence with their kickoff meeting link'
    ],
    impact: 'Professional first impression and 100% reduction in manual setup time.',
    svg: '/workflows/workflow-02-seamless-onboarding.svg'
  },
  {
    id: 3,
    title: 'The Hands-Off Reporter: Automated KPI Syncing',
    problem: 'Account Managers spending the first 5 days of every month copy-pasting data from Facebook, Google Ads, and TikTok into spreadsheets.',
    solution: [
      'Scheduled daily/weekly trigger',
      'Pull data via API from all ad platforms and organic social tools',
      'Clean and format data in a central database or master spreadsheet',
      'Update your client-facing dashboard (Looker Studio, Tableau, or Custom Portal)',
      'AI generates a 3-bullet summary of performance trends for the week'
    ],
    impact: '10+ hours recovered per Account Manager, per month. Zero math errors.',
    svg: '/workflows/workflow-03-hands-off-reporter.svg'
  },
  {
    id: 4,
    title: 'Frictionless Finance: Automated Invoicing & Collections',
    problem: 'Chasing payments and manually generating invoices for custom work or overages.',
    solution: [
      'Project task marked "Complete" or monthly billing cycle hits',
      'Generate an invoice in QuickBooks or Xero based on project data',
      'Email the invoice to the client with a direct payment link',
      'If unpaid after X days, trigger a gentle Slack reminder for the AM and a follow-up email for the client',
      'Mark as paid in your CRM once the webhook from Stripe hits'
    ],
    impact: 'Improved cash flow and reduced "awkward" collection conversations.',
    svg: '/workflows/workflow-04-frictionless-finance.svg'
  },
  {
    id: 5,
    title: 'The Bottleneck Breaker: Content Approval & Feedback Loops',
    problem: 'Creative assets getting lost in email threads. Clients forget to approve, and projects stall.',
    solution: [
      'New asset uploaded to your project management tool',
      'Send a Slack/Email notification to the client with a direct link to the asset and an "Approve/Request Changes" button',
      'If approved: Automatically move the task to "Scheduled" and notify the creative team',
      'If changes requested: Feed the feedback directly back into the task comments for the designer'
    ],
    impact: 'Projects move 2x faster. Clearer audit trail for approvals.',
    svg: '/workflows/workflow-05-content-approval.svg'
  }
];

export default function LeadMagnetPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Print-friendly styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-page { break-before: page; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* Floating Download/CTA Bar */}
      <div className="no-print sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">AutomateOS</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-xl text-xs border border-indigo-100 transition"
            >
              <Download className="w-3.5 h-3.5" /> Save as PDF
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-sm transition"
            >
              View Plans <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
            Free Resource
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Top 5 Automation Workflows for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">High-Growth Agencies</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop paying the "Manual Work Tax" and start scaling your output. The 5 highest-ROI automation workflows that the top 1% of agencies use to recover 20+ hours per week.
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-4">The Agency Scaling Problem</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Most agencies reach a plateau not because of a lack of talent, but because of operational overhead. Every new client adds a layer of manual tasks: lead data entry, onboarding emails, project setup, and manual reporting.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { stat: '20+', label: 'Hours lost per week', desc: 'per employee to manual tasks' },
              { stat: '30%', label: 'Conversion lift', desc: 'with &lt;60s lead response' },
              { stat: '10x', label: 'Scaling leverage', desc: 'through automated systems' }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                <p className="text-3xl font-black text-indigo-500">{item.stat}</p>
                <p className="text-sm font-bold text-slate-900 mt-1">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {workflows.map((wf, index) => (
          <div key={wf.id} className={`${index > 0 ? 'pt-16 border-t border-slate-200' : ''}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20">
                {wf.id}
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Workflow {wf.id}</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{wf.title}</h2>
              </div>
            </div>

            {/* Problem */}
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-600 text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">The Problem</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{wf.problem}</p>
                </div>
              </div>
            </div>

            {/* Solution Flow Diagram */}
            <div className="mb-6">
              <img 
                src={wf.svg} 
                alt={`Workflow ${wf.id} diagram`}
                className="w-full max-w-4xl h-auto rounded-xl"
              />
            </div>

            {/* Solution Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {wf.solution.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-indigo-600">{i + 1}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            {/* Impact */}
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">The Impact</p>
                  <p className="text-sm text-slate-700 font-semibold">{wf.impact}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conclusion / CTA */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">Ready to See These Workflows Live?</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Automation isn't about replacing your team; it's about giving them their time back to do the high-level strategy work that actually grows the agency.
          </p>
          <p className="text-sm text-slate-500 mb-8 max-w-xl mx-auto">
            AutomateOS builds and maintains custom workflows for a flat monthly fee. No hiring, no technical debt, just systems that scale.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition text-sm"
            >
              View Plans & Pricing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/onboarding"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl transition text-sm"
            >
              Book a Strategy Sync
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">AutomateOS</span>
          </div>
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} AutomateOS. All rights reserved. — Productized AI & Workflow Automation
          </p>
        </div>
      </footer>
    </div>
  );
}