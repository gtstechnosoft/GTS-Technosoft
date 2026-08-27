import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, Globe, ArrowUpRight, Lock, Award, Server } from 'lucide-react';

export const Footer = () => {
  const location = useLocation();
  const isPortalRoute = location.pathname.startsWith('/portal') || location.pathname.startsWith('/admin');
  if (isPortalRoute) return null;

  return (
    <footer className="bg-gts-darkest text-slate-300 border-t border-slate-800 transition-colors">
      {/* Upper Footer: Logo, Value Proposition & Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Credentials */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block">
              <div className="bg-white/95 rounded-xl px-3 py-1.5 inline-block">
                <img
                  src="/gts-logo.svg"
                  alt="GTS Technosoft AI"
                  className="h-9 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed">
              <strong>GTS TECHNOSOFT AI LLP</strong> (domain: <code className="text-gts-orange font-mono">gtstech.ai</code>) is an enterprise software OEM delivering high-throughput sovereign observability, SecOps, and ITIL orchestration under the <strong>KavachIQ</strong> brand.
            </p>

            <div className="flex flex-wrap gap-2 text-[10px] font-mono font-bold">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                ISO 27001:2022
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 flex items-center gap-1">
                <Award className="w-3 h-3 text-blue-400" />
                SOC 2 Type II
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                CERT-In Aligned
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 flex items-center gap-1">
                <Server className="w-3 h-3 text-purple-400" />
                Air-Gap Ready
              </span>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="space-y-3 text-xs">
            <h4 className="font-mono font-bold uppercase tracking-wider text-white">
              KavachIQ Suite
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link to="/products/nms" className="hover:text-white hover:underline transition-colors">
                  KavachIQ NMS (Observability)
                </Link>
              </li>
              <li>
                <Link to="/products/itsm" className="hover:text-white hover:underline transition-colors">
                  KavachIQ ITSM (ServiceDesk)
                </Link>
              </li>
              <li>
                <Link to="/products/siem" className="hover:text-white hover:underline transition-colors">
                  KavachIQ SIEM (SecOps)
                </Link>
              </li>
              <li>
                <Link to="/products/syslog-manager" className="hover:text-white hover:underline transition-colors">
                  KavachIQ Syslog Manager
                </Link>
              </li>
              <li>
                <Link to="/products/config-manager" className="hover:text-white hover:underline transition-colors">
                  KavachIQ Config Manager (NCCM)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Solutions & Industries */}
          <div className="space-y-3 text-xs">
            <h4 className="font-mono font-bold uppercase tracking-wider text-white">
              Industries & Solutions
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link to="/industries" className="hover:text-white hover:underline transition-colors">
                  Banking & Financial Services (BFSI)
                </Link>
              </li>
              <li>
                <Link to="/industries" className="hover:text-white hover:underline transition-colors">
                  Telecom & 5G Service Providers
                </Link>
              </li>
              <li>
                <Link to="/industries" className="hover:text-white hover:underline transition-colors">
                  Government & Sovereign Defense
                </Link>
              </li>
              <li>
                <Link to="/industries" className="hover:text-white hover:underline transition-colors">
                  Critical Infrastructure
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-white hover:underline transition-colors">
                  Zero-Trust SecOps Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate & Portal */}
          <div className="space-y-3 text-xs">
            <h4 className="font-mono font-bold uppercase tracking-wider text-white">
              OEM & Resources
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link to="/login" className="hover:text-white font-bold text-gts-orange transition-colors">
                  Customer Licensing Portal →
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white hover:underline transition-colors">
                  Datasheets & Whitepapers
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="hover:text-white hover:underline transition-colors">
                  REST API & CLI Documentation
                </Link>
              </li>
              <li>
                <Link to="/partners" className="hover:text-white hover:underline transition-colors">
                  OEM & Partner Program
                </Link>
              </li>
              <li>
                <Link to="/company" className="hover:text-white hover:underline transition-colors">
                  Company Leadership & Trust
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Compliance */}
      <div className="border-t border-slate-800 bg-[#040C1C] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 <strong>GTS TECHNOSOFT AI LLP</strong>. All Rights Reserved. <strong>KavachIQ</strong> is a registered trademark of GTS TECHNOSOFT AI LLP.
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <Link to="/company" className="hover:text-white hover:underline">Privacy Policy</Link>
            <Link to="/company" className="hover:text-white hover:underline">Terms of Service</Link>
            <Link to="/company#security" className="hover:text-white hover:underline">Security Whitepaper</Link>
            <span className="text-slate-500">v4.3.0-GA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
