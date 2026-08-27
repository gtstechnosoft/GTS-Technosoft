import React, { useState, useEffect } from 'react';
import { auditApi, adminApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { History, Search, RefreshCw, Filter, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminAuditLogsPage = () => {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [actionSearch, setActionSearch] = useState('');
  const toast = useToast();

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const res = await auditApi.getAll({
        orgId: selectedOrgId || undefined,
        action: actionSearch || undefined,
        limit: 100
      });
      if (res.data?.success) {
        setEvents(res.data.data.events || []);
        setTotal(res.data.data.total || 0);
      }
    } catch (err) {
      toast.error('Failed to load global audit trail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrgsList = async () => {
      try {
        const res = await adminApi.getOrgs();
        if (res.data?.success) setOrgs(res.data.data);
      } catch (err) {}
    };
    fetchOrgsList();
  }, []);

  useEffect(() => {
    fetchAudits();
  }, [selectedOrgId, actionSearch]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Global Enterprise Audit Stream
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete platform-wide audit trail with actor, tenant, action, and cryptographic tamper verification
          </p>
        </div>

        <button
          onClick={fetchAudits}
          className="p-2.5 rounded-xl bg-brand-card hover:bg-brand-border text-slate-300 border border-brand-border self-start flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-4 h-4 text-brand-teal" />
          <span>Refresh Live</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={actionSearch}
            onChange={(e) => setActionSearch(e.target.value)}
            placeholder="Search action keyword (e.g. AUTH, LICENSE, TRIAL)..."
            className="w-full bg-brand-darker border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="w-full bg-brand-darker border border-brand-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
          >
            <option value="">All Organizations (Global)</option>
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>{o.legal_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Global Table */}
      <div className="glass-card rounded-3xl border border-brand-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darkest/90 border-b border-brand-border/80 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Organization</th>
                <th className="py-4 px-6">Action Event</th>
                <th className="py-4 px-6">Actor</th>
                <th className="py-4 px-6">Target Resource</th>
                <th className="py-4 px-6">IP Address</th>
                <th className="py-4 px-6">Context Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 font-mono text-slate-200">
              {events.length > 0 ? (
                events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-brand-card/40 transition-colors">
                    <td className="py-4 px-6 text-slate-400 whitespace-nowrap">
                      {new Date(evt.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-semibold text-white font-sans">
                      {evt.organization?.legal_name || 'System'}
                    </td>
                    <td className="py-4 px-6 font-bold text-cyan-300">
                      {evt.action}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {evt.actor?.email || 'Automated Engine'}
                    </td>
                    <td className="py-4 px-6 text-slate-200 font-bold truncate max-w-[180px]">
                      {evt.target || '—'}
                    </td>
                    <td className="py-4 px-6 text-brand-teal">
                      {evt.ip_address || '127.0.0.1'}
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-[10px] truncate max-w-[200px]">
                      {evt.metadata ? JSON.stringify(evt.metadata) : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-mono">
                    No global audit records match the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
