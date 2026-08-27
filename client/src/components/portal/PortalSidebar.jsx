import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Boxes,
  KeyRound,
  Download,
  FileCheck2,
  Server,
  RefreshCw,
  Headphones,
  Users,
  History,
  Shield,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const portalNavItems = [
  { name: 'Dashboard', path: '/portal', icon: LayoutDashboard, exact: true },
  { name: 'My Products', path: '/portal/products', icon: Boxes },
  { name: 'Licenses (.lic)', path: '/portal/licenses', icon: KeyRound },
  { name: 'Downloads', path: '/portal/downloads', icon: Download },
  { name: 'Trials (POC)', path: '/portal/trials', icon: FileCheck2 },
  { name: 'Installations', path: '/portal/installations', icon: Server },
  { name: 'Renewals & Plans', path: '/portal/renewals', icon: RefreshCw },
  { name: 'Support & TAC', path: '/portal/support', icon: Headphones },
  { name: 'Users & Roles', path: '/portal/users', icon: Users },
  { name: 'Audit History', path: '/portal/audit', icon: History }
];

export const PortalSidebar = () => {
  const { user, isInternalAdmin } = useAuth();

  return (
    <aside className="w-64 bg-gts-darkest border-r border-gts-border flex flex-col justify-between shrink-0 select-none min-h-screen">
      <div className="p-4 space-y-6">
        {/* Official GTS Brand Header */}
        <div className="flex items-center gap-3 px-2 py-2 border-b border-gts-border/60">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/gts-logo.svg"
              alt="GTS Technosoft AI"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
          </Link>
        </div>

        {/* Current Tenant / Organization Pill */}
        <div className="px-3 py-2.5 rounded-xl bg-gts-card border border-gts-border/80 space-y-1">
          <div className="text-[10px] font-mono uppercase text-gts-orange font-bold tracking-wider">
            Licensed Tenant
          </div>
          <div className="text-xs font-bold text-white truncate">
            {user?.organization?.legal_name || 'Enterprise Account'}
          </div>
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Role: {user?.role?.replace('_', ' ')}</span>
            <span className="text-emerald-400">● Live</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {portalNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gts-purple text-white shadow-glow-purple'
                      : 'text-slate-400 hover:text-white hover:bg-gts-card/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: Admin Link if privileged & Documentation */}
      <div className="p-4 border-t border-gts-border/60 space-y-2 text-xs">
        {isInternalAdmin && (
          <Link
            to="/admin"
            className="flex items-center justify-between p-2.5 rounded-xl bg-gts-orange/15 border border-gts-orange/40 text-gts-orange font-bold hover:bg-gts-orange/25 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Admin Control Plane</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}

        <Link
          to="/documentation"
          target="_blank"
          className="flex items-center justify-between p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <span>KavachIQ Docs & SDK</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
};
