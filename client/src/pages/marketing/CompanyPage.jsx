import React from 'react';
import { Shield, Award, Globe, Users, Lock, CheckCircle2, Mail, MapPin, Building2 } from 'lucide-react';

export const CompanyPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">
            ABOUT THE OEM
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            GTS TECHNOSOFT AI LLP
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Building sovereign, high-throughput software solutions for enterprise infrastructure observability, ITIL service operations, and zero-trust security defense.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="enterprise-card p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-gts-purple">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Sovereignty & Air-Gap</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We believe mission-critical infrastructure must remain sovereign. Our software operates 100% on-premises without mandatory cloud connectivity or data leakage risks.
            </p>
          </div>

          <div className="enterprise-card p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-gts-purple">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Cryptographic Integrity</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every license, binary update, and audit record is cryptographically signed and verifiable using standard HSM/KMS infrastructure to guarantee absolute tamper detection.
            </p>
          </div>

          <div className="enterprise-card p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-gts-purple">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Engineered for Extreme Scale</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              From 250,000 EPS syslog streams to 100,000+ SNMP network interfaces, KavachIQ engines are optimized for microsecond throughput with linear CPU efficiency.
            </p>
          </div>
        </div>

        {/* Corporate Info & Locations */}
        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12 space-y-8">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">CORPORATE IDENTITY</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Enterprise OEM Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600">
            <div className="space-y-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gts-blue" />
                <span>Legal Entity</span>
              </div>
              <div className="font-semibold text-slate-900">GTS TECHNOSOFT AI LLP</div>
              <div className="text-slate-500">Incorporated Enterprise Software OEM</div>
              <div className="text-gts-purple font-mono font-bold">Domain: gtstech.ai</div>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gts-blue" />
                <span>R&D & Engineering Centers</span>
              </div>
              <div><strong>India Headquarters:</strong> Mumbai & Bengaluru</div>
              <div><strong>APAC Alliances:</strong> Singapore Central</div>
              <div className="text-slate-500">Global Customer TAC Support 24x7</div>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-gts-blue" />
                <span>Direct Commercial Contact</span>
              </div>
              <div>General: <a href="mailto:contact@gtstech.ai" className="text-gts-blue hover:underline">contact@gtstech.ai</a></div>
              <div>Licensing: <a href="mailto:licensing@gtstech.ai" className="text-gts-blue hover:underline">licensing@gtstech.ai</a></div>
              <div>Support: <a href="mailto:support@gtstech.ai" className="text-gts-blue hover:underline">support@gtstech.ai</a></div>
            </div>
          </div>
        </div>

        {/* Security & Compliance Section */}
        <div id="security" className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">SECURITY & COMPLIANCE</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Trust, Privacy & Sovereign Governance</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-subtle">
              <div className="font-bold text-slate-900 text-base">ISO 27001 Certified</div>
              <p className="text-slate-600 text-xs leading-relaxed">Information Security Management System policies strictly audited across all software release pipelines.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-subtle">
              <div className="font-bold text-slate-900 text-base">SOC 2 Type II Audited</div>
              <p className="text-slate-600 text-xs leading-relaxed">Verified security, availability, processing integrity, confidentiality, and privacy operational controls.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-subtle">
              <div className="font-bold text-slate-900 text-base">GDPR & DPDP Aligned</div>
              <p className="text-slate-600 text-xs leading-relaxed">Strict adherence to Indian Digital Personal Data Protection Act and EU GDPR privacy regulations.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-subtle">
              <div className="font-bold text-slate-900 text-base">CERT-In Aligned Logging</div>
              <p className="text-slate-600 text-xs leading-relaxed">6-month immutable log retention capability engineered natively into KavachIQ Syslog Manager.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
