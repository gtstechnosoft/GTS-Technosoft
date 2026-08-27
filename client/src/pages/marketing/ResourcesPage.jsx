import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, BookOpen, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const resources = [
  {
    type: 'Datasheet',
    title: 'KavachIQ NMS Enterprise Specification & MIB Reference',
    format: 'PDF (2.4 MB)',
    desc: 'Complete architectural specification of the distributed polling daemon, NetFlow template cache, and hardware support matrix.'
  },
  {
    type: 'Whitepaper',
    title: 'High-Throughput Syslog Ingestion (>250k EPS) at Enterprise Scale',
    format: 'PDF (3.8 MB)',
    desc: 'Benchmark study on zero-drop log pipelines, zstandard index compression, and NVMe tiering in air-gapped SOCs.'
  },
  {
    type: 'Architecture Guide',
    title: 'MITRE ATT&CK Matrix v14.1 Correlation Blueprint for KavachIQ SIEM',
    format: 'PDF (4.1 MB)',
    desc: 'Comprehensive mapping of 1,200+ correlation queries across Enterprise Windows, Linux, and Cloud telemetry.'
  },
  {
    type: 'Compliance Brief',
    title: 'Automating RBI & ISO 27001 Cybersecurity Framework Audits',
    format: 'PDF (1.9 MB)',
    desc: 'Regulatory compliance handbook demonstrating how KavachIQ Config Manager and Syslog Manager fulfill stringent controls.'
  }
];

export const ResourcesPage = () => {
  const toast = useToast();

  const handleDownload = (title) => {
    toast.success(`Resource downloaded: ${title}`);
    const link = document.createElement('a');
    if (title.includes('KavachIQ NMS')) {
      link.href = '/datasheets/KavachIQ_NMS_Enterprise_Datasheet_v4.2.pdf';
      link.setAttribute('download', 'KavachIQ_NMS_Enterprise_Datasheet_v4.2.pdf');
    } else if (title.includes('Syslog')) {
      link.href = '/datasheets/KavachIQ_Syslog_Manager_Datasheet_v1.9.pdf';
      link.setAttribute('download', 'KavachIQ_Syslog_Manager_Datasheet_v1.9.pdf');
    } else if (title.includes('SIEM') || title.includes('ATT&CK')) {
      link.href = '/datasheets/KavachIQ_SIEM_Threat_Defense_Datasheet_v3.1.pdf';
      link.setAttribute('download', 'KavachIQ_SIEM_Threat_Defense_Datasheet_v3.1.pdf');
    } else if (title.includes('Config') || title.includes('Compliance')) {
      link.href = '/datasheets/KavachIQ_Config_Manager_Datasheet_v2.1.pdf';
      link.setAttribute('download', 'KavachIQ_Config_Manager_Datasheet_v2.1.pdf');
    } else {
      link.href = '/datasheets/KavachIQ_NMS_Enterprise_Datasheet_v4.2.pdf';
      link.setAttribute('download', `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    }
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">
            TECHNICAL LIBRARY & RESEARCH
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Datasheets, Architecture Guides & Whitepapers
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Deep-dive technical resources, compliance blueprints, and deployment benchmarks authored by GTS engineers.
          </p>
        </div>
      </section>

      {/* Resource Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((res, i) => (
            <div
              key={i}
              className="enterprise-card p-8 rounded-3xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-purple-50 text-gts-purple font-bold border border-purple-200">
                    {res.type}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{res.format}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{res.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{res.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleDownload(res.title)}
                  className="flex items-center gap-2 text-xs font-bold text-gts-purple hover:text-gts-orange transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
