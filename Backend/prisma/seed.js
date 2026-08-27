const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const licenseSigner = require('../src/services/licenseSigner');
const storageService = require('../src/services/storageService');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting GTS Technosoft AI (KavachIQ) Database Seeding ---');

  // Clear existing records if needed (in cascade order)
  await prisma.auditEvent.deleteMany({});
  await prisma.supportCase.deleteMany({});
  await prisma.trial.deleteMany({});
  await prisma.installation.deleteMany({});
  await prisma.license.deleteMany({});
  await prisma.entitlement.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.release.deleteMany({});
  await prisma.edition.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.lead.deleteMany({});

  console.log('[+] Existing records cleaned.');

  // 1. Create Organizations
  const internalOrg = await prisma.organization.create({
    data: {
      legal_name: 'GTS TECHNOSOFT AI LLP',
      display_name: 'GTS Technosoft AI HQ',
      billing_country: 'India',
      domain: 'gtstech.ai',
      tier: 'Internal OEM',
      status: 'ACTIVE'
    }
  });

  const acroOrg = await prisma.organization.create({
    data: {
      legal_name: 'Acro Corp Global Technologies',
      display_name: 'Acro Corp Global',
      billing_country: 'United States',
      domain: 'acrocorp.com',
      tier: 'Enterprise Platinum',
      status: 'ACTIVE'
    }
  });

  const fintechOrg = await prisma.organization.create({
    data: {
      legal_name: 'FinTech Shield Ltd',
      display_name: 'FinTech Shield',
      billing_country: 'Singapore',
      domain: 'fintechshield.com',
      tier: 'Enterprise Diamond',
      status: 'ACTIVE'
    }
  });

  const cyberSecureOrg = await prisma.organization.create({
    data: {
      legal_name: 'CyberSecure India Systems Pvt Ltd',
      display_name: 'CyberSecure India',
      billing_country: 'India',
      domain: 'cybersecure.in',
      tier: 'Commercial Standard',
      status: 'ACTIVE'
    }
  });

  console.log('[+] Organizations created.');

  // 2. Create Users
  const adminPassHash = await bcrypt.hash('Admin@GTS2026!', 12);
  const customerPassHash = await bcrypt.hash('Customer@2026!', 12);

  const internalAdminUser = await prisma.user.create({
    data: {
      org_id: internalOrg.id,
      email: 'admin@gtstech.ai',
      first_name: 'Aarav',
      last_name: 'Sharma',
      role: 'INTERNAL_ADMIN',
      password_hash: adminPassHash,
      mfa_enabled: false,
      status: 'ACTIVE'
    }
  });

  const customerAdminUser = await prisma.user.create({
    data: {
      org_id: acroOrg.id,
      email: 'admin@acrocorp.com',
      first_name: 'Vikram',
      last_name: 'Malhotra',
      role: 'ORG_ADMIN',
      password_hash: customerPassHash,
      mfa_enabled: false,
      status: 'ACTIVE'
    }
  });

  const softwareAdminUser = await prisma.user.create({
    data: {
      org_id: acroOrg.id,
      email: 'devops@acrocorp.com',
      first_name: 'Elena',
      last_name: 'Rostova',
      role: 'SOFTWARE_ADMIN',
      password_hash: customerPassHash,
      mfa_enabled: false,
      status: 'ACTIVE'
    }
  });

  const fintechAdminUser = await prisma.user.create({
    data: {
      org_id: fintechOrg.id,
      email: 'security@fintechshield.com',
      first_name: 'Rajesh',
      last_name: 'Verma',
      role: 'ORG_ADMIN',
      password_hash: customerPassHash,
      mfa_enabled: false,
      status: 'ACTIVE'
    }
  });

  console.log('[+] Users seeded.');

  // 3. Create Products & Editions
  const productsData = [
    {
      code: 'nms',
      name: 'KavachIQ NMS',
      category: 'Network & Infrastructure Observability',
      tagline: 'Enterprise Network Management & Topology Discovery',
      description: 'Unified full-stack network monitoring, automated multi-vendor topology mapping, NetFlow/sFlow traffic inspection, and real-time interface analytics.',
      icon: 'Network',
      editions: [
        { code: 'standard', name: 'Standard Edition', featureProfile: ['SNMP_MONITORING', 'PING_CHECK', 'BASIC_ALERTS'], releaseChannel: 'stable' },
        { code: 'professional', name: 'Professional Edition', featureProfile: ['SNMP_MONITORING', 'NETFLOW_ANALYSIS', 'TOPOLOGY_DISCOVERY', 'SLACK_PAGERDUTY_INTEGRATION'], releaseChannel: 'stable' },
        { code: 'enterprise', name: 'Enterprise Edition', featureProfile: ['SNMP_MONITORING', 'NETFLOW_ANALYSIS', 'TOPOLOGY_DISCOVERY', 'HA_CLUSTER', 'AI_ANOMALY_DETECTION', 'MULTI_SITE'], releaseChannel: 'stable' },
        { code: 'ultimate', name: 'Ultimate Edition', featureProfile: ['FULL_SUITE', 'UNLIMITED_POLLEKS', 'DISTRIBUTED_COLLECTORS', 'DEDICATED_SLA'], releaseChannel: 'lts' }
      ]
    },
    {
      code: 'itsm',
      name: 'KavachIQ ITSM',
      category: 'IT Service Management & Desk',
      tagline: 'AI-Powered ITIL ServiceDesk & Asset Lifecycle Orchestration',
      description: 'Comprehensive ITIL-aligned service management, intelligent ticket triage, SLA governance, change management workflows, and integrated CMDB asset tracking.',
      icon: 'Headphones',
      editions: [
        { code: 'standard', name: 'Standard Edition', featureProfile: ['INCIDENT_MANAGEMENT', 'BASIC_CMDB', 'PORTAL_ACCESS'], releaseChannel: 'stable' },
        { code: 'enterprise', name: 'Enterprise Edition', featureProfile: ['INCIDENT_MANAGEMENT', 'CHANGE_PROBLEM_MANAGEMENT', 'AI_AUTO_ROUTING', 'FULL_CMDB', 'ENTERPRISE_SLA'], releaseChannel: 'stable' }
      ]
    },
    {
      code: 'siem',
      name: 'KavachIQ SIEM',
      category: 'Security Operations & Threat Defense',
      tagline: 'Real-Time Threat Detection & Compliance Security Analytics',
      description: 'Cloud and on-premise security information & event management with MITRE ATT&CK correlation rules, behavioral threat intelligence, and out-of-the-box regulatory compliance reporting.',
      icon: 'ShieldAlert',
      editions: [
        { code: 'standard', name: 'Standard Edition', featureProfile: ['LOG_INGESTION', 'BASIC_CORRELATION', 'HIPAA_PCI_REPORTS'], releaseChannel: 'stable' },
        { code: 'enterprise', name: 'Enterprise Edition', featureProfile: ['LOG_INGESTION', 'ADVANCED_MITRE_CORRELATION', 'UEBA_ANOMALY_DETECTION', 'SOAR_PLAYBOOKS', '24X7_HOT_STORAGE'], releaseChannel: 'stable' },
        { code: 'ultimate', name: 'Ultimate Edition', featureProfile: ['FULL_SIEM_SOAR', 'AI_DEFENSE_LLM', 'MULTI_TENANT_MSSP', 'CUSTOM_PARSER_STUDIO'], releaseChannel: 'lts' }
      ]
    },
    {
      code: 'syslog-manager',
      name: 'KavachIQ Syslog Manager',
      category: 'Centralized Log Aggregation',
      tagline: 'High-Throughput Log Aggregator & Forensic Search Engine',
      description: 'Process and index over 250,000 logs/second across Linux, Windows, Cisco, and cloud endpoints with sub-second full-text search and encrypted tamper-proof archival.',
      icon: 'FileText',
      editions: [
        { code: 'standard', name: 'Standard Edition', featureProfile: ['SYSLOG_COLLECTION', 'RETENTION_30D', 'BASIC_FILTERING'], releaseChannel: 'stable' },
        { code: 'enterprise', name: 'Enterprise Edition', featureProfile: ['SYSLOG_COLLECTION', 'RETENTION_365D', 'GEO_IP_ENRICHMENT', 'COMPLIANCE_ARCHIVAL', 'HIGH_IOPS_INDEXING'], releaseChannel: 'stable' }
      ]
    },
    {
      code: 'config-manager',
      name: 'KavachIQ Config Manager',
      category: 'Network Automation & Governance',
      tagline: 'Network Configuration, Change & Compliance Management (NCCM)',
      description: 'Automated configuration backups, real-time drift detection, zero-touch provisioning, and policy compliance enforcement across multi-vendor routers, switches, and firewalls.',
      icon: 'Sliders',
      editions: [
        { code: 'standard', name: 'Standard Edition', featureProfile: ['AUTO_BACKUP', 'DIFF_VIEW', 'ROLLBACK'], releaseChannel: 'stable' },
        { code: 'enterprise', name: 'Enterprise Edition', featureProfile: ['AUTO_BACKUP', 'CONFIG_DRIFT_ALERTS', 'COMPLIANCE_CIS_DISA', 'BULK_PUSH_TEMPLATES', 'CLI_TERMINAL_SESSION_RECORD'], releaseChannel: 'stable' }
      ]
    }
  ];

  const createdProducts = {};
  const createdEditions = {};

  for (const p of productsData) {
    const product = await prisma.product.create({
      data: {
        code: p.code,
        name: p.name,
        category: p.category,
        tagline: p.tagline,
        description: p.description,
        lifecycle_state: 'GA',
        icon: p.icon
      }
    });
    createdProducts[p.code] = product;

    for (const ed of p.editions) {
      const edition = await prisma.edition.create({
        data: {
          product_id: product.id,
          code: ed.code,
          name: ed.name,
          feature_profile: ed.featureProfile,
          release_channel: ed.releaseChannel
        }
      });
      createdEditions[`${p.code}_${ed.code}`] = edition;
    }
  }

  console.log('[+] Products and Editions populated.');

  // 4. Create Subscriptions, Entitlements & Cryptographic Licenses
  // Acro Corp -> KavachIQ NMS Enterprise
  const nmsSub = await prisma.subscription.create({
    data: {
      org_id: acroOrg.id,
      product_id: createdProducts['nms'].id,
      start_date: new Date('2026-01-01'),
      end_date: new Date('2027-01-01'),
      support_plan: '24x7 Enterprise Platinum',
      status: 'ACTIVE'
    }
  });

  const nmsEnt = await prisma.entitlement.create({
    data: {
      subscription_id: nmsSub.id,
      edition_id: createdEditions['nms_enterprise'].id,
      metric_type: 'NODES',
      metric_limit: 1000,
      activation_limit: 5,
      features: ['HA_CLUSTER', 'TOPOLOGY_DISCOVERY', 'NETFLOW', 'AI_ANOMALY_DETECTION']
    }
  });

  const nmsLicenseKey = 'KAV-NMS-ENT-9482-1102-A88F';
  const nmsLicensePayload = {
    license_key: nmsLicenseKey,
    organization: { id: acroOrg.id, legal_name: acroOrg.legal_name },
    product: { id: createdProducts['nms'].id, code: 'nms', name: 'KavachIQ NMS' },
    edition: { id: createdEditions['nms_enterprise'].id, code: 'enterprise', name: 'Enterprise Edition' },
    entitlement: { metric_type: 'NODES', metric_limit: 1000, activation_limit: 5 },
    license_type: 'SUBSCRIPTION',
    validity: { issued_at: '2026-01-01T00:00:00Z', expires_at: '2027-01-01T00:00:00Z' }
  };
  const nmsSigned = licenseSigner.signLicense(nmsLicensePayload);

  const nmsLicense = await prisma.license.create({
    data: {
      entitlement_id: nmsEnt.id,
      license_type: 'SUBSCRIPTION',
      license_key: nmsLicenseKey,
      issue_date: new Date('2026-01-01'),
      expiry_date: new Date('2027-01-01'),
      signing_key_id: nmsSigned.keyId,
      status: 'ACTIVE',
      signed_payload: nmsSigned.signedPayload,
      signature: nmsSigned.signature
    }
  });

  // Acro Corp -> KavachIQ SIEM Enterprise
  const siemSub = await prisma.subscription.create({
    data: {
      org_id: acroOrg.id,
      product_id: createdProducts['siem'].id,
      start_date: new Date('2026-02-15'),
      end_date: new Date('2027-02-15'),
      support_plan: '24x7 Enterprise Platinum',
      status: 'ACTIVE'
    }
  });

  const siemEnt = await prisma.entitlement.create({
    data: {
      subscription_id: siemSub.id,
      edition_id: createdEditions['siem_enterprise'].id,
      metric_type: 'EPS',
      metric_limit: 2500,
      activation_limit: 3,
      features: ['LOG_INGESTION', 'ADVANCED_MITRE_CORRELATION', 'SOAR_PLAYBOOKS']
    }
  });

  const siemLicenseKey = 'KAV-SEM-ENT-8831-9014-C44D';
  const siemLicensePayload = {
    license_key: siemLicenseKey,
    organization: { id: acroOrg.id, legal_name: acroOrg.legal_name },
    product: { id: createdProducts['siem'].id, code: 'siem', name: 'KavachIQ SIEM' },
    edition: { id: createdEditions['siem_enterprise'].id, code: 'enterprise', name: 'Enterprise Edition' },
    entitlement: { metric_type: 'EPS', metric_limit: 2500, activation_limit: 3 },
    license_type: 'SUBSCRIPTION',
    validity: { issued_at: '2026-02-15T00:00:00Z', expires_at: '2027-02-15T00:00:00Z' }
  };
  const siemSigned = licenseSigner.signLicense(siemLicensePayload);

  const siemLicense = await prisma.license.create({
    data: {
      entitlement_id: siemEnt.id,
      license_type: 'SUBSCRIPTION',
      license_key: siemLicenseKey,
      issue_date: new Date('2026-02-15'),
      expiry_date: new Date('2027-02-15'),
      signing_key_id: siemSigned.keyId,
      status: 'ACTIVE',
      signed_payload: siemSigned.signedPayload,
      signature: siemSigned.signature
    }
  });

  // FinTech Shield -> KavachIQ SIEM Ultimate
  const fintechSub = await prisma.subscription.create({
    data: {
      org_id: fintechOrg.id,
      product_id: createdProducts['siem'].id,
      start_date: new Date('2026-01-10'),
      end_date: new Date('2027-01-10'),
      support_plan: 'Mission-Critical Diamond Support',
      status: 'ACTIVE'
    }
  });

  const fintechEnt = await prisma.entitlement.create({
    data: {
      subscription_id: fintechSub.id,
      edition_id: createdEditions['siem_ultimate'].id,
      metric_type: 'EPS',
      metric_limit: 10000,
      activation_limit: 10,
      features: ['FULL_SIEM_SOAR', 'AI_DEFENSE_LLM', 'MULTI_TENANT_MSSP']
    }
  });

  const fintechLicenseKey = 'KAV-SEM-ULT-7719-2041-B99A';
  const fintechSigned = licenseSigner.signLicense({
    license_key: fintechLicenseKey,
    organization: { id: fintechOrg.id, legal_name: fintechOrg.legal_name },
    product: { id: createdProducts['siem'].id, code: 'siem', name: 'KavachIQ SIEM' },
    edition: { id: createdEditions['siem_ultimate'].id, code: 'ultimate', name: 'Ultimate Edition' },
    entitlement: { metric_type: 'EPS', metric_limit: 10000, activation_limit: 10 },
    license_type: 'SUBSCRIPTION',
    validity: { issued_at: '2026-01-10T00:00:00Z', expires_at: '2027-01-10T00:00:00Z' }
  });

  await prisma.license.create({
    data: {
      entitlement_id: fintechEnt.id,
      license_type: 'SUBSCRIPTION',
      license_key: fintechLicenseKey,
      issue_date: new Date('2026-01-10'),
      expiry_date: new Date('2027-01-10'),
      signing_key_id: fintechSigned.keyId,
      status: 'ACTIVE',
      signed_payload: fintechSigned.signedPayload,
      signature: fintechSigned.signature
    }
  });

  console.log('[+] Subscriptions, Entitlements and Cryptographic Licenses seeded.');

  // 5. Create Registered Installations
  await prisma.installation.createMany({
    data: [
      {
        org_id: acroOrg.id,
        license_id: nmsLicense.id,
        product_id: createdProducts['nms'].id,
        version: '4.2.1-lts',
        alias: 'us-east-nms-core-01',
        os: 'Red Hat Enterprise Linux 9.2 (x86_64)',
        ip_address: '10.240.12.88',
        activation_status: 'ACTIVE',
        last_contact: new Date(),
        system_fingerprint: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
      },
      {
        org_id: acroOrg.id,
        license_id: nmsLicense.id,
        product_id: createdProducts['nms'].id,
        version: '4.2.1-lts',
        alias: 'eu-west-poller-gateway',
        os: 'Ubuntu 24.04 LTS (x86_64)',
        ip_address: '10.180.44.12',
        activation_status: 'ACTIVE',
        last_contact: new Date(Date.now() - 15 * 60 * 1000),
        system_fingerprint: 'SHA256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
      },
      {
        org_id: acroOrg.id,
        license_id: siemLicense.id,
        product_id: createdProducts['siem'].id,
        version: '3.1.0-ga',
        alias: 'secops-siem-collector-ha',
        os: 'Rocky Linux 9.3 (x86_64)',
        ip_address: '172.16.50.10',
        activation_status: 'ACTIVE',
        last_contact: new Date(),
        system_fingerprint: 'SHA256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d'
      }
    ]
  });

  console.log('[+] Installations registered.');

  // 6. Create Software Releases
  const releasesData = [
    {
      product_id: createdProducts['nms'].id,
      edition_id: createdEditions['nms_enterprise'].id,
      version: '4.2.1-lts',
      package_type: 'tar.gz',
      platform: 'linux-x86_64',
      checksum: storageService.generateChecksum('KAVACHIQ-NMS-4.2.1-LINUX-BINARY'),
      storage_path: '/storage/packages/nms/4.2.1/kavachiq-nms-4.2.1-linux-x86_64.tar.gz',
      file_size_bytes: BigInt(482344960),
      release_channel: 'lts',
      release_notes: 'LTS Release 4.2.1: Includes high-availability distributed polling failover, NetFlow v9 sampling engine optimizations, and enhanced topology discovery for Cisco Catalyst 9000 & Arista EOS.',
      download_count: 142
    },
    {
      product_id: createdProducts['nms'].id,
      edition_id: createdEditions['nms_enterprise'].id,
      version: '4.2.1-lts',
      package_type: 'msi',
      platform: 'windows-x64',
      checksum: storageService.generateChecksum('KAVACHIQ-NMS-4.2.1-WIN-BINARY'),
      storage_path: '/storage/packages/nms/4.2.1/kavachiq-nms-4.2.1-windows-x64.msi',
      file_size_bytes: BigInt(512400128),
      release_channel: 'lts',
      release_notes: 'Windows Server 2019/2022 Installer for KavachIQ NMS with native Windows Service integration.',
      download_count: 88
    },
    {
      product_id: createdProducts['siem'].id,
      edition_id: createdEditions['siem_enterprise'].id,
      version: '3.1.0-ga',
      package_type: 'tar.gz',
      platform: 'linux-x86_64',
      checksum: storageService.generateChecksum('KAVACHIQ-SIEM-3.1.0-LINUX-BINARY'),
      storage_path: '/storage/packages/siem/3.1.0/kavachiq-siem-3.1.0-linux-x86_64.tar.gz',
      file_size_bytes: BigInt(629145600),
      release_channel: 'stable',
      release_notes: 'GA Release 3.1.0: Advanced MITRE ATT&CK matrix correlation rules (v14.1), automated SOAR webhook dispatchers, and sub-second timeline threat query engine.',
      download_count: 95
    },
    {
      product_id: createdProducts['itsm'].id,
      edition_id: createdEditions['itsm_enterprise'].id,
      version: '2.5.0-ga',
      package_type: 'tar.gz',
      platform: 'linux-x86_64',
      checksum: storageService.generateChecksum('KAVACHIQ-ITSM-2.5.0-LINUX-BINARY'),
      storage_path: '/storage/packages/itsm/2.5.0/kavachiq-itsm-2.5.0-linux-x86_64.tar.gz',
      file_size_bytes: BigInt(340787200),
      release_channel: 'stable',
      release_notes: 'ITSM 2.5.0 includes ITIL v4 compliant Change Advisory Board (CAB) workflows, integrated CMDB dependency trees, and Slack/Teams chatops integration.',
      download_count: 67
    },
    {
      product_id: createdProducts['syslog-manager'].id,
      edition_id: createdEditions['syslog-manager_enterprise'].id,
      version: '1.9.4-ga',
      package_type: 'tar.gz',
      platform: 'linux-x86_64',
      checksum: storageService.generateChecksum('KAVACHIQ-SYSLOG-1.9.4-LINUX-BINARY'),
      storage_path: '/storage/packages/syslog-manager/1.9.4/kavachiq-syslog-1.9.4-linux-x86_64.tar.gz',
      file_size_bytes: BigInt(188743680),
      release_channel: 'stable',
      release_notes: 'Ultra high-throughput syslog indexing release capable of sustained 250k EPS ingestion with gzip compressed cold archive vaults.',
      download_count: 53
    },
    {
      product_id: createdProducts['config-manager'].id,
      edition_id: createdEditions['config-manager_enterprise'].id,
      version: '2.1.2-ga',
      package_type: 'tar.gz',
      platform: 'linux-x86_64',
      checksum: storageService.generateChecksum('KAVACHIQ-CONFIG-2.1.2-LINUX-BINARY'),
      storage_path: '/storage/packages/config-manager/2.1.2/kavachiq-nccm-2.1.2-linux-x86_64.tar.gz',
      file_size_bytes: BigInt(220200960),
      release_channel: 'stable',
      release_notes: 'Network Configuration & Compliance Manager with automated CIS Benchmark policy checks and mass zero-touch push templates.',
      download_count: 41
    }
  ];

  for (const rel of releasesData) {
    await prisma.release.create({ data: rel });
  }

  console.log('[+] Software Releases populated.');

  // 7. Create Support Cases
  await prisma.supportCase.createMany({
    data: [
      {
        org_id: acroOrg.id,
        created_by: customerAdminUser.id,
        subject: 'Cisco 9300 NetFlow v9 packet parser interface drop alert',
        description: 'Our core switch cluster in US-East is sending NetFlow v9 templates with customized enterprise fields. Need assistance tuning the poller template cache.',
        severity: 'P2_HIGH',
        status: 'IN_PROGRESS',
        sla_target_hours: 4,
        assigned_to: 'Tier 3 NetOps TAC'
      },
      {
        org_id: acroOrg.id,
        created_by: softwareAdminUser.id,
        subject: 'Request assistance with custom MITRE ATT&CK correlation query syntax',
        description: 'We are authoring custom detection rules for T1059.001 (PowerShell) execution in our AWS EC2 environment.',
        severity: 'P3_MEDIUM',
        status: 'NEW',
        sla_target_hours: 8
      },
      {
        org_id: fintechOrg.id,
        created_by: fintechAdminUser.id,
        subject: 'SIEM High-Availability Cluster automated failover test validation',
        description: 'Scheduled maintenance this Saturday to perform active-passive node failover test on KavachIQ SIEM 3.1.0.',
        severity: 'P3_MEDIUM',
        status: 'RESOLVED',
        sla_target_hours: 8,
        resolution_notes: 'Assisted customer team via screen share session. HA state machine synchronized cleanly within 1.8 seconds.'
      }
    ]
  });

  console.log('[+] Support cases seeded.');

  // 8. Create Trials & Leads
  await prisma.trial.create({
    data: {
      org_id: cyberSecureOrg.id,
      user_id: customerAdminUser.id,
      product_id: createdProducts['config-manager'].id,
      edition_id: createdEditions['config-manager_enterprise'].id,
      status: 'PENDING_APPROVAL',
      node_limit: 150,
      notes: 'Evaluating for 150 branch office routers and Cisco Nexus switches.'
    }
  });

  await prisma.lead.createMany({
    data: [
      {
        full_name: 'Ananya Deshmukh',
        email: 'ananya@hdfcbank-demo.in',
        company: 'Apex Banking Corp',
        phone: '+91 98201 12345',
        job_title: 'Head of Infrastructure & SecOps',
        product_interest: 'Full KavachIQ Enterprise Suite',
        fleet_size: '1000+ nodes',
        message: 'Looking to replace legacy MicroFocus and SolarWinds deployments with KavachIQ NMS + SIEM across 8 data centers.',
        request_type: 'DEMO',
        status: 'QUALIFIED'
      },
      {
        full_name: 'Marcus Vance',
        email: 'm.vance@cloudscaleglobal.com',
        company: 'CloudScale Global MSP',
        phone: '+1 (415) 890-3321',
        job_title: 'VP of Managed Services',
        product_interest: 'KavachIQ SIEM',
        fleet_size: '500-1000 nodes',
        message: 'Interested in multi-tenant MSSP licensing model for 25 customer accounts.',
        request_type: 'PARTNER_INQUIRY',
        status: 'NEW'
      }
    ]
  });

  // 9. Create Audit Events
  await prisma.auditEvent.createMany({
    data: [
      {
        actor_id: internalAdminUser.id,
        org_id: internalOrg.id,
        action: 'SYSTEM_INITIALIZED',
        target: 'Platform:KavachIQ-2026',
        metadata: { version: '1.0.0', seed: true },
        ip_address: '127.0.0.1'
      },
      {
        actor_id: internalAdminUser.id,
        org_id: acroOrg.id,
        action: 'ADMIN_LICENSE_ISSUED',
        target: `License:${nmsLicenseKey}`,
        metadata: { product: 'KavachIQ NMS', metric: '1000 NODES' },
        ip_address: '127.0.0.1'
      },
      {
        actor_id: customerAdminUser.id,
        org_id: acroOrg.id,
        action: 'AUTH_LOGIN_SUCCESS',
        target: `User:${customerAdminUser.email}`,
        metadata: { loginType: 'STANDARD_PASSWORD' },
        ip_address: '198.51.100.42'
      },
      {
        actor_id: customerAdminUser.id,
        org_id: acroOrg.id,
        action: 'LICENSE_DOWNLOADED',
        target: `License:${nmsLicenseKey}`,
        metadata: { filename: 'KavachIQ_NMS_KAV-NMS-ENT-9482-1102-A88F.lic' },
        ip_address: '198.51.100.42'
      }
    ]
  });

  console.log('[+] Audit events logged.');
  console.log('================================================================');
  console.log(' SEEDING COMPLETE!');
  console.log(' Demo Admin Account:');
  console.log('   Email:    admin@gtstech.ai');
  console.log('   Password: Admin@GTS2026!');
  console.log('   Role:     INTERNAL_ADMIN');
  console.log('');
  console.log(' Demo Customer Account:');
  console.log('   Email:    admin@acrocorp.com');
  console.log('   Password: Customer@2026!');
  console.log('   Role:     ORG_ADMIN (Acro Corp Global)');
  console.log('================================================================');
}

main()
  .catch((e) => {
    console.error('[-] Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
