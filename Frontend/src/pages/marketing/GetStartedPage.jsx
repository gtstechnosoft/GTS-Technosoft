import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { leadApi } from '../../api/endpoints';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Shield, Sparkles, CheckCircle2, Building2, Mail, User, Phone, Briefcase, Server, ArrowRight } from 'lucide-react';

export const GetStartedPage = () => {
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    jobTitle: '',
    productInterest: 'Full KavachIQ Enterprise Suite',
    fleetSize: '250-1000 nodes',
    requestType: 'DEMO',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const productParam = searchParams.get('product');
    const typeParam = searchParams.get('type');

    if (productParam) {
      const map = {
        nms: 'KavachIQ NMS',
        itsm: 'KavachIQ ITSM',
        siem: 'KavachIQ SIEM',
        'syslog-manager': 'KavachIQ Syslog Manager',
        'config-manager': 'KavachIQ Config Manager'
      };
      if (map[productParam]) {
        setFormData((prev) => ({ ...prev, productInterest: map[productParam] }));
      }
    }

    if (typeParam === 'partner') {
      setFormData((prev) => ({ ...prev, requestType: 'PARTNER_INQUIRY' }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.company) {
      toast.error('Please complete all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await leadApi.submit(formData);
      if (res.data?.success) {
        setSubmitted(true);
        toast.success('Your request has been successfully submitted!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">
            FAST-TRACK ENTERPRISE ACCESS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            See KavachIQ in Action
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Connect with a GTS Solution Architect for an interactive technical demonstration, or request a 30-day proof-of-concept cryptographic license key.
          </p>
        </div>
      </section>

      {/* Main 2-Column Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Explanation Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">
                Tailored for Sovereign & High-Throughput Operations
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Whether deploying in an air-gapped defense enclave, a Tier-1 banking datacenter, or a nationwide telecom backbone, KavachIQ scales without cloud dependency.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-gts-purple shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold mb-0.5">Custom Live Demo:</strong>
                  <p className="text-slate-600 text-xs leading-relaxed">Explore high-throughput polling, MITRE correlation rules, and automated ITIL workflows tailored to your infrastructure topology.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-gts-purple shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold mb-0.5">Air-Gapped POC Evaluation:</strong>
                  <p className="text-slate-600 text-xs leading-relaxed">Test KavachIQ in your own secure sandbox with an offline cryptographic license container.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-gts-purple shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold mb-0.5">Already a Licensed Customer?</strong>
                  <p className="text-slate-600 text-xs leading-relaxed">Sign in to your Customer Portal to manage active licenses, download installers, and view telemetry instances.</p>
                  <Link to="/login" className="text-gts-purple font-bold hover:underline inline-flex items-center gap-1 mt-1 text-xs">
                    Go to Customer Portal <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <div className="enterprise-card rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-card relative">
              {submitted ? (
                <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">Thank You, {formData.fullName}!</h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Your request for <strong className="text-gts-purple">{formData.productInterest}</strong> has been logged in our enterprise dispatch queue. A GTS Solution Architect will contact you at <strong className="text-slate-900">{formData.email}</strong> within 2 business hours.
                    </p>
                  </div>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      to="/login"
                      className="px-6 py-2.5 rounded-xl bg-gts-navy text-white font-bold text-xs shadow-sm hover:bg-gts-darkest"
                    >
                      Customer Portal Login
                    </Link>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-bold text-slate-900">Request Technical Briefing or POC</h3>
                    <p className="text-xs text-slate-500 mt-1">Please provide your corporate details to receive access credentials.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Vikram Malhotra"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gts-purple focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Corporate Work Email <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="v.malhotra@company.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gts-purple focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Company / Organization <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          name="company"
                          required
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Acro Corp Global"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gts-purple focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98201 00000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gts-purple focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Product Interest
                      </label>
                      <select
                        name="productInterest"
                        value={formData.productInterest}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-gts-purple focus:bg-white transition-colors"
                      >
                        <option value="Full KavachIQ Enterprise Suite">Full KavachIQ Enterprise Suite</option>
                        <option value="KavachIQ NMS">KavachIQ NMS (Network Observability)</option>
                        <option value="KavachIQ ITSM">KavachIQ ITSM (ServiceDesk & CMDB)</option>
                        <option value="KavachIQ SIEM">KavachIQ SIEM (Threat Detection & SOAR)</option>
                        <option value="KavachIQ Syslog Manager">KavachIQ Syslog Manager (Log Archival)</option>
                        <option value="KavachIQ Config Manager">KavachIQ Config Manager (NCCM)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Infrastructure Fleet Size
                      </label>
                      <select
                        name="fleetSize"
                        value={formData.fleetSize}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-gts-purple focus:bg-white transition-colors"
                      >
                        <option value="50-250 nodes">50 - 250 nodes / devices</option>
                        <option value="250-1000 nodes">250 - 1,000 nodes / devices</option>
                        <option value="1000-5000 nodes">1,000 - 5,000 nodes</option>
                        <option value="5000+ nodes">5,000+ nodes (Enterprise Scale)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Request Intent
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { id: 'DEMO', label: '1-on-1 Demo' },
                        { id: 'TRIAL', label: '30-Day Trial' },
                        { id: 'PARTNER_INQUIRY', label: 'Partner Inquiry' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, requestType: t.id }))}
                          className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                            formData.requestType === t.id
                              ? 'bg-purple-50 border-gts-purple text-gts-purple font-bold shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Specific Architecture Requirements or Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your current monitoring stack, number of data centers, or compliance goals..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gts-purple focus:bg-white resize-none transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="orange"
                    size="lg"
                    isLoading={submitting}
                    className="w-full shadow-glow-orange font-bold text-sm"
                  >
                    Submit Request & Dispatch Briefing
                  </Button>

                  <p className="text-[11px] text-slate-500 text-center font-mono">
                    GTS Technosoft AI LLP respects your privacy. No spam. Protected by Enterprise NDA.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
