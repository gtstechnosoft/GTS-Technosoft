import React, { useState, useEffect } from 'react';
import { auditApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { History, Shield, Search, RefreshCw, Eye } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AuditHistoryPage = () => {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const res = await auditApi.getAll({ action: search || undefined, limit: 50 });
      if (res.data?.success) {
        setEvents(res.data.data.events || []);
        setTotal(res.data.data.total || 0);
      }
    } catch (err) {
      toast.error('Failed to load audit history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [search]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Organization Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable, read-only event stream of cryptographic license, download, authentication, and activation actions
          </p>
        </div>

        <button
          onClick={fetchAudits}
          className="p-2.5 rounded-xl bg-brand-card hover:bg-brand-border text-slate-300 border border-brand-border self-start flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-4 h-4 text-brand-teal" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by action (e.g. LICENSE, AUTH, PACKAGE)..."
            className="w-full bg-brand-darker border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-card rounded-3xl border border-brand-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darkest/90 border-b border-brand-border/80 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Action Event</th>
                <th className="py-4 px-6">Actor</th>
                <th className="py-4 px-6">Target Resource</th>
                <th className="py-4 px-6">IP Address</th>
                <th className="py-4 px-6">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 font-mono text-slate-200">
              {events.length > 0 ? (
                events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-brand-card/40 transition-colors">
                    <td className="py-4 px-6 text-slate-400 whitespace-nowrap">
                      {new Date(evt.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-brand-cyan">
                      {evt.action}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {evt.actor ? evt.actor.email : 'System Process'}
                    </td>
                    <td className="py-4 px-6 text-slate-200 font-bold truncate max-w-[200px]">
                      {evt.target || '—'}
                    </td>
                    <td className="py-4 px-6 text-brand-teal">
                      {evt.ip_address || '127.0.0.1'}
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-[10px] truncate max-w-[220px]">
                      {evt.metadata ? JSON.stringify(evt.metadata) : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    No audit records logged yet.
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
