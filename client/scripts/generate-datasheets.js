import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '..', 'public', 'datasheets');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function generateNMSDatasheet() {
  const outputPath = path.join(outputDir, 'KavachIQ_NMS_Enterprise_Datasheet_v4.2.pdf');
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 40, left: 40, right: 40 },
    autoFirstPage: false
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const colors = {
    primary: '#1E40AF', // Deep Blue
    accent: '#2563EB', // Blue
    orange: '#EA580C', // Orange
    dark: '#0F172A',
    grayText: '#334155',
    lightBg: '#F8FAFC',
    cardBg: '#FFFFFF',
    border: '#E2E8F0',
    cyan: '#0284C7',
    green: '#16A34A',
    red: '#DC2626'
  };

  // Helper for drawing header/footer banner
  const addHeaderFooter = (pageDoc, title, pageNum) => {
    // Top banner
    pageDoc.rect(0, 0, 595.28, 45).fill('#0F172A');
    pageDoc.fillColor('#FFFFFF').fontSize(12).font('Helvetica-Bold').text(title, 40, 16);
    pageDoc.fillColor('#94A3B8').fontSize(9).font('Helvetica').text('Enterprise Infrastructure Observability', 380, 18, { align: 'right', width: 175 });

    // Bottom banner
    pageDoc.rect(0, 841.89 - 30, 595.28, 30).fill('#0F172A');
    pageDoc.fillColor('#94A3B8').fontSize(8).font('Helvetica').text('KavachIQ NMS - Ripplewave Solutions / GTS Technosoft', 40, 841.89 - 20);
    pageDoc.text(`Page ${pageNum} of 7`, 40, 841.89 - 20, { align: 'right', width: 515 });
  };

  // ==========================================
  // PAGE 1: COVER
  // ==========================================
  doc.addPage();
  // Background styling
  doc.rect(0, 0, 595.28, 841.89).fill('#F8FAFC');
  
  // Top brand
  doc.fillColor('#0F172A').fontSize(14).font('Helvetica-Bold').text('RIPPLEWAVE SOLUTIONS', 40, 40);
  doc.fillColor('#EA580C').fontSize(9).font('Helvetica-Bold').text('ENTERPRISE TECHNOLOGY PARTNER', 40, 56);

  // Logo illustration box
  doc.roundedRect(160, 160, 275, 180, 16).fillAndStroke('#FFFFFF', '#DBEAFE');
  
  // Center Cloud / Heartbeat icon simulation
  doc.circle(297, 230, 45).lineWidth(3).strokeColor('#2563EB').stroke();
  doc.moveTo(270, 230).lineTo(285, 230).lineTo(292, 210).lineTo(302, 250).lineTo(310, 230).lineTo(325, 230).lineWidth(2.5).strokeColor('#0284C7').stroke();

  // Title
  doc.fillColor('#0F172A').fontSize(32).font('Helvetica-Bold').text('KavachIQ NMS', 40, 370, { align: 'center' });
  doc.fillColor('#EA580C').fontSize(13).font('Helvetica-Bold').text('SEE IT ALL. SOLVE IT FAST.', 40, 410, { align: 'center' });

  // Divider
  doc.moveTo(180, 435).lineTo(415, 435).lineWidth(2).strokeColor('#2563EB').stroke();

  // Subtitle
  doc.fillColor('#1E293B').fontSize(18).font('Helvetica-Bold').text('Enterprise Network Monitoring &', 40, 470, { align: 'center' });
  doc.fillColor('#2563EB').fontSize(18).font('Helvetica-Bold').text('Infrastructure Management Platform', 40, 495, { align: 'center' });

  // Feature Highlights Box on Cover
  doc.roundedRect(60, 550, 475, 180, 12).fillAndStroke('#FFFFFF', '#E2E8F0');
  doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text('Core Capabilities at a Glance:', 80, 570);
  
  const coverPoints = [
    '• Real-Time Network & Distributed Infrastructure Observability',
    '• Automated Multi-Vendor Topology Mapping & Dynamic Discovery',
    '• Deep NetFlow v5/v9, sFlow, IPFIX & SNMP v1/v2c/v3 Diagnostics',
    '• AI-Assisted Anomaly Detection & SLA Breach Prevention Engine',
    '• Air-Gapped High Availability Clustering for Mission-Critical Ops'
  ];
  let coverY = 595;
  coverPoints.forEach(pt => {
    doc.fillColor('#334155').fontSize(10).font('Helvetica').text(pt, 85, coverY);
    coverY += 22;
  });

  // Footer on cover
  doc.rect(0, 841.89 - 40, 595.28, 40).fill('#0F172A');
  doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text('KAVACHIQ NMS | TECHNICAL PRODUCT DATASHEET', 40, 841.89 - 25);
  doc.fillColor('#94A3B8').fontSize(9).font('Helvetica').text('www.gtstech.ai', 40, 841.89 - 25, { align: 'right', width: 515 });

  // ==========================================
  // PAGE 2: OVERVIEW & DASHBOARD OVERVIEW
  // ==========================================
  doc.addPage();
  addHeaderFooter(doc, 'Overview & Platform Architecture', 2);

  doc.fillColor('#1E40AF').fontSize(18).font('Helvetica-Bold').text('Platform Overview', 40, 65);

  doc.roundedRect(40, 95, 515, 120, 8).fillAndStroke('#F8FAFC', '#CBD5E1');
  doc.fillColor('#1E293B').fontSize(10.5).font('Helvetica').text(
    'KavachIQ NMS is a next-generation enterprise-grade Network Monitoring System designed to provide complete visibility into IT infrastructure, networks, servers, applications, virtual environments, cloud platforms, and security devices.\n\n' +
    'Built with intelligent monitoring, realtime alerting, advanced analytics, and scalable architecture, KavachIQ NMS helps organizations proactively identify issues, reduce downtime, and optimize infrastructure performance.',
    55, 110, { width: 485, lineGap: 4 }
  );

  doc.fillColor('#1E40AF').fontSize(16).font('Helvetica-Bold').text('Dashboard Overview & Live Telemetry', 40, 235);
  
  // Dashboard cards simulation
  const metricCards = [
    { title: 'Total Devices', val: '2,350', sub: '98.5% Healthy', color: '#2563EB' },
    { title: 'Up Devices', val: '2,116', sub: '90.05% Active', color: '#16A34A' },
    { title: 'Down Devices', val: '134', sub: 'Action Required', color: '#DC2626' },
    { title: 'Open Alerts', val: '28', sub: '12 Critical', color: '#EA580C' }
  ];

  let cardX = 40;
  metricCards.forEach(card => {
    doc.roundedRect(cardX, 265, 118, 70, 6).fillAndStroke('#FFFFFF', '#E2E8F0');
    doc.fillColor('#64748B').fontSize(8.5).font('Helvetica-Bold').text(card.title.toUpperCase(), cardX + 10, 275);
    doc.fillColor(card.color).fontSize(16).font('Helvetica-Bold').text(card.val, cardX + 10, 292);
    doc.fillColor('#475569').fontSize(8).font('Helvetica').text(card.sub, cardX + 10, 314);
    cardX += 132;
  });

  // Architectural Summary Box
  doc.roundedRect(40, 355, 515, 430, 8).fillAndStroke('#FFFFFF', '#E2E8F0');
  doc.fillColor('#0F172A').fontSize(12).font('Helvetica-Bold').text('Operational Command Capabilities', 55, 375);

  const opsList = [
    { title: 'Multi-Perspective Topologies', desc: 'Auto-maps physical Layer-2 links, VLAN allocations, STP states, and BGP/OSPF peerings in interactive SVG graph views.' },
    { title: 'Continuous Health Polling', desc: 'Sub-second polling loops for CPU, Memory, Disk I/O, Interface utilization, and thermal sensors with zero poller jitter.' },
    { title: 'Traffic & Flow Decomposition', desc: 'Native NetFlow v5/v9, sFlow, and IPFIX collection isolates rogue bandwidth consumers and top application talkers.' },
    { title: 'Dynamic SLA & Availability Tracking', desc: 'Computes real-time uptime metrics across business services, remote branches, and critical cloud endpoints.' },
    { title: 'Root-Cause Telemetry Correlation', desc: 'Correlates interface drops with upstream switch flapping to suppress redundant downstream alert noise.' }
  ];

  let opY = 405;
  opsList.forEach(op => {
    doc.circle(65, opY + 5, 4).fill('#2563EB');
    doc.fillColor('#0F172A').fontSize(10.5).font('Helvetica-Bold').text(op.title, 78, opY);
    doc.fillColor('#475569').fontSize(9.5).font('Helvetica').text(op.desc, 78, opY + 16, { width: 460 });
    opY += 75;
  });

  // ==========================================
  // PAGE 3: KEY HIGHLIGHTS
  // ==========================================
  doc.addPage();
  addHeaderFooter(doc, 'Key Highlights & Core Capabilities', 3);

  doc.fillColor('#1E40AF').fontSize(18).font('Helvetica-Bold').text('Key Highlights', 40, 65);
  doc.fillColor('#64748B').fontSize(10).font('Helvetica').text('Powerful monitoring, intelligent insights, complete control.', 40, 88);

  const highlights = [
    { title: 'Real-Time Network Monitoring', desc: 'Deep visibility into enterprise LAN, WAN, and wireless infrastructures with sub-second polling.' },
    { title: 'Automatic Discovery & Topology', desc: 'Auto-discovers devices and visualizes dynamic physical & logical Layer-2/3 topologies.' },
    { title: 'Centralized Dashboard Widgets', desc: 'Fully customizable NOC dashboards with drag-and-drop metrics, graphs, and heatmaps.' },
    { title: 'Multi-Vendor Support', desc: 'Out-of-the-box MIB templates for Cisco, Juniper, Fortinet, Arista, HP, Dell, and Linux.' },
    { title: 'Advanced Alerting & Escalation', desc: 'Multi-tier escalation rules with bi-directional Slack, Teams, Email, and SMS integrations.' },
    { title: 'Comprehensive Protocol Support', desc: 'Full support for SNMP v1/v2c/v3, WMI, SSH, ICMP, HTTP/HTTPS, and REST API telemetry.' },
    { title: 'Performance Analytics & Reports', desc: 'Long-term capacity planning, trend forecasting, and executive PDF/CSV compliance reports.' },
    { title: 'Cloud & Container Monitoring', desc: 'Unified observability across AWS, Azure, GCP, VMware, Hyper-V, Docker, and Kubernetes.' },
    { title: 'Scalable Distributed Architecture', desc: 'Lightweight distributed collector probes handle hundreds of thousands of interfaces seamlessly.' },
    { title: 'Role-Based Access Control (RBAC)', desc: 'Granular user permission matrices, LDAP/AD single sign-on, and immutable audit logs.' },
    { title: 'AI-Assisted Anomaly Detection', desc: 'Predictive machine learning models identify bandwidth degradation and disk fill-ups early.' },
    { title: 'Multi-Tenant Architecture', desc: 'Designed for MSPs and large enterprises with secure logical domain separation.' }
  ];

  let hX = 40;
  let hY = 115;
  highlights.forEach((h, idx) => {
    doc.roundedRect(hX, hY, 248, 98, 6).fillAndStroke('#FFFFFF', '#E2E8F0');
    doc.rect(hX, hY, 4, 98).fill('#2563EB');
    
    doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold').text(h.title, hX + 14, hY + 12, { width: 220 });
    doc.fillColor('#475569').fontSize(8.5).font('Helvetica').text(h.desc, hX + 14, hY + 30, { width: 220, lineGap: 2 });

    if (idx % 2 === 1) {
      hX = 40;
      hY += 110;
    } else {
      hX = 307;
    }
  });

  // ==========================================
  // PAGE 4: CORE FEATURES
  // ==========================================
  doc.addPage();
  addHeaderFooter(doc, 'Core Features & Deep Inspection', 4);

  doc.fillColor('#1E40AF').fontSize(18).font('Helvetica-Bold').text('Core Features', 40, 65);

  const sectionsP4 = [
    {
      title: '1. Network Monitoring',
      color: '#2563EB',
      items: [
        'Monitor routers, switches, firewalls, wireless controllers, and SD-WAN devices',
        'Bandwidth utilization, error counters, and interface packet discard monitoring',
        'Latency, packet loss, jitter, and QoS SLA threshold monitoring',
        'SNMP Trap receiver and real-time Syslog streaming engine'
      ]
    },
    {
      title: '2. Server & Application Monitoring',
      color: '#0D9488',
      items: [
        'Comprehensive Windows Server (WMI/WinRM) and Linux (SSH/SNMP) monitoring',
        'CPU, memory, disk I/O, process count, and Windows Service daemon tracking',
        'Health, response time, and availability metrics for web and backend services',
        'Database performance monitoring for MySQL, PostgreSQL, MSSQL, and Oracle'
      ]
    },
    {
      title: '3. Topology & Discovery Engine',
      color: '#7C3AED',
      items: [
        'Automated IP range scanning, ARP cache inspection, and LLDP/CDP discovery',
        'Dynamic physical and logical topology map generation with link utilization overlays',
        'Layer-2 switching dependency visualization and root bridge identification',
        'Geo-based multi-branch infrastructure mapping with live latency indicators'
      ]
    }
  ];

  let p4Y = 100;
  sectionsP4.forEach(sec => {
    doc.roundedRect(40, p4Y, 515, 210, 8).fillAndStroke('#FFFFFF', '#E2E8F0');
    doc.rect(40, p4Y, 515, 32).fill(sec.color);
    doc.fillColor('#FFFFFF').fontSize(12).font('Helvetica-Bold').text(sec.title, 55, p4Y + 10);

    let itemY = p4Y + 46;
    sec.items.forEach(it => {
      doc.circle(58, itemY + 5, 3.5).fill(sec.color);
      doc.fillColor('#1E293B').fontSize(10).font('Helvetica').text(it, 70, itemY, { width: 465 });
      itemY += 40;
    });

    p4Y += 225;
  });

  // ==========================================
  // PAGE 5: ALERTING, REPORTING & SECURITY
  // ==========================================
  doc.addPage();
  addHeaderFooter(doc, 'Alerting, Reporting & Security Governance', 5);

  doc.fillColor('#1E40AF').fontSize(18).font('Helvetica-Bold').text('Management & Operations Suite', 40, 65);

  const sectionsP5 = [
    {
      title: 'Alerting & Proactive Notifications',
      color: '#EA580C',
      items: [
        'Multi-stage threshold-based alerting with hysteresis to eliminate flapping',
        'Multi-channel dispatch: Email, SMS, Webhook, Microsoft Teams, and Slack',
        'Granular escalation matrix with acknowledgment tracking and on-call rotations',
        'Smart event correlation, root cause grouping, and downstream alert suppression'
      ]
    },
    {
      title: 'Dashboards & Enterprise Reporting',
      color: '#2563EB',
      items: [
        'Custom multi-screen dashboards, dark-mode NOC views, and executive summaries',
        'Executive SLA compliance reports with uptime percentages and penalty forecasts',
        'Historical analytics, capacity utilization trends, and growth forecasting',
        'Scheduled automated export to PDF, Excel (XLSX), and CSV formats'
      ]
    },
    {
      title: 'Security, Compliance & Integration',
      color: '#059669',
      items: [
        'Fine-grained Role-Based Access Control (RBAC) with Active Directory / LDAP auth',
        'Tamper-proof audit logs recording all user interactions and configuration changes',
        'Encrypted communication over TLS 1.3, SNMP v3 AuthPriv, and HTTPS',
        'Seamless bidirectional REST API integration with SIEM (KavachIQ SIEM) and ITSM'
      ]
    }
  ];

  let p5Y = 100;
  sectionsP5.forEach(sec => {
    doc.roundedRect(40, p5Y, 515, 210, 8).fillAndStroke('#FFFFFF', '#E2E8F0');
    doc.rect(40, p5Y, 515, 32).fill(sec.color);
    doc.fillColor('#FFFFFF').fontSize(12).font('Helvetica-Bold').text(sec.title, 55, p5Y + 10);

    let itemY = p5Y + 46;
    sec.items.forEach(it => {
      doc.circle(58, itemY + 5, 3.5).fill(sec.color);
      doc.fillColor('#1E293B').fontSize(10).font('Helvetica').text(it, 70, itemY, { width: 465 });
      itemY += 40;
    });

    p5Y += 225;
  });

  // ==========================================
  // PAGE 6: SUPPORTED PLATFORMS & ARCHITECTURE
  // ==========================================
  doc.addPage();
  addHeaderFooter(doc, 'Supported Platforms & Deployment Models', 6);

  doc.fillColor('#1E40AF').fontSize(18).font('Helvetica-Bold').text('Platform Compatibility & Architecture', 40, 65);

  // Supported Platforms
  doc.roundedRect(40, 95, 515, 175, 8).fillAndStroke('#FFFFFF', '#E2E8F0');
  doc.rect(40, 95, 515, 28).fill('#1E293B');
  doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold').text('Supported Platforms & Hardware Ecosystem', 55, 103);

  const platforms = [
    { label: 'Network Hardware', desc: 'Cisco, Juniper, Fortinet, Palo Alto, Arista, Ruckus, Aruba, Dell, HP, Huawei' },
    { label: 'Virtualization & Cloud', desc: 'VMware ESXi, Microsoft Hyper-V, Nutanix AHV, Proxmox, AWS, Azure, Google Cloud' },
    { label: 'Operating Systems', desc: 'Linux (RHEL, Ubuntu, Rocky, Debian), Microsoft Windows Server, Unix AIX/Solaris' },
    { label: 'Storage Systems', desc: 'NetApp, Dell EMC, Infortrend, Synology, QNAP, Pure Storage' },
    { label: 'Databases & Apps', desc: 'MySQL, PostgreSQL, Oracle DB, Microsoft SQL Server, Redis, Apache, NGINX' }
  ];

  let platY = 132;
  platforms.forEach(p => {
    doc.fillColor('#0F172A').fontSize(9).font('Helvetica-Bold').text(p.label + ':', 55, platY);
    doc.fillColor('#475569').fontSize(9).font('Helvetica').text(p.desc, 185, platY, { width: 355 });
    platY += 27;
  });

  // Deployment Architecture
  doc.roundedRect(40, 285, 515, 490, 8).fillAndStroke('#F8FAFC', '#CBD5E1');
  doc.fillColor('#1E40AF').fontSize(14).font('Helvetica-Bold').text('Multi-Tier Scalable Architecture', 55, 305);

  const archLayers = [
    {
      layer: 'Access & Presentation Layer',
      tech: 'Web Browser Console (HTML5/React), Mobile Responsive App, Secure REST API Endpoints, SIEM/ITSM Connectors'
    },
    {
      layer: 'Core NMS Platform Engine',
      tech: 'Distributed Processing Workers, Correlation & Anomaly Engine, SLA Computation Service, Alert Escalation Dispatcher'
    },
    {
      layer: 'Database & Storage Cluster',
      tech: 'High-Performance PostgreSQL Timeseries Store, Redis In-Memory Cache, Encrypted Long-Term Archive Storage'
    },
    {
      layer: 'Distributed Data Collection Layer',
      tech: 'Remote Poller Probes (SNMP/WMI/SSH), High-Throughput NetFlow Collectors, Air-Gapped Local Cache Daemons'
    },
    {
      layer: 'Monitored Infrastructure Tier',
      tech: 'Enterprise Core Switches, Edge Routers, Multi-Cloud VPCs, Physical Servers, Hypervisors, and IoT Devices'
    }
  ];

  let archY = 340;
  archLayers.forEach((al, i) => {
    doc.roundedRect(55, archY, 485, 75, 6).fillAndStroke('#FFFFFF', '#E2E8F0');
    doc.fillColor('#2563EB').fontSize(11).font('Helvetica-Bold').text(`Layer ${i+1}: ${al.layer}`, 70, archY + 12);
    doc.fillColor('#334155').fontSize(9).font('Helvetica').text(al.tech, 70, archY + 32, { width: 455, lineGap: 3 });
    archY += 86;
  });

  // ==========================================
  // PAGE 7: REQUIREMENTS & CONTACT
  // ==========================================
  doc.addPage();
  addHeaderFooter(doc, 'System Requirements & Commercial Contact', 7);

  doc.fillColor('#1E40AF').fontSize(18).font('Helvetica-Bold').text('Minimum System Requirements', 40, 65);

  // Table
  const tableTop = 100;
  const col1X = 55;
  const col2X = 220;
  
  doc.roundedRect(40, tableTop, 515, 230, 8).fillAndStroke('#FFFFFF', '#E2E8F0');
  doc.rect(40, tableTop, 515, 30).fill('#0F172A');
  doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold').text('Component', col1X, tableTop + 9);
  doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold').text('Recommended Specification', col2X, tableTop + 9);

  const reqRows = [
    { comp: 'CPU Processor', spec: '8 Core Processor or higher (x86_64 / ARM64)' },
    { comp: 'Memory (RAM)', spec: '16 GB RAM minimum (32 GB+ for enterprise deployments)' },
    { comp: 'Disk Storage', spec: '200 GB NVMe / SSD recommended (RAID 10 recommended)' },
    { comp: 'Operating System', spec: 'Ubuntu 22.04 LTS / RHEL 8.x, 9.x / Windows Server 2019/2022' },
    { comp: 'Database Engine', spec: 'PostgreSQL 14+ / TimescaleDB / MySQL Enterprise 8.0+' }
  ];

  let rY = tableTop + 42;
  reqRows.forEach((r, idx) => {
    if (idx % 2 === 1) {
      doc.rect(41, rY - 6, 513, 34).fill('#F8FAFC');
    }
    doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold').text(r.comp, col1X, rY);
    doc.fillColor('#334155').fontSize(10).font('Helvetica').text(r.spec, col2X, rY);
    rY += 36;
  });

  // Product by section
  doc.roundedRect(40, 360, 515, 360, 8).fillAndStroke('#F8FAFC', '#CBD5E1');

  doc.fillColor('#0F172A').fontSize(22).font('Helvetica-Bold').text('KavachIQ NMS', 40, 390, { align: 'center' });
  doc.fillColor('#EA580C').fontSize(12).font('Helvetica-Bold').text('SEE IT ALL. SOLVE IT FAST.', 40, 420, { align: 'center' });

  doc.fillColor('#64748B').fontSize(10).font('Helvetica-Bold').text('PRODUCT BY', 40, 460, { align: 'center' });
  doc.fillColor('#0F172A').fontSize(16).font('Helvetica-Bold').text('Ripplewave Solutions Pvt Ltd & GTS Technosoft AI', 40, 480, { align: 'center' });

  // Contact Details Box
  doc.roundedRect(70, 520, 455, 160, 8).fillAndStroke('#FFFFFF', '#E2E8F0');
  doc.rect(70, 520, 455, 28).fill('#2563EB');
  doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold').text('Get In Touch & Schedule a Proof of Concept', 85, 528);

  const contactList = [
    { label: 'Company:', val: 'Ripplewave Solutions Pvt Ltd / GTS Technosoft AI LLP' },
    { label: 'Official Website:', val: 'www.gtstech.ai  |  www.ripplewave.in' },
    { label: 'Technical Sales:', val: '+91 9881351110  |  contact@gtstech.ai' },
    { label: 'Product Support:', val: 'support@ripplewave.in  |  tac@gtstech.ai' }
  ];

  let cY = 560;
  contactList.forEach(cl => {
    doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold').text(cl.label, 90, cY);
    doc.fillColor('#2563EB').fontSize(10).font('Helvetica').text(cl.val, 200, cY);
    cY += 26;
  });

  doc.end();

  writeStream.on('finish', () => {
    console.log(`Generated NMS Datasheet at: ${outputPath}`);
    // Duplicate to generic name if needed
    fs.copyFileSync(outputPath, path.join(outputDir, 'KavachIQ_NMS_Datasheet.pdf'));
  });
}

function generateOtherDatasheets() {
  const products = [
    { key: 'ITSM', file: 'KavachIQ_ITSM_ServiceDesk_Datasheet_v2.5.pdf', title: 'KavachIQ ITSM - ITIL ServiceDesk & Asset Lifecycle', color: '#4F46E5' },
    { key: 'SIEM', file: 'KavachIQ_SIEM_Threat_Defense_Datasheet_v3.1.pdf', title: 'KavachIQ SIEM - Threat Detection & Compliance Analytics', color: '#D97706' },
    { key: 'Syslog', file: 'KavachIQ_Syslog_Manager_Datasheet_v1.9.pdf', title: 'KavachIQ Syslog Manager - High-Throughput Log Aggregator', color: '#059669' },
    { key: 'Config', file: 'KavachIQ_Config_Manager_Datasheet_v2.1.pdf', title: 'KavachIQ Config Manager - NCCM & Automation Engine', color: '#7C3AED' }
  ];

  products.forEach(prod => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 40, bottom: 40, left: 40, right: 40 } });
    const pPath = path.join(outputDir, prod.file);
    const ws = fs.createWriteStream(pPath);
    doc.pipe(ws);

    doc.rect(0, 0, 595.28, 60).fill('#0F172A');
    doc.fillColor('#FFFFFF').fontSize(14).font('Helvetica-Bold').text(prod.title, 40, 22);

    doc.fillColor('#0F172A').fontSize(24).font('Helvetica-Bold').text(prod.title, 40, 100);
    doc.fillColor('#EA580C').fontSize(12).font('Helvetica-Bold').text('ENTERPRISE PRODUCT DATASHEET & ARCHITECTURAL SPECIFICATION', 40, 135);

    doc.roundedRect(40, 170, 515, 500, 8).fillAndStroke('#F8FAFC', '#E2E8F0');
    doc.fillColor('#1E293B').fontSize(11).font('Helvetica').text(
      `Official technical documentation and engineering specification for ${prod.title}.\n\n` +
      `Includes protocol coverage, high availability deployment matrices, API integrations, security certifications, and system benchmarks.`,
      60, 200, { width: 475, lineGap: 6 }
    );

    doc.rect(0, 841.89 - 30, 595.28, 30).fill('#0F172A');
    doc.fillColor('#94A3B8').fontSize(9).font('Helvetica').text('GTS Technosoft AI | www.gtstech.ai', 40, 841.89 - 20);

    doc.end();
  });
}

generateNMSDatasheet();
generateOtherDatasheets();
