import React from 'react';
import { Link } from 'react-router-dom';
import { Handshake, Building2, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const PartnersPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">
            PARTNER ECOSYSTEM
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            OEM, Distributor & MSP Partner Program
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Deliver market-leading infrastructure observability and security defense to your enterprise clients with lucrative margins and dedicated engineering support.
          </p>
        </div>
      </section>

      {/* Tiers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="enterprise-card p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-gts-purple flex items-center justify-center">
              <Handshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">OEM & Embedded</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Embed KavachIQ telemetry and SecOps engines directly into your specialized hardware appliances or software platforms.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gts-blue" /> White-label licensing</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gts-blue" /> Custom kernel & driver hooks</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gts-blue" /> Joint roadmap steering</div>
            </div>
          </div>

          <div className="enterprise-card p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-gts-purple flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">System Integrators</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Deliver turnkey data center, banking network, and defense modernization projects with certified KavachIQ architectures.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gts-blue" /> High commercial deal margins</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gts-blue" /> Presales architecture support</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gts-blue" /> Fast-track RFP protection</div>
            </div>
          </div>

          <div className="enterprise-card p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-gts-purple flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">MSSP / MSP Partners</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Offer 24x7 Managed Detection and Response (MDR) and NOC services with tenant-isolated dashboards and flexible consumption licensing.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gts-blue" /> Multi-tenant licensing pool</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gts-blue" /> Automated API tenant billing</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gts-blue" /> 24x7 Tier-3 escalation desk</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-gts-darkest p-8 sm:p-12 text-center text-white space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Join the GTS Technosoft AI Partner Network</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Contact our Global Alliances team to explore partnership tiers, access NFR demonstration licenses, and receive partner enablement materials.
          </p>
          <Link
            to="/get-started?type=partner"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gts-orange hover:bg-gts-orange-dark text-white font-bold text-xs shadow-glow-orange transition-all"
          >
            <span>Apply for Partner Authorization</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
