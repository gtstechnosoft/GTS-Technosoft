import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { PortalSidebar } from './PortalSidebar';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  Building2,
  User,
  LogOut,
  Shield,
  KeyRound,
  Headphones,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const PortalLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isInternalAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-darkest text-slate-100 flex">
      {/* Sidebar */}
      <PortalSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-20 bg-brand-darker/90 backdrop-blur-md border-b border-brand-border/60 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-brand-card lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-teal" />
                <span className="font-bold text-sm sm:text-base text-white">
                  {user?.organization?.legal_name || 'My Organization'}
                </span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-brand-teal/15 text-brand-cyan border border-brand-teal/40 hidden sm:inline-block">
                  {user?.organization?.tier || 'Enterprise'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Organization ID: <span className="text-slate-300">{user?.org_id?.substring(0, 13)}...</span>
              </span>
            </div>
          </div>

          {/* User Menu & Fast Actions */}
          <div className="flex items-center gap-3">
            {isInternalAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/80 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            )}

            <Link
              to="/portal/trials"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-teal/15 border border-brand-teal/30 hover:border-brand-teal text-brand-cyan text-xs font-semibold transition-all hover:shadow-glow-teal"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Request Evaluation</span>
            </Link>

            <div className="flex items-center gap-2.5 pl-3 border-l border-brand-border/60">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-card to-brand-border border border-brand-border flex items-center justify-center font-bold text-sm text-brand-cyan">
                {user?.first_name ? user.first_name[0] : user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-white leading-tight">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email}
                </span>
                <span className="text-[10px] text-brand-teal font-mono">{user?.role}</span>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
