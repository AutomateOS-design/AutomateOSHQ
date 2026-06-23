import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  User, 
  Briefcase, 
  Check, 
  Layers, 
  Compass, 
  Settings, 
  Sparkles,
  ChevronLeft,
  CreditCard,
  Lock,
  ShieldCheck,
  RefreshCw,
  Phone
} from 'lucide-react';

export default function OnboardingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedPlan = searchParams.get('plan') || 'starter';

  const [step, setStep] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    useCases: [],
    firstRequest: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardZip: '',
    password: '',
    slackConnected: false
  });

  const plans = {
    starter: { 
      name: 'Starter Flow', 
      price: 999, 
      tagline: 'Stop copying. Start scaling.',
      description: 'The perfect entry point to eliminate your most painful manual tasks.'
    },
    growth: { 
      name: 'Growth Engine', 
      price: 2499, 
      tagline: 'Workflows that think. Systems that scale.',
      description: 'Five intelligent workflows with AI document extraction, smart replies, and DB syncs.'
    },
    dedicated: { 
      name: 'Dedicated Retainer', 
      price: 4999, 
      tagline: 'Your business, fully automated. Your team, fully focused.',
      description: 'An entire automation department dedicated to your business.'
    }
  };

  const planInfo = plans[selectedPlan] || plans.starter;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    // Format card number with spaces (e.g., 4444 4444 4444 4444)
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 4);
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    setFormData(prev => ({ ...prev, cardExpiry: value }));
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setFormData(prev => ({ ...prev, cardCvc: value }));
  };

  const handleCheckboxChange = (tool) => {
    setFormData(prev => {
      const current = [...prev.useCases];
      const index = current.indexOf(tool);
      if (index > -1) {
        current.splice(index, 1);
      } else {
        current.push(tool);
      }
      return { ...prev, useCases: current };
    });
  };

  const handleNextStep = () => {
    if (step === 3) {
      // Simulate payment processing
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
        setPaymentSuccess(true);
        setTimeout(() => {
          setStep(4);
        }, 1500);
      }, 2000);
    } else if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      // Create and save new client in localStorage
      const clientId = 'client-' + Date.now();
      
      const newClient = {
        id: clientId,
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
      };

      // Read current clients or initialize them
      let storedClients = [];
      try {
        storedClients = JSON.parse(localStorage.getItem('automateos_clients') || '[]');
      } catch (e) {
        storedClients = [];
      }
      
      // If empty, initialize standard clients first
      if (storedClients.length === 0) {
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
        storedClients = [...defaultClients];
      }

      storedClients.push(newClient);
      localStorage.setItem('automateos_clients', JSON.stringify(storedClients));
      localStorage.setItem('automateos_current_client_id', clientId);

      // Create and save First Request if it was filled
      if (formData.firstRequest && formData.firstRequest.trim() !== '') {
        let storedRequests = [];
        try {
          storedRequests = JSON.parse(localStorage.getItem('automateos_requests') || '[]');
        } catch (e) {
          storedRequests = [];
        }

        const newRequest = {
          id: Date.now(),
          clientId: clientId,
          clientName: formData.companyName || 'New Business Ltd',
          title: formData.firstRequest,
          type: 'Onboarding Request',
          tools: formData.useCases || ['Custom Integration'],
          status: 'Pending',
          hoursSaved: 0,
          runs: 0,
          updated: 'Just now',
          submitted: 'Just now'
        };

        storedRequests.unshift(newRequest);
        localStorage.setItem('automateos_requests', JSON.stringify(storedRequests));
      }

      // Dispatch change event to notify other open tabs
      window.dispatchEvent(new Event('storage'));

      // Navigate to dashboard with client session preloaded
      navigate(`/dashboard?onboarded=true&clientId=${clientId}&plan=${selectedPlan}`);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const toggleSlackConnection = () => {
    setFormData(prev => ({ ...prev, slackConnected: !prev.slackConnected }));
  };

  const toolsList = [
    'Slack', 'Salesforce', 'HubSpot', 'Airtable', 'Notion', 
    'Google Sheets', 'Gmail / Email', 'Stripe', 'OpenAI (GPT-4)', 'Typeform / Webforms'
  ];

  const subtotal = planInfo.price;
  const tax = 0.00;
  const total = subtotal + tax;

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

      {/* Main Container */}
      <main className="flex-grow py-12 flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto px-4">
          
          {/* Progress Indicator */}
          <div className="mb-8 flex justify-between items-center px-4">
            <div className="flex items-center w-full">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step >= 1 ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-200 text-slate-600'
              }`}>
                1
              </div>
              <div className={`flex-grow h-1 transition-all duration-300 ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step >= 2 ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-200 text-slate-600'
              }`}>
                2
              </div>
              <div className={`flex-grow h-1 transition-all duration-300 ${step >= 3 ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step >= 3 ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-200 text-slate-600'
              }`}>
                3
              </div>
              <div className={`flex-grow h-1 transition-all duration-300 ${step >= 4 ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step >= 4 ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-200 text-slate-600'
              }`}>
                4
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-10 transition-all duration-300 relative overflow-hidden">
            
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Confirm Your Plan</h1>
                  <p className="text-slate-500 text-sm mt-1.5">Let's set up your profile and confirm your billing choice.</p>
                </div>

                {/* Selected Plan Summary */}
                <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex justify-between items-center relative overflow-hidden">
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
                      <input 
                        type="text" 
                        name="companyName" 
                        id="companyName" 
                        placeholder="e.g. Acme Agency" 
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="pl-11 w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="contactName">Contact Person</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input 
                        type="text" 
                        name="contactName" 
                        id="contactName" 
                        placeholder="e.g. Sarah Jenkins" 
                        value={formData.contactName}
                        onChange={handleInputChange}
                        className="pl-11 w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="email">Work Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="sarah@acme.com" 
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="phone">Phone Number</label>
                      <div className="relative">
                        <input 
                          type="tel" 
                          name="phone" 
                          id="phone" 
                          placeholder="+1 (555) 019-2834" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleNextStep}
                  disabled={!formData.companyName || !formData.contactName || !formData.email}
                  className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Request <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Your First Request</h1>
                  <p className="text-slate-500 text-sm mt-1.5">Explain your first workflow idea. We will build this immediately.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Which platforms are in your tech stack?</label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1.5 border border-slate-100 rounded-lg">
                      {toolsList.map((tool) => (
                        <label 
                          key={tool} 
                          className={`flex items-center p-2 rounded-lg border text-xs font-semibold cursor-pointer transition select-none ${
                            formData.useCases.includes(tool) 
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-500' 
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={formData.useCases.includes(tool)} 
                            onChange={() => handleCheckboxChange(tool)} 
                            className="hidden"
                          />
                          <Check className={`w-3.5 h-3.5 mr-2 transition-all ${
                            formData.useCases.includes(tool) ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                          }`} />
                          {tool}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="firstRequest">Describe your first automation goal</label>
                    <textarea 
                      name="firstRequest" 
                      id="firstRequest" 
                      rows="4"
                      placeholder="e.g. We want to auto-extract attachment PDFs from 'inbound@acme.com', use AI to summarize, write the items into an Airtable list, and notify us in a Slack channel." 
                      value={formData.firstRequest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm resize-none font-medium leading-relaxed"
                      required
                    ></textarea>
                    <p className="text-slate-400 text-[11px] font-semibold mt-1">Don't worry about the technical details; just outline what you want to achieve.</p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button 
                    onClick={handlePrevStep}
                    className="w-1/3 inline-flex items-center justify-center py-3.5 px-4 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                  <button 
                    onClick={handleNextStep}
                    disabled={!formData.firstRequest}
                    className="w-2/3 inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to Payment <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fadeIn relative">
                
                {/* Simulated Payment Overlay */}
                {isProcessingPayment && (
                  <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center space-y-4">
                    <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
                    <p className="text-sm font-bold text-slate-800 uppercase tracking-widest">Connecting to Stripe Secure Socket...</p>
                    <p className="text-xs text-slate-400 font-semibold">Authorizing test subscription payment...</p>
                  </div>
                )}

                {paymentSuccess && (
                  <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center space-y-4 animate-scaleUp">
                    <div className="p-3 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-500">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <p className="text-lg font-black text-slate-900 tracking-tight">Payment Successful!</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Subscription payment authorized by Stripe sandbox</p>
                  </div>
                )}

                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Stripe Test Checkout</h1>
                  <p className="text-slate-500 text-sm mt-1.5">Secure sandbox environment. Press "Subscribe & Pay" to test.</p>
                </div>

                {/* Stripe Checkout Card UI */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-50/50">
                  <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-indigo-400" />
                      <span className="text-xs font-bold uppercase tracking-widest">Secure Order Summary</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-slate-800 px-2.5 py-1 rounded-md text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      <Lock className="w-3 h-3" /> SSL Secured
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Items detail list */}
                    <div className="space-y-2 border-b border-slate-200/80 pb-3 text-xs font-medium">
                      <div className="flex justify-between">
                        <span className="text-slate-500">AutomateOS {planInfo.name} Subscription (1 Month)</span>
                        <span className="text-slate-900 font-bold">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Estimated Setup & Integration Tax (VAT)</span>
                        <span className="text-slate-900 font-bold">${tax.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-sm font-black text-slate-900 uppercase tracking-wider">Grand Total</span>
                      <span className="text-2xl font-black text-indigo-500">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Credit Card inputs */}
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Card Details (Simulated)</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="4242 4242 4242 4242 (Stripe Standard)" 
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        className="pl-11 w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Expiry</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={formData.cardExpiry}
                        onChange={handleExpiryChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium text-center"
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">CVC</label>
                      <input 
                        type="password" 
                        placeholder="123" 
                        value={formData.cardCvc}
                        onChange={handleCvcChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium text-center"
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Zip Code</label>
                      <input 
                        type="text" 
                        name="cardZip"
                        placeholder="90210" 
                        value={formData.cardZip}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium text-center"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-2 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] font-semibold text-slate-500">
                  <ShieldCheck className="w-4.5 h-4.5 text-indigo-500" />
                  <span>Payments fully integrated with official Stripe sandbox environment</span>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button 
                    onClick={handlePrevStep}
                    className="w-1/3 inline-flex items-center justify-center py-3.5 px-4 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                  <button 
                    onClick={handleNextStep}
                    disabled={!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc || !formData.cardZip}
                    className="w-2/3 inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Subscribe & Pay <CreditCard className="w-4 h-4 ml-1.5" />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center">
                  <div className="p-3 bg-indigo-50 inline-block rounded-2xl mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Final Setup</h1>
                  <p className="text-slate-500 text-sm mt-1.5">Activate your dedicated operations channel in Slack.</p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Slack Connection Button */}
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-4">
                    <div className="flex justify-center items-center space-x-2">
                      <MessageSquare className="w-8 h-8 text-[#E01E5A]" />
                      <span className="text-xl font-black text-slate-800">Slack</span>
                    </div>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">We will establish a dedicated support channel in your workspace where you can message your automation team directly.</p>
                    
                    <button 
                      onClick={toggleSlackConnection}
                      className={`inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all duration-300 ${
                        formData.slackConnected 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                          : 'bg-[#4A154B] hover:bg-[#3B113C] text-white'
                      }`}
                    >
                      {formData.slackConnected ? (
                        <>
                          <Check className="w-4 h-4 mr-1.5" /> Slack Workspace Connected!
                        </>
                      ) : (
                        "Connect Slack Channel"
                      )}
                    </button>
                  </div>

                  {/* Password Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="password">Set Portal Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      id="password" 
                      placeholder="••••••••••••" 
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition outline-none text-sm font-medium"
                      required
                    />
                    <p className="text-slate-400 text-[11px] font-semibold mt-1">You will use this password to access your secure client portal.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleNextStep}
                    disabled={!formData.password || !formData.slackConnected}
                    className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Launch Dashboard <CheckCircle2 className="w-4 h-4 ml-1.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 bg-white border-t border-slate-100">
        &copy; {new Date().getFullYear()} AutomateOS. Secured & encrypted client setup.
      </footer>
    </div>
  );
}
