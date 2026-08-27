import React, { useState, useEffect } from 'react';
import { subscriptionApi, adminApi, productApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { Layers, Plus, Building2, Boxes, Calendar } from 'lucide-react';

export const AdminSubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    orgId: '',
    productId: '',
    editionId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    supportPlan: '24x7 Enterprise Platinum TAC',
    metricType: 'NODES',
    metricLimit: 1000,
    activationLimit: 5
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subsRes, orgsRes, prodsRes] = await Promise.all([
        subscriptionApi.getAll(),
        adminApi.getOrgs(),
        productApi.getAll()
      ]);
      if (subsRes.data?.success) setSubscriptions(subsRes.data.data);
      if (orgsRes.data?.success) {
        setOrgs(orgsRes.data.data);
        if (orgsRes.data.data.length > 0) {
          setFormData((prev) => ({ ...prev, orgId: orgsRes.data.data[0].id }));
        }
      }
      if (prodsRes.data?.success) {
        setProducts(prodsRes.data.data);
        if (prodsRes.data.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            productId: prodsRes.data.data[0].id,
            editionId: prodsRes.data.data[0].editions?.[0]?.id || ''
          }));
        }
      }
    } catch (err) {
      toast.error('Failed to load subscriptions data');
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

  const handleGrantSubscription = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await subscriptionApi.create(formData);
      if (res.data?.success) {
        toast.success('Subscription and Entitlement granted to organization');
        setGrantModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to grant subscription');
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
            Subscriptions & Commercial Entitlements
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Grant enterprise licenses, allocate node/EPS quotas, and manage support plans
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setGrantModalOpen(true)}
          className="shadow-glow-teal self-start"
        >
          Grant Subscription
        </Button>
      </div>

      {/* Subscriptions Table */}
      <div className="glass-card rounded-3xl border border-brand-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darkest/90 border-b border-brand-border/80 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-4 px-6">Customer Organization</th>
                <th className="py-4 px-6">Product & Edition</th>
                <th className="py-4 px-6">Allocated Metrics</th>
                <th className="py-4 px-6">Support Plan</th>
                <th className="py-4 px-6">Start Date</th>
                <th className="py-4 px-6">End Date</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 font-sans text-slate-200">
              {subscriptions.map((sub) => {
                const ent = sub.entitlements?.[0];
                return (
                  <tr key={sub.id} className="hover:bg-brand-card/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">
                      <div>{sub.organization?.legal_name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{sub.organization?.domain || '—'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{sub.product?.name}</div>
                      <div className="text-[11px] font-mono text-brand-teal">{ent?.edition?.name}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-brand-cyan font-bold">
                      {ent?.metric_limit?.toLocaleString()} {ent?.metric_type}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">
                      {sub.support_plan}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-400">
                      {new Date(sub.start_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-mono text-white font-bold">
                      {new Date(sub.end_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <Badge status={sub.status}>{sub.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Subscription Modal */}
      <Modal
        isOpen={grantModalOpen}
        onClose={() => setGrantModalOpen(false)}
        title="Grant Commercial Subscription & Entitlement"
      >
        <form onSubmit={handleGrantSubscription} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Target Organization</label>
            <select
              value={formData.orgId}
              onChange={(e) => setFormData((prev) => ({ ...prev, orgId: e.target.value }))}
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            >
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>{o.legal_name} ({o.tier})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Product</label>
              <select
                value={formData.productId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Edition</label>
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Metric Type</label>
              <select
                value={formData.metricType}
                onChange={(e) => setFormData((prev) => ({ ...prev, metricType: e.target.value }))}
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
              >
                <option value="NODES">NODES (NMS)</option>
                <option value="EPS">EPS (SIEM / Syslog)</option>
                <option value="AGENTS">AGENTS (ITSM)</option>
                <option value="DEVICES">DEVICES (Config)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Metric Limit</label>
              <input
                type="number"
                value={formData.metricLimit}
                onChange={(e) => setFormData((prev) => ({ ...prev, metricLimit: e.target.value }))}
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Activations Limit</label>
              <input
                type="number"
                value={formData.activationLimit}
                onChange={(e) => setFormData((prev) => ({ ...prev, activationLimit: e.target.value }))}
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Support Level Plan</label>
            <input
              type="text"
              value={formData.supportPlan}
              onChange={(e) => setFormData((prev) => ({ ...prev, supportPlan: e.target.value }))}
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={submitting}
            className="w-full shadow-glow-teal font-extrabold"
          >
            Grant Entitlement & Activate Subscription
          </Button>
        </form>
      </Modal>
    </div>
  );
};
