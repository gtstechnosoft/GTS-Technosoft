import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Building2,
  Boxes,
  Layers,
  KeyRound,
  FileCheck2,
  Package,
  History,
  Inbox,
  ArrowLeft,
  Crown
} from 'lucide-react';

const adminNavItems = [
  { name: 'Control Plane', path: '/admin', icon: ShieldAlert, exact: true },
  { name: 'Organizations (Tenants)', path: '/admin/organizations', icon: Building2 },
  { name: 'Product Catalog', path: '/admin/catalog', icon: Boxes },
  { name: 'Subscriptions & Quotas', path: '/admin/subscriptions', icon: Layers },
  { name: 'Cryptographic Licenses', path: '/admin/licenses', icon: KeyRound },
  { name: 'Trial Approvals', path: '/admin/trials', icon: FileCheck2 },
  { name: 'Software Releases', path: '/admin/releases', icon: Package },
  { name: 'Global Audit Stream', path: '/admin/audit', icon: History },
  { name: 'Leads & Inquiries', path: '/admin/leads', icon: Inbox }
];

export const AdminSidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-gts-darkest border-r border-gts-border flex flex-col justify-between shrink-0 select-none min-h-screen">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 px-2 py-2 border-b border-gts-border/60">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/gts-logo.svg"
              alt="GTS Technosoft AI"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
          </Link>
        </div>

        {/* OEM Root Authority Badge */}
        <div className="px-3 py-2.5 rounded-xl bg-gts-purple/20 border border-gts-purple/40 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-gts-orange font-bold">
            <Crown className="w-3.5 h-3.5" />
            <span>Master OEM Console</span>
          </div>
          <div className="text-xs font-bold text-white truncate">
            {user?.email}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Key ID: KAVACHIQ-KMS-ROOT-V1
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {adminNavItems.map((item) => {
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

      {/* Footer Area: Back to Customer Portal */}
      <div className="p-4 border-t border-gts-border/60 space-y-2 text-xs">
        <Link
          to="/portal"
          className="flex items-center justify-between p-2.5 rounded-xl bg-gts-card hover:bg-gts-border/60 text-slate-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 text-gts-cyan" />
            <span>Switch to Customer View</span>
          </div>
        </Link>
      </div>
    </aside>
  );
};
