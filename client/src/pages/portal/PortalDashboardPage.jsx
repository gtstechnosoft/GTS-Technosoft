import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MetricCard } from '../../components/portal/MetricCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LicenseDetailModal } from '../../components/portal/LicenseDetailModal';
import {
  subscriptionApi,
  licenseApi,
  installationApi,
  supportApi,
  releaseApi,
  auditApi
} from '../../api/endpoints';
import {
  Boxes,
  KeyRound,
  Server,
  Download,
  Headphones,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  History,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PortalDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [installations, setInstallations] = useState([]);
  const [supportCases, setSupportCases] = useState([]);
  const [releases, setReleases] = useState([]);
  const [recentAudits, setRecentAudits] = useState([]);
  const [selectedLicense, setSelectedLicense] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [subsRes, licRes, instRes, suppRes, relRes, auditRes] = await Promise.all([
          subscriptionApi.getAll(),
          licenseApi.getAll(),
          installationApi.getAll(),
          supportApi.getAll(),
          releaseApi.getAll(),
          auditApi.getAll({ limit: 5 })
        ]);

        if (subsRes.data?.success) setSubscriptions(subsRes.data.data);
        if (licRes.data?.success) setLicenses(licRes.data.data);
        if (instRes.data?.success) setInstallations(instRes.data.data);
        if (suppRes.data?.success) setSupportCases(suppRes.data.data);
        if (relRes.data?.success) setReleases(relRes.data.data);
        if (auditRes.data?.success) setRecentAudits(auditRes.data.data.events || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeLicensesCount = licenses.filter((l) => l.status === 'ACTIVE').length;
  const activeInstallationsCount = installations.filter((i) => i.activation_status === 'ACTIVE').length;
  const openCasesCount = supportCases.filter((c) => ['NEW', 'IN_PROGRESS', 'WAITING_ON_CUSTOMER'].includes(c.status)).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-radial-card border border-brand-border p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-brand-teal font-bold uppercase">Enterprise Portal Workspace</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-teal/20 text-brand-cyan border border-brand-teal/40">
              {user?.organization?.tier || 'Enterprise'} Tier
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {user?.organization?.legal_name}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Logged in as <strong className="text-white">{user?.email}</strong> ({user?.role})
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/portal/trials"
            className="px-4 py-2.5 rounded-xl bg-brand-teal/15 hover:bg-brand-teal/25 text-brand-cyan text-xs font-bold border border-brand-teal/40 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Request Trial</span>
          </Link>
          <Link
            to="/portal/support"
            className="px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-border text-white text-xs font-bold border border-brand-border transition-colors flex items-center gap-1.5"
          >
            <Headphones className="w-4 h-4 text-brand-teal" />
            <span>Open Ticket</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Products Owned"
          value={subscriptions.length}
          subtitle="Commercial Entitlements"
          icon={Boxes}
          color="teal"
        />
        <MetricCard
          title="Licenses"
          value={activeLicensesCount}
          subtitle={`${licenses.length} Total Issued`}
          icon={KeyRound}
          color="blue"
        />
        <MetricCard
          title="Installations"
          value={activeInstallationsCount}
          subtitle="Online & Telemetry"
          icon={Server}
          color="emerald"
        />
        <MetricCard
          title="Packages"
          value={releases.length}
          subtitle="Certified Downloads"
          icon={Download}
          color="purple"
        />
        <MetricCard
          title="Support Cases"
          value={openCasesCount}
          subtitle="Open Tickets"
          icon={Headphones}
          color={openCasesCount > 0 ? 'amber' : 'teal'}
        />
        <MetricCard
          title="Renewals Due"
          value={subscriptions.filter((s) => s.status === 'ACTIVE').length}
          subtitle="Subscriptions Active"
          icon={RefreshCw}
          color="teal"
        />
      </div>

      {/* Main Row: Active Licenses & Quick Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Commercial Licenses Table */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8 border border-brand-border space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-brand-teal" />
              <h3 className="text-lg font-bold text-white">Active Product Licenses</h3>
            </div>
            <Link to="/portal/licenses" className="text-xs text-brand-teal hover:underline flex items-center gap-1">
              View all ({licenses.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {licenses.length > 0 ? (
            <div className="divide-y divide-brand-border/60 border border-brand-border rounded-2xl overflow-hidden bg-brand-darkest/60">
              {licenses.slice(0, 4).map((lic) => {
                const product = lic.entitlement?.subscription?.product;
                const edition = lic.entitlement?.edition;
                return (
                  <div key={lic.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-brand-card/40 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{product?.name || 'KavachIQ'}</span>
                        <Badge status={lic.status}>{lic.status}</Badge>
                        <span className="text-[11px] font-mono text-brand-teal">{edition?.name}</span>
                      </div>
                      <div className="font-mono text-xs text-slate-400 mt-1">
                        Key: <span className="text-slate-200">{lic.license_key}</span> • Limit: <span className="text-brand-cyan">{lic.entitlement?.metric_limit} {lic.entitlement?.metric_type}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedLicense(lic)}
                      >
                        Inspect .lic
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-brand-card/30 border border-dashed border-brand-border text-slate-400 text-xs">
              No active licenses provisioned yet. Request a trial evaluation to generate a signed license key.
            </div>
          )}
        </div>

        {/* Right Column: Live Nodes & Recent Audit Events */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Instances Summary */}
          <div className="glass-card rounded-3xl p-6 border border-brand-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-sm text-white">Registered Instances</h4>
              </div>
              <Link to="/portal/installations" className="text-[11px] text-brand-teal hover:underline">
                Manage
              </Link>
            </div>

            {installations.length > 0 ? (
              <div className="space-y-2">
                {installations.slice(0, 3).map((inst) => (
                  <div key={inst.id} className="p-3 rounded-xl bg-brand-darkest/70 border border-brand-border flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{inst.alias}</div>
                      <div className="text-[10px] text-slate-400 font-mono">v{inst.version} • {inst.product?.name}</div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active Heartbeat" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No telemetry instances registered.</p>
            )}
          </div>

          {/* Recent Audit Feed */}
          <div className="glass-card rounded-3xl p-6 border border-brand-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-brand-cyan" />
                <h4 className="font-bold text-sm text-white">Org Audit Activity</h4>
              </div>
              <Link to="/portal/audit" className="text-[11px] text-brand-teal hover:underline">
                Full Log
              </Link>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              {recentAudits.length > 0 ? (
                recentAudits.slice(0, 4).map((evt) => (
                  <div key={evt.id} className="p-2.5 rounded-xl bg-brand-darkest/60 border border-brand-border/60">
                    <div className="text-brand-teal font-semibold text-[11px]">{evt.action}</div>
                    <div className="text-[10px] text-slate-400 truncate">{evt.target}</div>
                    <div className="text-[9px] text-slate-500 mt-1">{new Date(evt.created_at).toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-sans">No recent audit records.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* License Detail / Inspect Modal */}
      {selectedLicense && (
        <LicenseDetailModal
          isOpen={!!selectedLicense}
          onClose={() => setSelectedLicense(null)}
          license={selectedLicense}
        />
      )}
    </div>
  );
};
