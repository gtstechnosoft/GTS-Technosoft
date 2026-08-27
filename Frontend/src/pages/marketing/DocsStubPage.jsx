import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Terminal, Code2, Server, Download, ArrowRight, ExternalLink } from 'lucide-react';

export const DocsStubPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-gts-purple font-bold">
            DOCUMENTATION HUB
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            KavachIQ Technical Documentation
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Installation guides, REST API specifications, CLI reference, and architecture manuals.
          </p>
        </div>
      </section>

      {/* Docs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="enterprise-card p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-gts-purple flex items-center justify-center">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Quickstart & Deployment</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Step-by-step guides for installing KavachIQ core server, poller daemons, and collectors on RHEL, Ubuntu, and Windows Server.
            </p>
            <div className="text-xs font-mono bg-slate-900 p-3.5 rounded-xl border border-slate-700 text-emerald-400">
              curl -sSL https://get.gtstech.ai/install.sh | sudo bash
            </div>
          </div>

          <div className="enterprise-card p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-gts-purple flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">REST API Reference</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Complete OpenAPI 3.0 specification for automating license deployment, querying telemetry metrics, and dispatching SOAR webhooks.
            </p>
            <div className="text-xs font-mono bg-slate-900 p-3.5 rounded-xl border border-slate-700 text-slate-300">
              GET /api/v1/telemetry/nodes
            </div>
          </div>

          <div className="enterprise-card p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-gts-purple flex items-center justify-center">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">CLI Tool (`kavachiq-ctl`)</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Manage node registration, cryptographic license key activation, cluster health verification, and diagnostics from your terminal.
            </p>
            <div className="text-xs font-mono bg-slate-900 p-3.5 rounded-xl border border-slate-700 text-gts-orange">
              kavachiq-ctl license load /path/license.lic
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-900 text-base">Looking for enterprise product support?</h4>
            <p className="text-xs text-slate-500 mt-0.5">Existing licensees can submit P1-P4 support tickets directly via the customer portal.</p>
          </div>
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl bg-gts-navy hover:bg-gts-darkest text-white text-xs font-bold transition-colors"
          >
            Customer Portal Support
          </Link>
        </div>
      </section>
    </div>
  );
};
