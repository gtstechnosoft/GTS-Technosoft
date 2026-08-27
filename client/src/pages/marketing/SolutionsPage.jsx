import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Network, Zap, Cloud, CheckCircle2, Lock, Cpu, ArrowRight, ShieldCheck, Server, RefreshCw } from 'lucide-react';

const solutions = [
  {
    title: 'Hybrid Cloud Infrastructure Observability',
    subtitle: 'Unified Single-Pane Monitoring for AWS, Azure, VMware & Bare-Metal',
    desc: 'Eliminate monitoring silos. KavachIQ seamlessly correlates physical switch metrics, virtualization hypervisor statistics, and cloud VPC flow logs into a unified topology graph.',
    benefits: [
      'Zero-agent and lightweight daemon hybrid collection',
      'Cross-cloud SLA and latency decomposition',
      'Dynamic inventory sync with automated de-provisioning detection'
    ],
    icon: Cloud
  },
  {
    title: 'Zero-Trust SOC & Threat Defense',
    subtitle: 'High-Speed Multi-Layer Correlation & Incident Containment',
    desc: 'Empower incident responders with unified SIEM detection and Syslog aggregation. Correlate perimeter firewall drops, host authentication spikes, and endpoint process mutations.',
    benefits: [
      'Automated IP quarantine and credential invalidation triggers',
      'Sub-second query performance on billion-row log datasets',
      'Strict cryptographic audit logging for forensic admissibility'
    ],
    icon: ShieldCheck
  },
  {
    title: 'Automated ITIL Service Governance',
    subtitle: 'Next-Generation ServiceDesk with Integrated CMDB & Change Control',
    desc: 'Bridge the gap between NetOps, SecOps, and IT Service Management. Incidents automatically associate affected Configuration Items (CIs), enabling rapid root cause determination.',
    benefits: [
      'Bi-directional synchronization between NMS alerts and ITSM tickets',
      'Automated CAB change collision warnings',
      'Strict multi-tier SLA escalation matrix with executive reporting'
    ],
    icon: RefreshCw
  },
  {
    title: 'Network Configuration Compliance & Drift Elimination',
    subtitle: 'Zero-Touch Provisioning, Immutable Backups & Hardening Audits',
    desc: 'Guarantee 100% policy compliance across enterprise switching and routing estates. Automatically detect out-of-band changes and enforce CIS security benchmarks.',
    benefits: [
      'Automated nightly and syslog-triggered config snapshotting',
      'Instant visual diff comparison with syntax coloring',
      'Emergency one-click mass configuration push'
    ],
    icon: Server
  }
];

export const SolutionsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">
            ENTERPRISE SOLUTIONS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Architected for Complex, High-Stakes Environments
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            How GTS Technosoft AI and KavachIQ resolve mission-critical observability, SecOps, and governance challenges across enterprise infrastructure.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((sol, i) => {
            const Icon = sol.icon;
            return (
              <div
                key={i}
                className="enterprise-card p-8 sm:p-10 rounded-3xl space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-gts-purple flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-gts-orange font-bold uppercase">
                      Solution #{i + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{sol.title}</h3>
                    <p className="text-xs font-semibold text-gts-blue mt-1">{sol.subtitle}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{sol.desc}</p>

                  <div className="pt-2 space-y-2.5">
                    {sol.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-gts-blue shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/get-started"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gts-purple hover:text-gts-orange transition-colors"
                  >
                    <span>Request Solution Architecture Blueprint</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gts-darkest py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Need a Customized Architecture for Your Data Center?</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Our Principal Architects collaborate with enterprise teams to design high-throughput telemetry pipelines that fit unique air-gap and sovereignty requirements.
          </p>
          <Link
            to="/get-started"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gts-orange hover:bg-gts-orange-dark text-white font-bold text-xs shadow-glow-orange transition-all"
          >
            <span>Schedule Architecture Review</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
