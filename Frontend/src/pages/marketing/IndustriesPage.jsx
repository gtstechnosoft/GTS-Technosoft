import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Radio, Shield, HeartPulse, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

const industries = [
  {
    icon: Landmark,
    title: 'Banking, Financial Services & Insurance (BFSI)',
    desc: 'High-frequency core banking networks and transaction switches require microsecond latency precision and strict regulatory compliance (RBI Cyber Security, PCI-DSS, SOC 2).',
    bullets: ['Air-gapped on-premise deployment', 'Real-time NetFlow transaction monitoring', 'Tamper-proof audit logs for RBI audits']
  },
  {
    icon: Radio,
    title: 'Telecommunications & 5G Service Providers',
    desc: 'Carrier-grade scalability for nationwide MPLS backbones, 5G core routers, and cell-site aggregation gateways with distributed polling fleets.',
    bullets: ['100,000+ nodes per poller instance', 'sFlow & IPFIX carrier traffic sampling', 'BGP route flapping & peering SLA tracker']
  },
  {
    icon: Shield,
    title: 'Defense, Aerospace & Government',
    desc: 'Sovereign data sovereignty requirements and restricted classification levels. Zero external SaaS dependencies or cloud callbacks.',
    bullets: ['100% offline cryptographic license keys', 'DISA STIG and CIS Benchmark enforcement', 'Role-based compartmentalized access']
  },
  {
    icon: HeartPulse,
    title: 'Healthcare & Hospital Networks',
    desc: 'Safeguard medical telemetry devices, PACS imaging systems, and patient databases against ransomware and unauthorized lateral movement.',
    bullets: ['HIPAA compliant log archival', 'Medical device VLAN isolation alerts', 'Sub-second incident triage']
  },
  {
    icon: Building2,
    title: 'Managed Service Providers (MSPs / MSSPs)',
    desc: 'Multi-tenant architecture allowing managed service providers to centrally monitor hundreds of distinct client organizations with segregated RBAC.',
    bullets: ['Tenant-isolated billing and metric pools', 'Custom white-label reporting exports', 'Partner API for automated client onboarding']
  }
];

export const IndustriesPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">
            TARGET VERTICALS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Purpose-Built for Mission-Critical Sectors
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From sovereign defense networks to tier-1 investment banks, KavachIQ powers the world’s most demanding digital infrastructures.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <div
                key={i}
                className="enterprise-card p-8 rounded-3xl flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-gts-purple flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{ind.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{ind.desc}</p>
                  <div className="space-y-2 pt-2">
                    {ind.bullets.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-gts-blue shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/get-started"
                    className="text-xs font-bold text-gts-purple hover:text-gts-orange transition-colors flex items-center gap-1.5"
                  >
                    <span>Request Industry Briefing</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sovereign Guarantee Banner */}
      <section className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-2xl">
          <h3 className="text-2xl font-bold text-slate-900">National Sovereign Technology Mandate</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All GTS Technosoft AI software is developed 100% in India, operates strictly air-gapped without mandatory cloud callbacks, and complies with national security data protection mandates.
          </p>
        </div>
      </section>
    </div>
  );
};
