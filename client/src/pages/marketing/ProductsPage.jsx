import React from 'react';
import { Link } from 'react-router-dom';
import {
  Network,
  Headphones,
  ShieldAlert,
  FileText,
  Sliders,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Server,
  ShieldCheck,
  Zap
} from 'lucide-react';

const products = [
  {
    code: 'nms',
    name: 'KavachIQ NMS',
    category: 'Network & Telemetry Observability',
    headline: 'Unified Network Performance, Topology & Traffic Analysis',
    desc: 'Autonomous multi-vendor SNMP v1/v2c/v3 monitoring, auto-generated Layer-2/3 physical link topology maps, NetFlow v5/v9 & IPFIX deep packet inspection, and real-time SLA thresholds.',
    icon: Network,
    color: 'bg-blue-600',
    editions: ['Standard', 'Professional', 'Enterprise', 'Ultimate'],
    capabilities: [
      'Automated dynamic network discovery with LLDP/CDP',
      'NetFlow/sFlow/IPFIX interface traffic decomposition',
      'Multi-tenant distributed polling engine (100k+ nodes)',
      'Custom threshold alerting with PagerDuty & Slack webhooks'
    ]
  },
  {
    code: 'itsm',
    name: 'KavachIQ ITSM',
    category: 'IT Service Management & Desk',
    headline: 'AI-Enhanced ITIL ServiceDesk & Asset Lifecycle Management',
    desc: 'Streamline enterprise IT service delivery with ITIL v4 certified Incident, Problem, Change, and Release Management workflows, paired with a real-time Configuration Management Database (CMDB).',
    icon: Headphones,
    color: 'bg-indigo-600',
    editions: ['Standard', 'Enterprise'],
    capabilities: [
      'Smart ticket triage with automated routing & categorization',
      'Multi-tiered SLA governance with automated escalation trees',
      'Change Advisory Board (CAB) approval matrix orchestration',
      'Unified CMDB dependency mapping across hardware & software'
    ]
  },
  {
    code: 'siem',
    name: 'KavachIQ SIEM',
    category: 'SecOps & Threat Intelligence',
    headline: 'Real-Time Threat Detection, MITRE ATT&CK & SOAR Automation',
    desc: 'Empower your SOC with multi-source log correlation, behavioral user anomaly detection (UEBA), automated incident response playbooks, and out-of-the-box regulatory compliance reporting.',
    icon: ShieldAlert,
    color: 'bg-amber-600',
    editions: ['Standard', 'Enterprise', 'Ultimate'],
    capabilities: [
      '1,200+ pre-built MITRE ATT&CK correlation rules',
      'Automated SOAR response playbooks (IP isolation, account lock)',
      'High-speed sub-second forensic search & timeline analysis',
      'One-click compliance reporting (PCI-DSS, ISO 27001, SOC 2)'
    ]
  },
  {
    code: 'syslog-manager',
    name: 'KavachIQ Syslog Manager',
    category: 'Centralized Log Aggregation',
    headline: 'High-Throughput Log Aggregation & Forensic Search Engine',
    desc: 'Ingest and parse massive volumes of system and network logs at sustained speeds exceeding 250,000 EPS. Features instant full-text filtering, Geo-IP enrichment, and cryptographic archival.',
    icon: FileText,
    color: 'bg-emerald-600',
    editions: ['Standard', 'Enterprise'],
    capabilities: [
      'Ultra high-throughput ingestion (> 250,000 events/sec)',
      'Real-time Geo-IP lookup and event severity tagging',
      'Automated multi-tier log retention (Hot / Warm / Cold Archival)',
      'Cryptographically sealed, tamper-evident log archives'
    ]
  },
  {
    code: 'config-manager',
    name: 'KavachIQ Config Manager',
    category: 'Network Automation & Governance',
    headline: 'Network Configuration, Change & Compliance Management (NCCM)',
    desc: 'Prevent unauthorized network changes, maintain immutable configuration version history, detect drift in real time, and audit devices against CIS Benchmarks and custom security policies.',
    icon: Sliders,
    color: 'bg-purple-700',
    editions: ['Standard', 'Enterprise'],
    capabilities: [
      'Automated scheduled & trigger-based config backups',
      'Side-by-side visual diff engine with syntax highlighting',
      'Instant configuration drift alerts and one-click rollback',
      'Automated CIS Benchmark and DISA STIG compliance audits'
    ]
  }
];

export const ProductsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">
            PRODUCT PORTFOLIO
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            The KavachIQ Commercial Software Suite
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Comprehensive, air-gap ready infrastructure intelligence and security software solutions designed for enterprise scale.
          </p>
        </div>
      </section>

      {/* Product List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="space-y-10">
          {products.map((prod) => {
            const Icon = prod.icon;
            return (
              <div
                key={prod.code}
                className="enterprise-card rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-12 h-12 rounded-2xl ${prod.color} text-white flex items-center justify-center shadow-sm shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">{prod.name}</h2>
                        <span className="text-xs font-mono text-gts-purple font-semibold">{prod.category}</span>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-800">{prod.headline}</p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{prod.desc}</p>

                    <div className="pt-2">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-3">
                        Key Capabilities:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                        {prod.capabilities.map((cap, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-gts-blue shrink-0 mt-0.5" />
                            <span>{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Card Panel */}
                  <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between h-full space-y-6">
                    <div>
                      <div className="text-xs font-mono uppercase text-slate-500 font-bold mb-2">Available Editions</div>
                      <div className="flex flex-wrap gap-1.5">
                        {prod.editions.map((ed) => (
                          <span key={ed} className="px-2.5 py-1 rounded-md bg-white text-slate-800 text-xs font-semibold border border-slate-200 shadow-subtle">
                            {ed}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Link
                        to={`/products/${prod.code}`}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gts-navy hover:bg-gts-darkest text-white font-bold text-xs shadow-sm transition-all"
                      >
                        <span>Explore Technical Specs</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <Link
                        to={`/get-started?product=${prod.code}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 transition-all"
                      >
                        Request 30-Day Trial
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
