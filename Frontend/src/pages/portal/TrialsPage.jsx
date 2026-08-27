import React, { useState, useEffect } from 'react';
import { trialApi, productApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import {
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  FileCheck
} from 'lucide-react';

export const TrialsPage = () => {
  const [trials, setTrials] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    productId: '',
    editionId: '',
    nodeLimit: 100,
    notes: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [trialsRes, prodRes] = await Promise.all([
        trialApi.getAll(),
        productApi.getAll()
      ]);
      if (trialsRes.data?.success) setTrials(trialsRes.data.data);
      if (prodRes.data?.success) {
        setProducts(prodRes.data.data);
        if (prodRes.data.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            productId: prodRes.data.data[0].id,
            editionId: prodRes.data.data[0].editions?.[0]?.id || ''
          }));
        }
      }
    } catch (err) {
      toast.error('Failed to load trials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductChange = (productId) => {
    const selected = products.find((p) => p.id === productId);
    setFormData((prev) => ({
      ...prev,
      productId,
      editionId: selected?.editions?.[0]?.id || ''
    }));
  };

  const handleRequestTrial = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await trialApi.request(formData);
      if (res.data?.success) {
        toast.success(res.data.message);
        setRequestModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Trial request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConvert = async (trialId) => {
    try {
      const res = await trialApi.convert(trialId);
      if (res.data?.success) {
        toast.success('Conversion inquiry registered. Solution Sales will reach out with a commercial quotation.');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to convert trial');
    }
  };

  const calculateDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    const diffTime = new Date(expiryDate) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Proof of Concept & Trial Evaluations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Request 30-day evaluation licenses, monitor active trial countdowns, and convert to production commercial terms
          </p>
        </div>

        <Button
          variant="primary"
          icon={Sparkles}
          onClick={() => setRequestModalOpen(true)}
          className="shadow-glow-teal self-start"
        >
          Request Evaluation
        </Button>
      </div>

      {/* Trial Cards List */}
      {trials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trials.map((trial) => {
            const daysRemaining = calculateDaysRemaining(trial.expiry_date);
            return (
              <div
                key={trial.id}
                className="glass-card rounded-3xl p-8 border border-brand-border hover:border-brand-teal/40 transition-all flex flex-col justify-between space-y-6 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{trial.product?.name}</h3>
                        <div className="text-xs font-mono text-brand-teal">{trial.edition?.name}</div>
                      </div>
                    </div>
                    <Badge status={trial.status}>{trial.status}</Badge>
                  </div>

                  {/* Evaluation Metrics */}
                  <div className="p-4 rounded-2xl bg-brand-darkest/80 border border-brand-border/60 grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-400">Node Limit</span>
                      <div className="text-sm font-bold text-brand-cyan mt-0.5">
                        {trial.node_limit} Nodes
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Time Remaining</span>
                      <div className="text-sm font-bold text-amber-400 mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{daysRemaining !== null ? `${daysRemaining} Days` : 'Pending Approval'}</span>
                      </div>
                    </div>
                  </div>

                  {trial.license && (
                    <div className="p-3 rounded-xl bg-brand-card/40 border border-brand-border/60 text-xs font-mono text-slate-300 flex items-center justify-between">
                      <span className="truncate">Key: {trial.license.license_key}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">SIGNED</span>
                    </div>
                  )}

                  {trial.notes && (
                    <p className="text-xs text-slate-400 italic">
                      "{trial.notes}"
                    </p>
                  )}
                </div>

                {/* Conversion Action */}
                <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Requested on {new Date(trial.created_at).toLocaleDateString()}
                  </span>

                  {trial.status === 'ACTIVE' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleConvert(trial.id)}
                    >
                      Convert to Commercial
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-brand-border">
          <Flame className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Evaluation Trials Active</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Ready to test KavachIQ NMS, SIEM, or Config Manager in your testbed? Request an instant trial license with zero friction.
          </p>
          <Button
            variant="primary"
            icon={Sparkles}
            onClick={() => setRequestModalOpen(true)}
            className="shadow-glow-teal font-bold"
          >
            Start Free 30-Day Evaluation
          </Button>
        </div>
      )}

      {/* Request Trial Modal */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="Request KavachIQ Evaluation License"
      >
        <form onSubmit={handleRequestTrial} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Select Product</label>
            <select
              value={formData.productId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Select Edition</label>
            <select
              value={formData.editionId}
              onChange={(e) => setFormData((prev) => ({ ...prev, editionId: e.target.value }))}
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            >
              {products
                .find((p) => p.id === formData.productId)
                ?.editions?.map((ed) => (
                  <option key={ed.id} value={ed.id}>{ed.name}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Evaluation Node/Device Limit</label>
            <input
              type="number"
              min="10"
              max="500"
              value={formData.nodeLimit}
              onChange={(e) => setFormData((prev) => ({ ...prev, nodeLimit: e.target.value }))}
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Testing Goals & Scope</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g. Evaluating for 100 core routers and SIEM correlation against MITRE ATT&CK."
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
            Submit Evaluation Request
          </Button>
        </form>
      </Modal>
    </div>
  );
};
