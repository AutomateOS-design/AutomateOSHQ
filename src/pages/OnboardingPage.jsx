import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Zap, ArrowRight, CheckCircle2, MessageSquare, User, Briefcase, 
  Check, Sparkles, ChevronLeft, CreditCard,
  Lock, ShieldCheck, RefreshCw, ExternalLink, ArrowUpRight
} from 'lucide-react';
import { createClient, createRequest, createCheckoutSession } from '../api';

// Real Stripe Price IDs (used for reference — checkout URLs come from server)
const PLAN_PRICES = {
  starter: { name: 'Starter Flow', price: 999, description: 'The perfect entry point to eliminate your most painful manual tasks.' },
  growth: { name: 'Growth Engine', price: 2499, description: 'Five intelligent workflows with AI document extraction, smart replies, and DB syncs.' },
  dedicated: { name: 'Dedicated Retainer', price: 4999, description: 'An entire automation department dedicated to your business.' },
};

export default function OnboardingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedPlan = searchParams.get('plan') || 'starter';
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: PLAN_PRICES[selectedPlan]?.price || 0,
        items: [{ item_id: selectedPlan, item_name: selectedPlan }]
      });
    }
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', { content_category: 'subscription', content_ids: [selectedPlan] });
    }
  }, [selectedPlan]);

  const planInfo = PLAN_PRICES[selectedPlan];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (tool) => {
    setFormData(prev => {
      const current = [...prev.useCases];
      const index = current.indexOf(tool);
      if (index > -1) current.splice(index, 1);
      else current.push(tool);
      return { ...prev, useCases: current };
    });
  };

  const handleNextStep = () => {
    if (step === 2) {
      // When proceeding to payment, first create the client, then redirect to Stripe
      handleCreateAndRedirect();
    } else if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      handleCompleteOnboarding();
    }
  };

  const handleCreateAndRedirect = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const cId = 'client-' + Date.now();
      setClientId(cId);

      // Create the client in the database first
      await createClient({
        id: cId,
        companyName: formData.companyName || 'New Business Ltd',
        contactName: formData.contactName || 'New Client User',
        email: formData.email || 'info@newclient.com',
        phone: formData.phone || '',
        plan: selectedPlan,
        status: 'Active',
        metrics: {
          hoursSaved: 0,
          executionsMTD: 0,
          valueCreated: 0
        }
      });

      // Save the first request if filled out
      if (formData.firstRequest && formData.firstRequest.trim()) {
        await createRequest({
          id: Date.now(),
          clientId: cId,
          clientName: formData.companyName || 'New Business Ltd',
          title: formData.firstRequest,
          type: 'Onboarding Request',
          tools: JSON.stringify(formData.useCases.length > 0 ? formData.useCases : ['Custom Integration']),
          status: 'Pending',
          hoursSaved: 0,
          runs: 0,
          submitted: 'Just now'
        });
      }

      // Store client ID for return visit
      sessionStorage.setItem('automateos_current_client_id', cId);
      sessionStorage.setItem('automateos_pending_onboarding', 'true');

      // Track Lead Generation
      if (window.gtag) gtag('event', 'generate_lead', { 'value': 0.00, 'currency': 'USD' });
      if (window.fbq) fbq('track', 'Lead');
      if (window.lintrk) lintrk('track', { conversion_id: 654321 });

      // Set step to 3 to show Stripe redirect
      setStep(3);
    } catch (err) {
      console.error('Failed to create client:', err);
      alert('Failed to create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStripeRedirect = async () => {
    try {
      setCheckoutError('');
      setSubmitting(true);
      const cId = clientId || sessionStorage.getItem('automateos_current_client_id');
      if (!cId) { setCheckoutError('No client ID found. Please try again.'); setSubmitting(false); return; }
      
      const result = await createCheckoutSession(cId, selectedPlan);
      
      // Track checkout start
      if (window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: 'C_' + Date.now(),
          value: PLAN_PRICES[selectedPlan]?.price || 0,
          currency: 'USD',
          items: [{ item_id: selectedPlan, item_name: selectedPlan }]
        });
      }
      
      // Redirect to Stripe hosted checkout
      window.location.href = result.url;
    } catch (err) {
      setCheckoutError(err.message || 'Failed to create checkout session');
      setSubmitting(false);
    }
  };

  const handleReturnFromStripe = () => {
    // Track Purchase
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: 'T_' + Date.now(),
        value: PLAN_PRICES[selectedPlan]?.price || 0,
        currency: 'USD',
        items: [{ item_id: selectedPlan, item_name: selectedPlan }]
      });
    }
    if (window.fbq) {
      window.fbq('track', 'Purchase', { value: PLAN_PRICES[selectedPlan]?.price || 0, currency: 'USD' });
    }

    // User has completed payment, proceed to dashboard
    const cId = clientId || sessionStorage.getItem('automateos_current_client_id');
    sessionStorage.removeItem('automateos_pending_onboarding');
    navigate(`/dashboard?onboarded=true&clientId=${cId}&plan=${selectedPlan}`);
  };

  const handleCompleteOnboarding = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const cId = clientId || sessionStorage.getItem('automateos_current_client_id');
      if (cId) {
        sessionStorage.setItem('automateos_current_client_id', cId);
        sessionStorage.removeItem('automateos_pending_onboarding');
        navigate(`/dashboard?onboarded=true&clientId=${cId}&plan=${selectedPlan}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Navigation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const toggleSlackConnection = () => {
    setFormData(prev => ({ ...prev, slackConnected: !prev.slackConnected }));
  };

  const toolsList = [
    'Slack', 'Salesforce', 'HubSpot', 'Airtable', 'Notion', 
    'Google Sheets', 'Gmail / Email', 'Stripe', 'OpenAI (GPT-4)', 'Typeform / Webforms'
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-indigo-500 text-white p-1.5 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">AutomateOS</span>
          </Link>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
            <span>Onboarding: Step {step} of 4</span>
          </div>
        </div>
      </header>

      <main className="flex-grow py-12 flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto px-4">
          
          {/* Progress Indicator */}
          <div className="mb-8 flex justify-between items-center px-4">
            <div className="flex items-center w-full">
              {[1,2,3,4].map(s => (
                <React.Fragment key={s}>
                  {s > 1 && <div className={`flex-grow h-1 transition-all duration-300 ${step >= s ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step >= s ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {s}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-10 transition-all duration-300 relative overflow-hidden">
            
            {/* ═══ STEP 1: Plan & Profile ═══ */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Confirm Your Plan</h1>
                  <p className="text-slate-500 text-sm mt-1.5">Let's set up your profile and confirm your billing choice.</p>
                </div>

                <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block">Selected Subscription</span>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">{planInfo.name}</h3>
                    <p className="text-slate-500 text-[11px] font-medium leading-tight mt-1 max-w-[280px]">{planInfo.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-500">${planInfo.price}</span>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Billed monthly</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="companyName">Company Name</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input type="text" name="companyName" id="companyName" placeholder="e.g. Acme Agency" 
                        value={formData.companyName} onChange={handleInputChange}
                        className="pl-11 w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="contactName">Contact Person</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input type="text" name="contactName" id="contactName" placeholder="e.g. Sarah Jenkins"
                        value={formData.contactName} onChange={handleInputChange}
                        className="pl-11 w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="email">Work Email</label>
                      <input type="email" name="email" id="email" placeholder="sarah@acme.com"
                        value={formData.email} onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="phone">Phone Number</label>
                      <input type="tel" name="phone" id="phone" placeholder="+1 (555) 019-2834"
                        value={formData.phone} onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium" />
                    </div>
                  </div>
                </div>

                <button onClick={handleNextStep}
                  disabled={!formData.companyName || !formData.contactName || !formData.email}
                  className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue to Request <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>
            )}

            {/* ═══ STEP 2: First Request ═══ */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Your First Request</h1>
                  <p className="text-slate-500 text-sm mt-1.5">Explain your first workflow idea. We will build this immediately.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Which platforms are in your tech stack?</label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1.5 border border-slate-100 rounded-lg">
                      {toolsList.map((tool) => (
                        <label key={tool} className={`flex items-center p-2 rounded-lg border text-xs font-semibold cursor-pointer transition select-none ${
                          formData.useCases.includes(tool) 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-500' 
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                        }`}>
                          <input type="checkbox" checked={formData.useCases.includes(tool)} 
                            onChange={() => handleCheckboxChange(tool)} className="hidden" />
                          <Check className={`w-3.5 h-3.5 mr-2 transition-all ${
                            formData.useCases.includes(tool) ? 'opacity-100' : 'opacity-0'
                          }`} />
                          {tool}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="firstRequest">Describe your first automation goal</label>
                    <textarea name="firstRequest" id="firstRequest" rows="4"
                      placeholder="e.g. Auto-extract PDF attachments from email, use AI to summarize, write to Airtable, notify in Slack."
                      value={formData.firstRequest} onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm resize-none font-medium"></textarea>
                  </div>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button onClick={handlePrevStep} className="w-1/3 inline-flex items-center justify-center py-3.5 px-4 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                  <button onClick={handleNextStep} disabled={!formData.firstRequest || submitting}
                    className="w-2/3 inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? (
                      <><RefreshCw className="w-4 h-4 mr-1.5 animate-spin" /> Creating Account...</>
                    ) : (
                      <>Proceed to Payment <ArrowRight className="w-4 h-4 ml-1.5" /></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ═══ STEP 3: Stripe Checkout Redirect ═══ */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="p-3 bg-indigo-50 inline-block rounded-2xl mb-4">
                    <CreditCard className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Secure Stripe Checkout</h1>
                  <p className="text-slate-500 text-sm mt-1.5">
                    Your account has been created. Complete payment via Stripe to activate your subscription.
                  </p>
                </div>

                {/* Order Summary */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-50/50">
                  <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-indigo-400" />
                      <span className="text-xs font-bold uppercase tracking-widest">Stripe Secure Checkout</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-slate-800 px-2.5 py-1 rounded-md text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      <Lock className="w-3 h-3" /> Stripe
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{planInfo.name}</p>
                        <p className="text-xs text-slate-500">{formData.companyName || 'Your Company'}</p>
                      </div>
                      <span className="text-2xl font-black text-indigo-500">${planInfo.price.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-slate-500 space-y-1 border-t border-slate-200 pt-3">
                      <p className="flex justify-between"><span>Subscription</span><span>${planInfo.price.toFixed(2)}/mo</span></p>
                      <p className="flex justify-between"><span>Secure processing by</span><span className="font-bold text-indigo-500">Stripe</span></p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Powered by Stripe Payment Links</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      You will be redirected to Stripe's secure, PCI-compliant checkout page. 
                      After successful payment, return here to access your dashboard.
                    </p>
                  </div>
                </div>

                {checkoutError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-bold">
                    {checkoutError}
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  <button
                    onClick={handleStripeRedirect}
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow-lg transition disabled:opacity-50"
                  >
                    {submitting ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Creating Checkout...</>
                    ) : (
                      <>Pay with Stripe <ExternalLink className="w-4 h-4 ml-2" /></>
                    )}
                  </button>

                  <div className="text-center border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400 mb-3 font-semibold">Already completed your payment?</p>
                    <button
                      onClick={handleReturnFromStripe}
                      className="inline-flex items-center justify-center py-2.5 px-5 rounded-xl font-bold text-xs text-white bg-emerald-500 hover:bg-emerald-600 shadow transition"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" /> Yes, Return to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ STEP 4: Final Setup ═══ */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="p-3 bg-indigo-50 inline-block rounded-2xl mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Final Setup</h1>
                  <p className="text-slate-500 text-sm mt-1.5">Activate your dedicated operations channel in Slack.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-4">
                    <div className="flex justify-center items-center space-x-2">
                      <MessageSquare className="w-8 h-8 text-[#E01E5A]" />
                      <span className="text-xl font-black text-slate-800">Slack</span>
                    </div>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">Connect your workspace for direct communication with your automation team.</p>
                    <button onClick={toggleSlackConnection}
                      className={`inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all duration-300 ${
                        formData.slackConnected 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                          : 'bg-[#4A154B] hover:bg-[#3B113C] text-white'
                      }`}>
                      {formData.slackConnected ? (
                        <><Check className="w-4 h-4 mr-1.5" /> Slack Connected!</>
                      ) : "Connect Slack Channel"}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="password">Set Portal Password</label>
                    <input type="password" name="password" id="password" placeholder="Choose a password"
                      value={formData.password} onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium" required />
                  </div>
                </div>

                <div className="pt-2">
                  <button onClick={handleCompleteOnboarding}
                    disabled={!formData.password || !formData.slackConnected || submitting}
                    className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? (
                      <><RefreshCw className="w-4 h-4 mr-1.5 animate-spin" /> Loading Dashboard...</>
                    ) : (
                      <>Launch Dashboard <CheckCircle2 className="w-4 h-4 ml-1.5" /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400 bg-white border-t border-slate-100">
        &copy; {new Date().getFullYear()} AutomateOS. Payments powered by Stripe.
      </footer>
    </div>
  );
}