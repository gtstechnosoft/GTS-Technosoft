import React, { useState, useEffect } from 'react';
import { leadApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Inbox, Mail, Phone, Building2, CheckCircle2, MessageSquare, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await leadApi.getAll();
      if (res.data?.success) setLeads(res.data.data);
    } catch (err) {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await leadApi.updateStatus(id, status);
      toast.success(`Lead marked as ${status}`);
      fetchLeads();
    } catch (err) {
      toast.error('Failed to update lead status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Commercial Inquiries & Demo Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Incoming lead requests captured from public marketing forms, trial evaluations, and partner applications
          </p>
        </div>

        <button
          onClick={fetchLeads}
          className="p-2.5 rounded-xl bg-brand-card hover:bg-brand-border text-slate-300 border border-brand-border self-start flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-4 h-4 text-brand-teal" />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="glass-card rounded-3xl border border-brand-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darkest/90 border-b border-brand-border/80 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-4 px-6">Prospect & Company</th>
                <th className="py-4 px-6">Contact Details</th>
                <th className="py-4 px-6">Product Interest</th>
                <th className="py-4 px-6">Fleet Scale</th>
                <th className="py-4 px-6">Intent Type</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 font-sans text-slate-200">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-brand-card/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">
                      <div>{lead.full_name}</div>
                      <div className="text-[11px] font-mono text-cyan-400">{lead.company}</div>
                      {lead.job_title && (
                        <div className="text-[10px] text-slate-400">{lead.job_title}</div>
                      )}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">
                      <div>{lead.email}</div>
                      <div className="text-[11px] text-slate-400">{lead.phone || '—'}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-brand-teal">
                      {lead.product_interest}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">
                      {lead.fleet_size || '—'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-card text-brand-cyan border border-brand-border">
                        {lead.request_type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge status={lead.status}>{lead.status}</Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                        className="bg-brand-darkest border border-brand-border rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-brand-teal"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="QUALIFIED">QUALIFIED</option>
                        <option value="CONVERTED">CONVERTED</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-mono">
                    No lead inquiries logged yet.
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
