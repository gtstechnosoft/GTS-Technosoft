import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Network,
  Headphones,
  ShieldAlert,
  FileText,
  Sliders,
  ChevronDown,
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  Sparkles,
  ArrowRight,
  Globe,
  ExternalLink
} from 'lucide-react';

const products = [
  {
    name: 'KavachIQ NMS',
    slug: 'nms',
    icon: Network,
    tagline: 'Network Observability',
    desc: 'Deep multi-vendor SNMP polling, topology auto-discovery & NetFlow v9/IPFIX analytics',
    color: 'bg-blue-600'
  },
  {
    name: 'KavachIQ ITSM',
    slug: 'itsm',
    icon: Headphones,
    tagline: 'ITIL ServiceDesk',
    desc: 'Incident triage, change governance, automated SLA escalation & CMDB lifecycle management',
    color: 'bg-indigo-600'
  },
  {
    name: 'KavachIQ SIEM',
    slug: 'siem',
    icon: ShieldAlert,
    tagline: 'SecOps & Threat Intel',
    desc: 'MITRE ATT&CK correlation, behavioral threat modeling & automated SOAR playbooks',
    color: 'bg-amber-600'
  },
  {
    name: 'KavachIQ Syslog Manager',
    slug: 'syslog-manager',
    icon: FileText,
    tagline: 'High-Throughput Logging',
    desc: '250k+ EPS ingestion, sub-second query & SHA-256 tamper-proof archival',
    color: 'bg-emerald-600'
  },
  {
    name: 'KavachIQ Config Manager',
    slug: 'config-manager',
    icon: Sliders,
    tagline: 'NCCM Governance',
    desc: 'Real-time drift alarms, automated backups, CIS benchmarks & zero-touch push',
    color: 'bg-purple-700'
  }
];

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const { user, isAuthenticated, isInternalAdmin, logout } = useAuth();
  const location = useLocation();

  const isPortalRoute = location.pathname.startsWith('/portal') || location.pathname.startsWith('/admin');
  if (isPortalRoute) return null;

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* GTS Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="h-11 flex items-center">
              <img
                src="/gts-logo.svg"
                alt="GTS Technosoft Logo"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Products Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductsDropdownOpen(true)}
              onMouseLeave={() => setProductsDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  location.pathname.startsWith('/products')
                    ? 'text-gts-purple bg-purple-50/80 font-bold'
                    : 'text-slate-700 hover:text-gts-purple hover:bg-slate-100/80'
                }`}
              >
                <span>Products & Platform</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsDropdownOpen ? 'rotate-180 text-gts-orange' : 'text-slate-400'}`} />
              </button>

              {productsDropdownOpen && (
                <div className="absolute top-full left-0 w-[640px] p-4 rounded-2xl bg-white border border-slate-200 shadow-2xl grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gts-purple font-mono">
                        KavachIQ Commercial Suite
                      </span>
                      <p className="text-[11px] text-slate-500">Autonomous Observability & SecOps Stack</p>
                    </div>
                    <Link
                      to="/products"
                      onClick={() => setProductsDropdownOpen(false)}
                      className="text-xs text-gts-blue font-bold hover:underline flex items-center gap-1"
                    >
                      All Products <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-1 pt-1">
                    {products.map((prod) => {
                      const Icon = prod.icon;
                      return (
                        <Link
                          key={prod.slug}
                          to={`/products/${prod.slug}`}
                          onClick={() => setProductsDropdownOpen(false)}
                          className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group/item"
                        >
                          <div className={`w-10 h-10 rounded-xl ${prod.color} text-white flex items-center justify-center shrink-0 shadow-sm group-hover/item:scale-105 transition-transform`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900 group-hover/item:text-gts-purple transition-colors">{prod.name}</span>
                              <span className="text-[10px] text-gts-orange font-bold font-mono bg-orange-50 px-2 py-0.5 rounded border border-orange-200">{prod.tagline}</span>
                            </div>
                            <span className="text-xs text-slate-600 mt-0.5 line-clamp-1">{prod.desc}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/solutions"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/solutions')
                  ? 'text-gts-purple bg-purple-50/80 font-bold'
                  : 'text-slate-700 hover:text-gts-purple hover:bg-slate-100/80'
              }`}
            >
              Solutions
            </Link>

            <Link
              to="/industries"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/industries')
                  ? 'text-gts-purple bg-purple-50/80 font-bold'
                  : 'text-slate-700 hover:text-gts-purple hover:bg-slate-100/80'
              }`}
            >
              Industries
            </Link>

            <Link
              to="/resources"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/resources')
                  ? 'text-gts-purple bg-purple-50/80 font-bold'
                  : 'text-slate-700 hover:text-gts-purple hover:bg-slate-100/80'
              }`}
            >
              Insights & Research
            </Link>

            <Link
              to="/company"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/company')
                  ? 'text-gts-purple bg-purple-50/80 font-bold'
                  : 'text-slate-700 hover:text-gts-purple hover:bg-slate-100/80'
              }`}
            >
              Company
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={isInternalAdmin ? '/admin' : '/portal'}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gts-navy hover:bg-gts-darkest text-white text-xs font-bold transition-all shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{isInternalAdmin ? 'Admin Control' : 'Customer Portal'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-gts-purple hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/get-started"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gts-orange hover:bg-gts-orange-dark text-white font-bold text-xs shadow-glow-orange transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Request Demo</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/get-started"
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gts-orange text-white"
            >
              Demo
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-4 shadow-xl">
          <div className="text-xs font-mono font-bold uppercase text-gts-orange tracking-wider px-2">
            KavachIQ Products
          </div>
          <div className="grid grid-cols-1 gap-1">
            {products.map((p) => (
              <Link
                key={p.slug}
                to={`/products/${p.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span className="font-bold text-slate-900">{p.name}</span>
                <span className="text-[10px] text-gts-purple font-mono bg-purple-50 px-2 py-0.5 rounded">{p.tagline}</span>
              </Link>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-3 space-y-1 text-xs font-semibold">
            <Link to="/solutions" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg">Solutions</Link>
            <Link to="/industries" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg">Industries</Link>
            <Link to="/resources" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg">Insights & Research</Link>
            <Link to="/partners" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg">Partners</Link>
            <Link to="/company" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg">About GTS</Link>
          </div>
          <div className="border-t border-slate-200 pt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/portal"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-gts-navy text-white font-bold text-xs shadow-md"
              >
                Go to Portal
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold"
                >
                  Sign In
                </Link>
                <Link
                  to="/get-started"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gts-orange text-white font-bold text-xs"
                >
                  Request Enterprise Demo
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
