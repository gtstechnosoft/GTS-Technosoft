import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Network,
  Headphones,
  ShieldAlert,
  FileText,
  Sliders,
  CheckCircle2,
  Download,
  Sparkles,
  Server,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronRight,
  FileDown
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const productsData = {
  nms: {
    name: 'KavachIQ NMS',
    tagline: 'Enterprise Network Management & Unified Observability',
    category: 'Network Operations & Observability',
    icon: Network,
    color: 'bg-blue-600',
    overview: 'KavachIQ NMS is an industrial-grade network performance and topology monitoring platform engineered to handle hundreds of thousands of interfaces with sub-second precision. By unifying SNMP v1/v2c/v3 polling, NetFlow v5/v9, sFlow, and IPFIX stream analytics into a single high-availability core, KavachIQ NMS delivers zero-blindspot visibility across hybrid enterprise infrastructure.',
    architectureSnippet: `# ==============================================================================
# KavachIQ NMS Distributed Poller Engine (Topology & NetFlow Collector)
# ==============================================================================
network_topology:
  discovery_protocols: [LLDP, CDP, ARP_SCAN, BGP_PEERING]
  polling_interval_sec: 10
  snmp_bulk_walk_threads: 64
  supported_versions: [v1, v2c, v3_AUTH_PRIV_AES256]
  flow_collectors:
    - protocol: NetFlow_v9
      listen_port: 2055
      buffer_mb: 4096
    - protocol: IPFIX
      listen_port: 4739
      buffer_mb: 8192
ha_cluster_mode: ACTIVE_ACTIVE_RAFT`,
    keyCapabilities: [
      { title: 'Automated Multi-Layer Topology', desc: 'Auto-maps physical and logical Layer-2/3 interconnects with live link utilization heatmaps.' },
      { title: 'Full-Spectrum Flow Decomposition', desc: 'Inspect NetFlow v5/v9, sFlow, and IPFIX traffic down to conversations, ports, and QoS classes.' },
      { title: 'High-Throughput Poller Daemon', desc: 'Lightweight distributed worker nodes capable of polling over 100,000 interfaces with minimal CPU impact.' },
      { title: 'Predictive Threshold Analytics', desc: 'Adaptive anomaly detection triggers alerts before saturation or packet loss degrades business operations.' },
      { title: 'Multi-Vendor Hardware Support', desc: 'Native MIB and OID templates for Cisco, Arista, Juniper, Fortinet, Huawei, and Linux servers.' },
      { title: 'Restricted Air-Gap Mode', desc: 'Operates 100% on-premises with zero external telemetry pings or Internet dependencies.' }
    ],
    editions: [
      { name: 'Standard Edition', nodes: 'Up to 500 Nodes', features: ['SNMP v1/v2c/v3', 'Basic Topology Mapping', 'Email & Webhook Alerts', 'Standard SLA'] },
      { name: 'Professional Edition', nodes: 'Up to 2,500 Nodes', features: ['All Standard features', 'NetFlow & IPFIX Analysis', 'Automated Root Cause Triage', 'Slack & PagerDuty Integration'] },
      { name: 'Enterprise Edition', nodes: 'Up to 10,000 Nodes', features: ['All Pro features', 'Active-Active HA Clustering', 'AI Anomaly Detection', 'Distributed Poller Fleet', '24x7 Platinum TAC'] },
      { name: 'Ultimate Edition', nodes: 'Unlimited Nodes', features: ['Unlimited Distributed Collectors', 'Custom MIB Developer Studio', 'Dedicated On-Site Engineering Support', 'LTS Release Channel'] }
    ],
    datasheet: 'KavachIQ_NMS_Enterprise_Datasheet_v4.2.pdf'
  },
  itsm: {
    name: 'KavachIQ ITSM',
    tagline: 'AI-Powered ITIL ServiceDesk & Asset Lifecycle Orchestration',
    category: 'IT Service Management & Desk',
    icon: Headphones,
    color: 'bg-indigo-600',
    overview: 'KavachIQ ITSM modernizes IT service operations by aligning ITIL v4 best practices with intelligent auto-routing, dynamic SLA management, Change Advisory Board (CAB) governance, and a unified Configuration Management Database (CMDB). It gives IT leaders total control over incidents, assets, and service delivery performance.',
    architectureSnippet: `# ==============================================================================
# KavachIQ ITSM Service Workflow & SLA Governance Engine
# ==============================================================================
service_desk_pipeline:
  itil_framework_version: "v4.0"
  sla_tiers:
    - severity: P1_CRITICAL
      first_response_min: 15
      resolution_target_hours: 2
      auto_escalate_to: "SecOps_Incident_Commander"
    - severity: P2_HIGH
      first_response_min: 30
      resolution_target_hours: 4
  cmdb_sync:
    auto_link_cis_to_incidents: true
    drift_alert_webhook: "https://kavachiq-core.internal/api/v1/cmdb/drift"`,
    keyCapabilities: [
      { title: 'ITIL v4 Certified Processes', desc: 'Incident, Problem, Change, Release, and Service Request Management workflows pre-configured.' },
      { title: 'Intelligent Ticket Auto-Triage', desc: 'Categorizes, prioritizes, and routes tickets to appropriate support groups based on keyword and asset heuristics.' },
      { title: 'Hierarchical CMDB & Dependency Trees', desc: 'Visualize upstream and downstream dependencies before scheduling high-impact production changes.' },
      { title: 'Automated Multi-Tier SLAs', desc: 'Granular SLA tracking with proactive alerts to management before SLA breach thresholds occur.' },
      { title: 'Self-Service Employee Portal', desc: 'Intuitive self-service catalog for software provisioning, hardware requests, and knowledge base articles.' },
      { title: 'ChatOps & Email Bi-Directional Sync', desc: 'Interact with and resolve tickets directly from Microsoft Teams, Slack, and Outlook.' }
    ],
    editions: [
      { name: 'Standard Edition', nodes: 'Up to 25 Agents', features: ['Incident & Request Management', 'Basic Asset Inventory', 'Standard SLA Tracker', 'Email Integration'] },
      { name: 'Enterprise Edition', nodes: 'Unlimited Agents', features: ['Full ITIL Process Suite', 'Advanced CMDB & CI Dependency Mapping', 'CAB Change Governance', 'AI Auto-Routing', 'Custom Workflow Designer'] }
    ],
    datasheet: 'KavachIQ_ITSM_ServiceDesk_Datasheet_v2.5.pdf'
  },
  siem: {
    name: 'KavachIQ SIEM',
    tagline: 'Real-Time Threat Detection & Compliance Security Analytics',
    category: 'SecOps & Threat Intelligence',
    icon: ShieldAlert,
    color: 'bg-amber-600',
    overview: 'KavachIQ SIEM delivers advanced threat detection, behavior profiling (UEBA), and security orchestration (SOAR) for modern Security Operations Centers (SOC). Packed with over 1,200 out-of-the-box MITRE ATT&CK correlation rules, it cuts through the noise to identify sophisticated lateral movements, ransomware intrusions, and insider threats.',
    architectureSnippet: `# ==============================================================================
# KavachIQ SIEM Correlation Engine (MITRE ATT&CK v14.1 Matrix)
# ==============================================================================
siem_correlation_rules:
  framework: "MITRE_ATTACK_V14.1"
  active_rulesets:
    - rule_id: "T1059.001_POWERSHELL_OBFUSCATION"
      severity: "P1_CRITICAL"
      action: "ISOLATE_HOST_AND_ALERT_SOC"
    - rule_id: "T1078_PRIVILEGED_ACCOUNT_COMPROMISE"
      severity: "P2_HIGH"
      action: "TRIGGER_MFA_CHALLENGE"
  ingestion_shards: 16
  retention_compliance: [PCI_DSS_3.2, ISO_27001, SOC2_TYPE_2, CERT_IN]`,
    keyCapabilities: [
      { title: '1,200+ Pre-Mapped MITRE Rules', desc: 'Out-of-the-box detections aligned with standard enterprise tactics, techniques, and procedures.' },
      { title: 'Real-Time Behavioral Analytics (UEBA)', desc: 'Identifies anomalous logins, data staging, privilege escalation, and lateral network movement.' },
      { title: 'Automated SOAR Playbooks', desc: 'Instantly isolate compromised endpoints, revoke active tokens, or push firewall block rules.' },
      { title: 'Sub-Second Forensic Timeline Search', desc: 'Blazing fast queries across terabytes of historical security events with syntax-guided builders.' },
      { title: 'One-Click Compliance Reporting', desc: 'Pre-built audit packages for ISO 27001, RBI Cyber Security Guidelines, SOC 2, and PCI-DSS.' },
      { title: 'Multi-Tenant MSSP Partitioning', desc: 'Secure logical isolation for service providers managing multiple distinct enterprise tenants.' }
    ],
    editions: [
      { name: 'Standard Edition', nodes: 'Up to 1,000 EPS', features: ['Core Log Correlation', 'Standard Threat Intelligence Feed', 'HIPAA/PCI Reports', 'Standard Storage'] },
      { name: 'Enterprise Edition', nodes: 'Up to 10,000 EPS', features: ['Full MITRE ATT&CK Matrix', 'UEBA Behavior Modeling', 'SOAR Automated Playbooks', '24x7 Hot Shards'] },
      { name: 'Ultimate Edition', nodes: 'Unlimited EPS', features: ['Custom Parser Studio', 'AI Defense Investigation Assistant', 'MSSP Multi-Tenant Portal', 'Dedicated SOC Architect'] }
    ],
    datasheet: 'KavachIQ_SIEM_Threat_Defense_Datasheet_v3.1.pdf'
  },
  'syslog-manager': {
    name: 'KavachIQ Syslog Manager',
    tagline: 'High-Throughput Log Aggregator & Forensic Search Engine',
    category: 'Centralized Log Aggregation',
    icon: FileText,
    color: 'bg-emerald-600',
    overview: 'KavachIQ Syslog Manager is a purpose-built, high-throughput log ingestion and indexing engine designed to process more than 250,000 events per second per node. It provides lightning-fast search capabilities, automated Geo-IP enrichment, and compliant, tamper-proof long-term archival.',
    architectureSnippet: `# ==============================================================================
# KavachIQ High-Throughput Syslog Ingestion Pipeline (>250k EPS)
# ==============================================================================
syslog_pipeline:
  listeners:
    - type: RFC5424_UDP
      port: 514
      threads: 32
    - type: RFC5424_TLS
      port: 6514
      tls_min_version: TLSv1.3
  indexing_engine:
    codec: ZSTD_COMPRESSION_LEVEL_9
    buffer_memory_gb: 32
  archival_storage:
    tamper_proof_sha256_verification: true
    cold_tier_lifecycle_days: 365`,
    keyCapabilities: [
      { title: 'High-Volume Stream Ingestion', desc: 'Sustained ingestion capacity of 250,000+ EPS per appliance with zero dropped packets.' },
      { title: 'Instant Full-Text Query Engine', desc: 'Query billion-record datasets in milliseconds using intuitive regex, boolean, and facet queries.' },
      { title: 'Dynamic Metadata Enrichment', desc: 'Enrich logs on-the-fly with Geo-IP locations, DNS reverse lookups, and host tags.' },
      { title: 'Lifecycle Archival Policies', desc: 'Automate data movement from NVMe hot storage to compressed warm disks and encrypted cold vaults.' },
      { title: 'Cryptographic Hash Archival', desc: 'Each archival archive block is signed with SHA-256 hashes to guarantee tamper detection during legal discovery.' },
      { title: 'Universal Device Parser Library', desc: 'Pre-packaged parsers for Linux syslog, Windows Event Forwarding, Cisco ASA, Palo Alto, and Fortinet.' }
    ],
    editions: [
      { name: 'Standard Edition', nodes: 'Up to 25,000 EPS', features: ['Syslog UDP/TCP Ingestion', '30-Day Hot Indexing', 'Basic Alert Rules', 'Web UI'] },
      { name: 'Enterprise Edition', nodes: '250,000+ EPS', features: ['TLS Encrypted Ingestion', '365-Day Cold Archival', 'Geo-IP Enrichment', 'High-IOPS Distributed Indexing'] }
    ],
    datasheet: 'KavachIQ_Syslog_Manager_Datasheet_v1.9.pdf'
  },
  'config-manager': {
    name: 'KavachIQ Config Manager',
    tagline: 'Network Configuration, Change & Compliance Management (NCCM)',
    category: 'Network Automation & Governance',
    icon: Sliders,
    color: 'bg-purple-700',
    overview: 'KavachIQ Config Manager eliminates network downtime caused by misconfigurations and human error. It automates device backups, provides side-by-side visual diffs, detects configuration drift in real time, and audits routers, switches, and firewalls against industry compliance standards like CIS Benchmarks and DISA STIG.',
    architectureSnippet: `# ==============================================================================
# KavachIQ NCCM Engine & Configuration Drift Engine
# ==============================================================================
config_governance:
  protocols: [SSH_V2, TELNET_FALLBACK, SCP, TFTP, RESTCONF]
  backup_schedule: "0 2 * * *" # Daily 2 AM automated backup
  drift_detection:
    trigger: "SYSLOG_CONFIG_CHANGED_EVENT"
    action: "IMMEDIATE_DIFF_CAPTURE_AND_NOTIFY"
  compliance_benchmarks:
    - standard: "CIS_CISCO_IOS_V4.0"
    - standard: "DISA_STIG_NETWORK_ROUTER"
  session_recording: true`,
    keyCapabilities: [
      { title: 'Automated Multi-Vendor Backups', desc: 'Backup running and startup configs via SSH/SCP across Cisco, Juniper, Arista, and Fortinet devices.' },
      { title: 'Real-Time Drift Detection', desc: 'Catches out-of-band manual changes via Syslog triggers and sends immediate diff notifications.' },
      { title: 'Side-by-Side Visual Diff Tool', desc: 'Easily compare any two config versions with color-coded syntax additions and deletions.' },
      { title: 'One-Click Instant Rollback', desc: 'Restore any known-good configuration baseline in seconds to recover from catastrophic outages.' },
      { title: 'CIS & DISA Compliance Audits', desc: 'Evaluate your entire network estate against hardening guidelines with automated remediation scripts.' },
      { title: 'Mass Template Push & Zero-Touch', desc: 'Execute bulk password changes, ACL updates, or firmware upgrades across thousands of devices.' }
    ],
    editions: [
      { name: 'Standard Edition', nodes: 'Up to 250 Devices', features: ['Automated Backups', 'Side-by-Side Diff', 'Email Notifications', 'Basic Policy Rules'] },
      { name: 'Enterprise Edition', nodes: 'Unlimited Devices', features: ['Real-Time Drift Alarms', 'CIS & DISA Compliance', 'Mass Template Push', 'CLI Session Recording', 'RBAC Approval Matrix'] }
    ],
    datasheet: 'KavachIQ_Config_Manager_Datasheet_v2.1.pdf'
  }
};

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const product = productsData[slug] || productsData['nms'];
  const Icon = product.icon;

  const handleDownloadDatasheet = () => {
    toast.success(`Datasheet download started: ${product.datasheet}`);
    const blob = new Blob([
      `GTS TECHNOSOFT AI LLP - PRODUCT SPECIFICATION SHEET\n` +
      `Product: ${product.name}\n` +
      `Category: ${product.category}\n` +
      `Version: 4.3.0-GA (Production Certified)\n` +
      `Overview: ${product.overview}\n` +
      `Architecture: Air-Gapped Ready / Linux & Windows Support\n` +
      `Licensing: Cryptographically Signed .lic Container\n` +
      `For inquiries: contact@gtstech.ai | https://gtstech.ai\n`
    ], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', product.datasheet.replace('.pdf', '.txt'));
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Product Hero Banner */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-gts-purple font-semibold">
            <Link to="/products" className="hover:underline">Products</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{product.name}</span>
          </div>

          <div className="flex items-start gap-5 pt-2">
            <div className={`w-14 h-14 rounded-2xl ${product.color} text-white flex items-center justify-center shadow-md shrink-0`}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">{product.name}</h1>
              <p className="text-xs sm:text-sm font-mono text-gts-orange font-bold mt-1">{product.tagline}</p>
            </div>
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            {product.overview}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to={`/get-started?product=${slug}`}
              className="px-6 py-3 rounded-xl bg-gts-orange hover:bg-gts-orange-dark text-white font-bold text-xs sm:text-sm shadow-glow-orange transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Request Live Demo / 30-Day Trial
            </Link>

            <button
              onClick={handleDownloadDatasheet}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-200 shadow-sm"
            >
              <FileDown className="w-4 h-4 text-gts-purple" />
              <span>Download Technical Datasheet</span>
            </button>
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">KEY ARCHITECTURAL FEATURES</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Engineered for Zero-Downtime Reliability</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.keyCapabilities.map((cap, i) => (
            <div key={i} className="enterprise-card p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-gts-purple flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{cap.title}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Snippet */}
      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">SYSTEM ARCHITECTURE</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">High-Throughput Configuration & Deployment</h2>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-gts-darkest shadow-2xl overflow-hidden font-mono text-xs text-white">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="w-4 h-4 text-gts-orange" />
                <span>kavachiq-{slug}-engine.conf</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">SYNTAX VALIDATED</span>
            </div>
            <pre className="p-6 text-slate-300 text-xs overflow-x-auto leading-relaxed">
              {product.architectureSnippet}
            </pre>
          </div>
        </div>
      </section>

      {/* Editions Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">COMMERCIAL PACKAGING</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Editions & Deployment Tiers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {product.editions.map((ed, i) => (
            <div
              key={i}
              className={`enterprise-card p-6 rounded-2xl border flex flex-col justify-between ${
                ed.name.includes('Enterprise') || ed.name.includes('Ultimate')
                  ? 'border-purple-300 shadow-md ring-1 ring-gts-purple/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{ed.name}</h4>
                  <div className="text-xs font-mono text-gts-purple font-semibold mt-1">{ed.nodes}</div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                  {ed.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gts-blue shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to={`/get-started?product=${slug}&edition=${ed.name}`}
                  className="w-full block text-center py-2.5 rounded-xl bg-slate-100 hover:bg-gts-navy hover:text-white text-slate-800 text-xs font-bold transition-colors border border-slate-200"
                >
                  Select {ed.name.split(' ')[0]}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Conversion Section */}
      <section className="bg-gts-darkest py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Deploy {product.name} in Your Environment</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Obtain a signed 30-day evaluation container or request a private architectural briefing.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={`/get-started?product=${slug}`}
              className="px-6 py-3 rounded-xl bg-gts-orange hover:bg-gts-orange-dark text-white font-bold text-xs sm:text-sm shadow-glow-orange transition-all"
            >
              Start Free Evaluation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
