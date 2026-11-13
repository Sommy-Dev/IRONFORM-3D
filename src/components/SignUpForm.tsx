import React, { useState, useEffect } from 'react';
import { CheckCircle2, User, Mail, Phone, Calendar, ArrowRight, RotateCcw } from 'lucide-react';
import { PlanId } from '../types';

interface SignUpFormProps {
  selectedPlan: PlanId;
  onPlanChange: (plan: PlanId) => void;
  prefilledNote?: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  selectedPlan,
  onPlanChange,
  prefilledNote,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('morning');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    plan: PlanId;
    passCode: string;
  } | null>(null);

  useEffect(() => {
    if (prefilledNote) {
      setNote(prefilledNote);
    }
  }, [prefilledNote]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+() -]{10,18}$/.test(phone.trim())) {
      newErrors.phone = 'Please provide a valid phone number (e.g. 0803 123 4567)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, phone: true });

    if (validate()) {
      // Generate clean sample pass code
      const randomCode = `IF-OWR-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedData({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        plan: selectedPlan,
        passCode: randomCode,
      });
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setNote('');
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  const planLabels: Record<PlanId, string> = {
    'free-trial': '7-Day Free Trial (₦0)',
    'day-pass': 'Day Pass (₦5,000 / day)',
    'monthly': 'Monthly All-Access (₦45,000 / mo)',
    'annual': 'Annual Elite (₦450,000 / yr)',
  };

  return (
    <section id="signup" className="py-20 md:py-28 bg-[#0B0F14] border-t border-[#1F2937]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-display tracking-widest text-[#A3E635] uppercase font-semibold mb-2">
            <span>Fast Client-Side Registration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white text-balance">
            LOCK IN YOUR SPOT AT IRONFORM
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Reserve your access pass in 30 seconds. No card required upfront. 
            Bring your pass code to our reception at New Owerri.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 sm:p-10 shadow-xl">
          {isSubmitted && submittedData ? (
            /* Thank You Card */
            <div className="text-center py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-[#A3E635]/10 border border-[#A3E635] text-[#A3E635] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  THANK YOU, {submittedData.fullName.toUpperCase()}!
                </h3>
                <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-lg mx-auto">
                  Your pass reservation for{' '}
                  <span className="text-[#A3E635] font-semibold">
                    {planLabels[submittedData.plan]}
                  </span>{' '}
                  has been verified!
                </p>
              </div>

              {/* Pass confirmation badge */}
              <div className="bg-[#0B0F14] border border-[#374151] rounded-md p-5 max-w-md mx-auto text-left space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-display">
                  <span>FACILITY PASS ID</span>
                  <span className="text-[#A3E635] font-bold tracking-widest tabular-nums">
                    {submittedData.passCode}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Registered Phone:</span>
                  <span className="font-semibold">{submittedData.phone}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Location:</span>
                  <span>Plot 14, Commercial Blvd, New Owerri</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Power Guarantee:</span>
                  <span className="text-[#A3E635]">24/7 Active Inverter & Gen</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 max-w-md mx-auto">
                Simply mention your name or show code <strong className="text-white">{submittedData.passCode}</strong> at the front desk when you arrive for your first workout session.
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#181C21] hover:bg-[#1F2937] text-white border border-[#374151] text-xs font-display uppercase tracking-wider font-semibold rounded-md transition-all active:scale-[0.98]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Register Another Athlete</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Registration Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              
              {/* Plan Selector */}
              <div>
                <label className="block text-xs font-display font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Selected Membership / Pass Tier *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(['free-trial', 'day-pass', 'monthly', 'annual'] as PlanId[]).map((planId) => {
                    const isCurrent = selectedPlan === planId;
                    return (
                      <button
                        key={planId}
                        type="button"
                        onClick={() => onPlanChange(planId)}
                        className={`p-3 rounded-md text-left transition-all border ${
                          isCurrent
                            ? 'bg-[#181C21] border-[#A3E635] text-white shadow-sm'
                            : 'bg-[#0B0F14] border-[#1F2937] text-slate-400 hover:text-slate-200 hover:border-[#374151]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-display font-bold">
                            {planId === 'free-trial' && 'Free Trial'}
                            {planId === 'day-pass' && 'Day Pass'}
                            {planId === 'monthly' && 'Monthly'}
                            {planId === 'annual' && 'Annual Elite'}
                          </span>
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isCurrent ? 'border-[#A3E635] bg-[#A3E635]' : 'border-slate-600'
                            }`}
                          >
                            {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#0B0F14]" />}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {planId === 'free-trial' && '7 Days Full Access'}
                          {planId === 'day-pass' && '₦5,000 / day'}
                          {planId === 'monthly' && '₦45,000 / mo'}
                          {planId === 'annual' && '₦450,000 / yr'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-display font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="e.g. Chinedu Eze"
                    aria-invalid={touched.fullName && !!errors.fullName}
                    aria-describedby={touched.fullName && errors.fullName ? 'fullName-error' : undefined}
                    className={`w-full pl-10 pr-4 py-3 bg-[#0B0F14] text-white text-sm rounded-md border transition-colors placeholder:text-slate-600 focus:outline-none ${
                      touched.fullName && errors.fullName
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#1F2937] focus:border-[#A3E635]'
                    }`}
                  />
                </div>
                {touched.fullName && errors.fullName && (
                  <p id="fullName-error" className="text-xs text-red-400 mt-1 font-medium">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Grid: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-xs font-display font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur('email')}
                      placeholder="chinedu@example.com"
                      aria-invalid={touched.email && !!errors.email}
                      aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                      className={`w-full pl-10 pr-4 py-3 bg-[#0B0F14] text-white text-sm rounded-md border transition-colors placeholder:text-slate-600 focus:outline-none ${
                        touched.email && errors.email
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-[#1F2937] focus:border-[#A3E635]'
                      }`}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p id="email-error" className="text-xs text-red-400 mt-1 font-medium">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-display font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Phone Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      placeholder="0803 123 4567 or +234..."
                      aria-invalid={touched.phone && !!errors.phone}
                      aria-describedby={touched.phone && errors.phone ? 'phone-error' : undefined}
                      className={`w-full pl-10 pr-4 py-3 bg-[#0B0F14] text-white text-sm rounded-md border transition-colors placeholder:text-slate-600 focus:outline-none ${
                        touched.phone && errors.phone
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-[#1F2937] focus:border-[#A3E635]'
                      }`}
                    />
                  </div>
                  {touched.phone && errors.phone && (
                    <p id="phone-error" className="text-xs text-red-400 mt-1 font-medium">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Preferred Workout Window */}
              <div>
                <label className="block text-xs font-display font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Preferred Training Slot
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'morning', label: 'Early (5:30 - 8:30 AM)' },
                    { id: 'midday', label: 'Midday (11:00 AM - 3:00 PM)' },
                    { id: 'evening', label: 'Evening (5:00 - 9:30 PM)' },
                  ].map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setPreferredTime(slot.id)}
                      className={`py-2 px-3 rounded text-xs font-medium border text-center transition-all ${
                        preferredTime === slot.id
                          ? 'bg-[#181C21] border-[#A3E635] text-[#A3E635]'
                          : 'bg-[#0B0F14] border-[#1F2937] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Focus / Note (Optional) */}
              <div>
                <label htmlFor="note" className="block text-xs font-display font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Fitness Goal or Coach Preference (Optional)
                </label>
                <input
                  id="note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Strength & Hypertrophy class with Coach Emeka"
                  className="w-full px-4 py-2.5 bg-[#0B0F14] text-white text-sm rounded-md border border-[#1F2937] focus:border-[#A3E635] transition-colors placeholder:text-slate-600 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 text-sm uppercase font-semibold font-display tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] transition-all rounded-md shadow-lg shadow-[#A3E635]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>Submit & Lock In Reservation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  Client-side instant registration. No credit card required. Free cancellation at any time.
                </p>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  );
};
