import React, { useState, useEffect } from 'react';
import { supportApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import {
  Headphones,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const SupportPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    severity: 'P3_MEDIUM'
  });

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await supportApi.getAll();
      if (res.data?.success) setCases(res.data.data);
    } catch (err) {
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleCreateCase = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await supportApi.create(formData);
      if (res.data?.success) {
        toast.success(res.data.message);
        setCreateModalOpen(false);
        setFormData({ subject: '', description: '', severity: 'P3_MEDIUM' });
        fetchCases();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit support case');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Enterprise Technical Support & TAC
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            24x7 Tier-3 Solution Engineering support tickets, SLA tracking & incident response
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
          className="shadow-glow-teal self-start"
        >
          Open Support Case
        </Button>
      </div>

      {/* SLA Tiers Info Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30">
          <div className="text-rose-400 font-bold">P1 - Critical</div>
          <div className="text-white font-bold text-base mt-1">&lt; 2 Hours SLA</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Production outage / down</div>
        </div>
        <div className="p-4 rounded-2xl bg-orange-950/30 border border-orange-500/30">
          <div className="text-orange-400 font-bold">P2 - High</div>
          <div className="text-white font-bold text-base mt-1">&lt; 4 Hours SLA</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Major feature degraded</div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
          <div className="text-amber-400 font-bold">P3 - Medium</div>
          <div className="text-white font-bold text-base mt-1">&lt; 8 Hours SLA</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Standard technical inquiry</div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
          <div className="text-emerald-400 font-bold">P4 - Low</div>
          <div className="text-white font-bold text-base mt-1">&lt; 24 Hours SLA</div>
          <div className="text-[10px] text-slate-400 mt-0.5">General question / docs</div>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {cases.length > 0 ? (
          cases.map((c) => (
            <div
              key={c.id}
              className="glass-card rounded-2xl p-6 border border-brand-border space-y-3 hover:border-brand-teal/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-brand-cyan font-bold">
                    #{c.id.substring(0, 8)}
                  </span>
                  <Badge status={c.severity}>{c.severity.replace('_', ' ')}</Badge>
                  <Badge status={c.status}>{c.status.replace('_', ' ')}</Badge>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  Target SLA: {c.sla_target_hours}h • Logged {new Date(c.created_at).toLocaleString()}
                </div>
              </div>

              <h3 className="text-base font-bold text-white">{c.subject}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {c.description}
              </p>

              {c.resolution_notes && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200">
                  <strong>Resolution:</strong> {c.resolution_notes}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-brand-border/40">
                <span>Opened by: {c.creator?.email}</span>
                <span>Assigned: <strong className="text-white">{c.assigned_to || 'Tier 3 Queue'}</strong></span>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center text-slate-400 text-xs">
            No support cases logged for this organization.
          </div>
        )}
      </div>

      {/* Create Case Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Open Technical Support Case"
      >
        <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Severity Level</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData((prev) => ({ ...prev, severity: e.target.value }))}
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            >
              <option value="P1_CRITICAL">P1 - Critical (Outage / Production Down - 2h SLA)</option>
              <option value="P2_HIGH">P2 - High (Major Performance Impairment - 4h SLA)</option>
              <option value="P3_MEDIUM">P3 - Medium (Standard Technical Issue - 8h SLA)</option>
              <option value="P4_LOW">P4 - Low (General Configuration Question - 24h SLA)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Ticket Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="e.g. Cisco 9300 NetFlow v9 template parse drop"
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Detailed Issue Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Include logs, software version, error messages, and reproduction steps..."
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal resize-none"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={submitting}
            className="w-full shadow-glow-teal font-extrabold"
          >
            Submit Ticket to TAC
          </Button>
        </form>
      </Modal>
    </div>
  );
};
