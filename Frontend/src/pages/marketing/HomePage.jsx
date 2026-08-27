import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NetworkTopologyVisualizer } from '../../components/telemetry/NetworkTopologyVisualizer';
import {
  Network,
  Headphones,
  ShieldAlert,
  FileText,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Server,
  Lock,
  ChevronRight,
  Sparkles,
  Play,
  Layers,
  Award,
  Globe2,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Eye,
  Radio,
  Landmark,
  Building2,
  Database
} from 'lucide-react';

const products = [
  {
    name: 'KavachIQ NMS',
    slug: 'nms',
    icon: Network,
    badge: 'Network Observability',
    headline: 'High-Density Hybrid Infrastructure Management',
    desc: 'Distributed polling engines capable of monitoring 250,000+ interfaces with sub-second NetFlow v9/IPFIX analysis and topological auto-discovery.',
    color: 'bg-blue-600',
    stat: '250k+',
    statLabel: 'Polled Interfaces/sec'
  },
  {
    name: 'KavachIQ ITSM',
    slug: 'itsm',
    icon: Headphones,
    badge: 'ITIL ServiceDesk',
    headline: 'AI-Orchestrated Enterprise Operations',
    desc: 'Incident, change, problem governance, SLA auto-escalation matrix, and visual CI/CD configuration management database (CMDB).',
    color: 'bg-indigo-600',
    stat: '99.4%',
    statLabel: 'SLA Compliance'
  },
  {
    name: 'KavachIQ SIEM',
    slug: 'siem',
    icon: ShieldAlert,
    badge: 'SecOps & Threat Intel',
    headline: 'Zero-Trust Security Information & Event Management',
    desc: 'Real-time MITRE ATT&CK correlation, behavioral anomaly detection, automated containment SOAR playbooks, and forensic audit vaults.',
    color: 'bg-amber-600',
    stat: '< 45s',
    statLabel: 'Mean Time to Detect'
  },
  {
    name: 'KavachIQ Syslog Manager',
    slug: 'syslog-manager',
    icon: FileText,
    badge: 'High-Throughput Logging',
    headline: 'Enterprise-Grade Log Ingestion Engine',
    desc: 'Sustained 500,000+ EPS streaming ingestion with hardware compression, indexed sub-second query latency, and SHA-256 tamper-evident archival.',
    color: 'bg-emerald-600',
    stat: '500k+',
    statLabel: 'Sustained EPS'
  },
  {
    name: 'KavachIQ Config Manager',
    slug: 'config-manager',
    icon: Sliders,
    badge: 'NCCM & Compliance',
    headline: 'Network Configuration & Drift Governance',
    desc: 'Real-time CLI drift detection, automated multi-vendor configuration snapshots, CIS benchmark validation, and rollback automation.',
    color: 'bg-purple-700',
    stat: '100%',
    statLabel: 'Audit Readiness'
  }
];

const capabilities = [
  {
    icon: Network,
    title: 'Network Observability',
    desc: 'Deep multi-vendor SNMP v1/v2c/v3 telemetry, automated Layer-2/3 topology mapping, and NetFlow traffic decomposition.',
    link: '/products/nms'
  },
  {
    icon: ShieldAlert,
    title: 'Cyber Defense & SIEM',
    desc: 'Sub-second event correlation across 1,200+ MITRE ATT&CK rules, UEBA behavioral modeling, and automated SOAR playbooks.',
    link: '/products/siem'
  },
  {
    icon: Headphones,
    title: 'IT Service Management',
    desc: 'ITIL v4 certified service desk with real-time CMDB dependency trees, CAB change governance, and automated SLA escalations.',
    link: '/products/itsm'
  },
  {
    icon: Sliders,
    title: 'NCCM Configuration Governance',
    desc: 'Immutable configuration versioning, instant CLI drift detection, automated CIS benchmarks, and one-click rollback.',
    link: '/products/config-manager'
  }
];

const solutions = [
  {
    id: 'bfsi',
    title: 'Banking & Financial Services',
    icon: Landmark,
    subtitle: 'Low-latency core switching, transaction telemetry, and strict RBI/PCI-DSS regulatory compliance.',
    points: ['Air-gapped on-premise deployment', 'Real-time NetFlow transaction monitoring', 'Tamper-proof audit logs for compliance audits'],
    link: '/industries'
  },
  {
    id: 'telecom',
    title: 'Telecommunications & 5G',
    icon: Radio,
    subtitle: 'Nationwide MPLS backbones, 5G core routers, and distributed cell-site aggregation gateways.',
    points: ['100,000+ nodes per distributed poller', 'sFlow & IPFIX carrier traffic sampling', 'BGP route flapping & peering SLA tracking'],
    link: '/industries'
  },
  {
    id: 'defense',
    title: 'Defense & Sovereign Infrastructure',
    icon: ShieldCheck,
    subtitle: 'Mission-critical defense networks with zero external SaaS dependencies and air-gap cryptography.',
    points: ['100% offline cryptographic licensing', 'DISA STIG and CIS benchmark enforcement', 'Role-based compartmentalized access control'],
    link: '/industries'
  },
  {
    id: 'enterprise',
    title: 'Critical Enterprise Data Centers',
    icon: Building2,
    subtitle: 'Unified observability across bare-metal, virtualization clusters, and high-throughput storage fabrics.',
    points: ['Automated dynamic topology mapping', 'Hardware environmental monitoring', 'Predictive capacity & saturation alerts'],
    link: '/solutions'
  }
];

const insights = [
  {
    type: 'Research Report',
    title: 'Cybersecurity: Key trends in telemetry and sovereign threat surveillance',
    desc: 'Comprehensive 2026 security benchmarks analyzing multi-vector ransomware patterns and automated containment efficacy.',
    author: 'GTS Research Institute',
    readTime: '6 min read',
    link: '/resources'
  },
  {
    type: 'Point of View',
    title: 'Autonomous Observability: Redefining high-throughput operations at scale',
    desc: 'How streaming telemetry and continuous configuration verification eliminate network outages before end-users are impacted.',
    author: 'Chief Architect, GTS Technosoft',
    readTime: '4 min read',
    link: '/resources'
  },
  {
    type: 'Case Study',
    title: 'Securing tier-1 banking transaction hubs with KavachIQ SIEM & Syslog',
    desc: 'Over 2.4 billion daily transactions protected under sub-second event correlation and regulatory audit archiving.',
    author: 'Enterprise Customer Story',
    readTime: '5 min read',
    link: '/resources'
  },
  {
    type: 'Whitepaper',
    title: 'Zero-Trust NCCM: Continuous CIS compliance in air-gapped environments',
    desc: 'Framework for enforcing automated configuration rollbacks, drift alerts, and cryptographic change verification.',
    author: 'GTS Compliance Engineering',
    readTime: '8 min read',
    link: '/resources'
  }
];

export const HomePage = () => {
  const [selectedSolution, setSelectedSolution] = useState(0);

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* 1. HERO SECTION: Light Enterprise Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 border-b border-slate-200/80 py-16 lg:py-24">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#0070AD_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-xs font-bold text-gts-purple shadow-sm">
                <span className="w-2 h-2 rounded-full bg-gts-orange animate-pulse" />
                <span>GTS TECHNOSOFT AI • KAVACHIQ SUITE</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Sovereign AI for <span className="editorial-gradient-text">Enterprise Observability</span> & Cyber Defense
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Empowering critical infrastructure, financial institutions, telecom operators, and enterprise organizations with an integrated platform for high-throughput observability, cybersecurity, IT operations, and network governance.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/get-started"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gts-orange hover:bg-gts-orange-dark text-white font-bold text-sm shadow-glow-orange transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Request Technical Briefing</span>
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 hover:border-slate-300 shadow-sm transition-all"
                >
                  <span>Explore Platform</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Trust Subtext */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-gts-blue" />
                  <span>100% Air-Gap Ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-gts-purple" />
                  <span>On-Premises Sovereignty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>ISO 27001 & SOC 2 Aligned</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Enterprise Network & AI Technology Area */}
            <div className="lg:col-span-5">
              <NetworkTopologyVisualizer />
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION / VALUE PROPOSITION SECTION */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">
              THE KAVACHIQ PLATFORM
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              One unified platform for observability, cybersecurity, and intelligent operations.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Traditional enterprise IT relies on fragmented point products that create telemetry silos, slow down incident resolution, and increase cyber vulnerability. KavachIQ consolidates your operational layer into a unified, sovereign architecture.
            </p>
          </div>

          {/* 4 Key Capability Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div
                  key={i}
                  className="enterprise-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-purple-50 text-gts-purple flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-gts-purple transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>

                  <Link
                    to={cap.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gts-purple hover:text-gts-orange transition-colors"
                  >
                    <span>Explore module</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. EDITORIAL IMAGE + CONTENT SECTION 1: Network Observability */}
      <section className="py-20 lg:py-28 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Visual Area */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-card border border-slate-200 bg-white p-2">
                <img
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
                  alt="High Density Enterprise Network Infrastructure"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Right Editorial Narrative */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">
                HIGH-THROUGHPUT TELEMETRY
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Autonomous Telemetry for Hyper-Scale Core Networks
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                KavachIQ NMS delivers sub-second network topology visualization and NetFlow correlation across mission-critical carrier, banking, and government backbones. Monitor millions of metrics with zero performance degradation.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gts-blue shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">Auto-generated Layer-2/3 physical link topology maps with live traffic flow heatmaps</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gts-blue shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">Distributed multi-tenant polling fleets handling 250k+ interfaces with minimal CPU footprint</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gts-blue shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">Deep packet NetFlow v5/v9, sFlow, and IPFIX stream protocol decomposition</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/products/nms"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gts-navy hover:bg-gts-darkest text-white font-bold text-xs shadow-sm transition-all"
                >
                  <span>Learn about KavachIQ NMS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EDITORIAL IMAGE + CONTENT SECTION 2: SecOps & Threat Defense */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Editorial Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-gts-orange font-bold">
                SOVEREIGN CYBER DEFENSE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Transforming Enterprise SOC with Automated SOAR Playbooks
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                KavachIQ SIEM and Syslog Manager aggregate and correlate millions of daily security signals against 1,200+ MITRE ATT&CK rules to isolate threats and trigger automated containment playbooks in under 45 seconds.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gts-orange shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">Sustained 500,000+ EPS ingestion with SHA-256 tamper-evident cryptographic log vaults</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gts-orange shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">Out-of-the-box regulatory compliance audits for RBI Cyber Security, CERT-In, ISO 27001 & SOC 2</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gts-orange shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">Automated containment actions: IP quarantine, ACL deployment, and token invalidation</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/products/siem"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gts-navy hover:bg-gts-darkest text-white font-bold text-xs shadow-sm transition-all"
                >
                  <span>Explore Security Suite</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Visual Area */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-card border border-slate-200 bg-white p-2">
                <img
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"
                  alt="Enterprise Cybersecurity & Cyber Defense Monitoring"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT PLATFORM SECTION: All 5 Modules */}
      <section className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">
              MODULAR ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              One platform. Multiple layers of enterprise intelligence.
            </h2>
            <p className="text-base text-slate-600">
              Deploy individual KavachIQ modules independently or activate the full integrated sovereign suite for unified single-pane orchestration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => {
              const Icon = prod.icon;
              return (
                <div
                  key={prod.slug}
                  className="enterprise-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-xl ${prod.color} text-white flex items-center justify-center shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-bold border border-slate-200">
                        {prod.stat} {prod.statLabel.split(' ')[0]}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono font-bold text-gts-orange uppercase tracking-wider">{prod.badge}</span>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-gts-purple transition-colors mt-0.5">
                        {prod.name}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {prod.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/products/${prod.slug}`}
                      className="text-xs font-bold text-gts-purple hover:text-gts-orange transition-colors flex items-center gap-1"
                    >
                      <span>Technical Specs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to={`/get-started?product=${prod.slug}`}
                      className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
                    >
                      Request POC
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Suite Overview Card */}
            <div className="rounded-2xl bg-gts-navy p-6 sm:p-8 text-white flex flex-col justify-between space-y-6 border border-slate-800">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-gts-orange text-white flex items-center justify-center shadow-glow-orange">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-gts-orange uppercase tracking-wider">ALL-IN-ONE LICENSE</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    KavachIQ Sovereign Suite
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Integrate all 5 modules under a unified air-gapped cryptographic license key with 24×7 enterprise SLA support.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <Link
                  to="/get-started"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gts-orange hover:bg-gts-orange-dark text-white font-bold text-xs shadow-glow-orange transition-all"
                >
                  <span>Request Full Suite Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SOLUTIONS BUILT FOR CRITICAL OPERATIONS */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">
              INDUSTRY ARCHITECTURES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Solutions built for critical operations
            </h2>
            <p className="text-base text-slate-600">
              Tailored architectural blueprints designed to satisfy strict sovereign compliance, microsecond latency constraints, and multi-tenant security requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((sol, i) => {
              const Icon = sol.icon;
              return (
                <div
                  key={sol.id}
                  className="enterprise-card p-8 rounded-3xl space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-gts-purple flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{sol.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{sol.subtitle}</p>
                    </div>

                    <div className="space-y-2 pt-2">
                      {sol.points.map((pt, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-gts-blue shrink-0" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      to={sol.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gts-purple hover:text-gts-orange transition-colors"
                    >
                      <span>Explore {sol.title} architecture</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. INSIGHTS & RESEARCH SECTION */}
      <section className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">
                PERSPECTIVES & INTELLIGENCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Insights & Research
              </h2>
              <p className="text-base text-slate-600">
                Technical research, compliance perspectives, and benchmarks authored by GTS engineers and cybersecurity researchers.
              </p>
            </div>

            <Link
              to="/resources"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-sm transition-all"
            >
              <span>View All Publications</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((item, i) => (
              <div
                key={i}
                className="enterprise-card p-6 rounded-2xl flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-gts-orange uppercase">{item.type}</span>
                    <span className="text-slate-400">{item.readTime}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-gts-purple transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">{item.author}</span>
                  <Link
                    to={item.link}
                    className="text-xs font-bold text-gts-purple hover:underline flex items-center gap-0.5"
                  >
                    Read <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. METRICS / FACTUAL TRUST SECTION */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-gts-navy font-mono">24×7</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Infrastructure Visibility</div>
            </div>
            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-gts-purple font-mono">500k+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sustained EPS Ingestion</div>
            </div>
            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-gts-orange font-mono">&lt; 45s</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mean Detection SLA</div>
            </div>
            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-gts-blue font-mono">100%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sovereign Air-Gapped</div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. DARK CTA SECTION */}
      <section className="py-20 bg-gts-darkest text-white relative overflow-hidden">
        {/* Background Subtle Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(#0070AD_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono font-bold text-gts-orange">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ENTERPRISE SOVEREIGN DEPLOYMENT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Build a more intelligent, secure enterprise.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover how GTS Technosoft AI and KavachIQ transform enterprise observability, eliminate blindspots, and enforce zero-trust sovereign cybersecurity.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/get-started"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gts-orange hover:bg-gts-orange-dark text-white font-bold text-sm shadow-glow-orange transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request a Technical Briefing</span>
            </Link>

            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all"
            >
              <span>Explore KavachIQ Modules</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
