import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Menu, ShieldAlert, LogOut, LayoutDashboard, ExternalLink } from 'lucide-react';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-darkest text-slate-100 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-20 h-20 bg-brand-darker/90 backdrop-blur-md border-b border-brand-border/60 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-brand-card lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <h2 className="font-bold text-sm sm:text-base text-white">GTS Master Control Console</h2>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Operator: <span className="text-cyan-300 font-semibold">{user?.email}</span> (Internal Admin)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/portal"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-card hover:bg-brand-border text-slate-200 text-xs font-semibold border border-brand-border"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-brand-teal" />
              <span>Customer Portal</span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 border border-rose-500/20 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
