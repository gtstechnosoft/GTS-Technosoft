import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, leadApi } from '../../api/endpoints';
import { MetricCard } from '../../components/portal/MetricCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Building2,
  Boxes,
  KeyRound,
  FileCheck2,
  Package,
  Headphones,
  Users,
  Inbox,
  Shield,
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, leadsRes] = await Promise.all([
        adminApi.getStats(),
        leadApi.getAll({ status: 'NEW' })
      ]);
      if (statsRes.data?.success) setStats(statsRes.data.data);
      if (leadsRes.data?.success) setLeads(leadsRes.data.data);
    } catch (err) {
      toast.error('Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl bg-radial-card border border-brand-border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
            <Shield className="w-4 h-4" />
            <span>OEM Master Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            GTS Technosoft AI Internal Operations
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time multi-tenant health, license issuance authority & evaluation queues
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            className="p-2.5 rounded-xl bg-brand-card hover:bg-brand-border text-slate-300 border border-brand-border flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="w-4 h-4 text-brand-teal" />
            <span>Sync Live</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Organizations"
          value={stats?.totalOrgs || 0}
          subtitle="Registered Tenants"
          icon={Building2}
          color="blue"
        />
        <MetricCard
          title="Users"
          value={stats?.totalUsers || 0}
          subtitle="Active Operators"
          icon={Users}
          color="teal"
        />
        <MetricCard
          title="Active Licenses"
          value={stats?.activeLicenses || 0}
          subtitle="Signed & Verified"
          icon={KeyRound}
          color="emerald"
        />
        <MetricCard
          title="Live Nodes"
          value={stats?.activeInstallations || 0}
          subtitle="Active Telemetry"
          icon={Boxes}
          color="purple"
        />
        <MetricCard
          title="Trial Queue"
          value={stats?.pendingTrials || 0}
          subtitle="Pending Approval"
          icon={FileCheck2}
          color={stats?.pendingTrials > 0 ? 'amber' : 'teal'}
        />
        <MetricCard
          title="Open Cases"
          value={stats?.openSupportCases || 0}
          subtitle="TAC Tickets"
          icon={Headphones}
          color={stats?.openSupportCases > 0 ? 'rose' : 'teal'}
        />
      </div>

      {/* Main Grid: Pending Approvals & Global Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Actions & Leads */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-brand-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-brand-cyan" />
                <h3 className="text-base font-bold text-white">Incoming Demo Requests & Inquiries</h3>
              </div>
              <Link to="/admin/leads" className="text-xs text-brand-teal hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {leads.length > 0 ? (
              <div className="divide-y divide-brand-border/60 border border-brand-border rounded-2xl overflow-hidden bg-brand-darkest/70">
                {leads.slice(0, 4).map((lead) => (
                  <div key={lead.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{lead.full_name} ({lead.company})</div>
                      <div className="text-[11px] text-brand-teal font-mono">{lead.product_interest} • {lead.email}</div>
                    </div>
                    <Badge status={lead.status}>{lead.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 p-4 rounded-xl bg-brand-darkest/60 border border-brand-border text-center">
                No new unhandled leads in the queue.
              </p>
            )}
          </div>

          {/* Master Admin Fast Navigation */}
          <div className="glass-card rounded-3xl p-6 border border-brand-border space-y-4">
            <h3 className="text-base font-bold text-white">Privileged OEM Controls</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Link
                to="/admin/licenses"
                className="p-3.5 rounded-2xl bg-brand-darkest hover:bg-brand-card border border-brand-border flex items-center gap-3 transition-colors"
              >
                <KeyRound className="w-5 h-5 text-brand-cyan" />
                <div>
                  <div className="font-bold text-white">Issue License</div>
                  <div className="text-[10px] text-slate-400">Sign with KMS stub</div>
                </div>
              </Link>

              <Link
                to="/admin/trials"
                className="p-3.5 rounded-2xl bg-brand-darkest hover:bg-brand-card border border-brand-border flex items-center gap-3 transition-colors"
              >
                <FileCheck2 className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="font-bold text-white">Trial Queue</div>
                  <div className="text-[10px] text-slate-400">Approve evaluations</div>
                </div>
              </Link>

              <Link
                to="/admin/releases"
                className="p-3.5 rounded-2xl bg-brand-darkest hover:bg-brand-card border border-brand-border flex items-center gap-3 transition-colors"
              >
                <Package className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="font-bold text-white">Publish Release</div>
                  <div className="text-[10px] text-slate-400">Upload binaries & hash</div>
                </div>
              </Link>

              <Link
                to="/admin/organizations"
                className="p-3.5 rounded-2xl bg-brand-darkest hover:bg-brand-card border border-brand-border flex items-center gap-3 transition-colors"
              >
                <Building2 className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-bold text-white">Manage Tenants</div>
                  <div className="text-[10px] text-slate-400">Enterprise accounts</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Global Audit Trail */}
        <div className="lg:col-span-6">
          <div className="glass-card rounded-3xl p-6 border border-brand-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Master Global Audit Stream</h3>
              </div>
              <Link to="/admin/audit" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                Full Audit Log <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              {stats?.recentAuditEvents?.map((evt) => (
                <div key={evt.id} className="p-3 rounded-2xl bg-brand-darkest border border-brand-border/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300">{evt.action}</span>
                    <span className="text-[10px] text-slate-500">{new Date(evt.created_at).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 truncate">Target: {evt.target || 'System'}</div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Actor: {evt.actor?.email || 'System'}</span>
                    <span>Org: {evt.organization?.legal_name || 'Global'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
