import React, { useState, useEffect } from 'react';
import { trialApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { FileCheck2, Check, X, ShieldAlert, Sparkles, Clock } from 'lucide-react';

export const AdminTrialsPage = () => {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchTrials = async () => {
    try {
      setLoading(true);
      const res = await trialApi.getAll();
      if (res.data?.success) setTrials(res.data.data);
    } catch (err) {
      toast.error('Failed to load trial queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrials();
  }, []);

  const handleApprove = async (trialId, productName, orgName) => {
    try {
      const res = await trialApi.approve(trialId, { durationDays: 30 });
      if (res.data?.success) {
        toast.success(`Trial for ${productName} approved for ${orgName}. Signed evaluation license generated.`);
        fetchTrials();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve trial');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Trial Evaluations Approval Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review incoming proof-of-concept evaluation requests, provision air-gapped test licenses & convert commercial leads
        </p>
      </div>

      {/* Trials Table */}
      <div className="glass-card rounded-3xl border border-brand-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darkest/90 border-b border-brand-border/80 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-4 px-6">Customer Organization</th>
                <th className="py-4 px-6">Requester</th>
                <th className="py-4 px-6">Requested Module</th>
                <th className="py-4 px-6">Node Quota</th>
                <th className="py-4 px-6">Evaluation Notes</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 font-sans text-slate-200">
              {trials.length > 0 ? (
                trials.map((tr) => (
                  <tr key={tr.id} className="hover:bg-brand-card/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">
                      <div>{tr.organization?.legal_name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{tr.organization?.domain || '—'}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">
                      <div>{tr.user?.email}</div>
                      <div className="text-[10px] text-slate-400">{tr.user?.first_name} {tr.user?.last_name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{tr.product?.name}</div>
                      <div className="text-[11px] font-mono text-cyan-400">{tr.edition?.name}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-brand-cyan font-bold">
                      {tr.node_limit} Nodes
                    </td>
                    <td className="py-4 px-6 text-slate-300 max-w-[200px] truncate">
                      {tr.notes || '—'}
                    </td>
                    <td className="py-4 px-6">
                      <Badge status={tr.status}>{tr.status}</Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {tr.status === 'PENDING_APPROVAL' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Check}
                            onClick={() => handleApprove(tr.id, tr.product?.name, tr.organization?.legal_name)}
                          >
                            Approve 30-Day
                          </Button>
                        </div>
                      ) : tr.status === 'ACTIVE' ? (
                        <span className="text-emerald-400 font-mono text-[11px] font-semibold">
                          Active License Provisioned
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">
                          {tr.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-mono">
                    No trials in queue.
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
