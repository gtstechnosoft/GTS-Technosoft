import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { Building2, Plus, Users, Boxes, Server, Shield, Globe } from 'lucide-react';

export const AdminOrganizationsPage = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    legalName: '',
    displayName: '',
    billingCountry: 'India',
    domain: '',
    tier: 'Enterprise Platinum'
  });

  const fetchOrgs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOrgs();
      if (res.data?.success) setOrgs(res.data.data);
    } catch (err) {
      toast.error('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await adminApi.createOrg(formData);
      if (res.data?.success) {
        toast.success(`Organization ${formData.legalName} created`);
        setCreateModalOpen(false);
        setFormData({ legalName: '', displayName: '', billingCountry: 'India', domain: '', tier: 'Enterprise Platinum' });
        fetchOrgs();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create organization');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (orgId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await adminApi.updateOrgStatus(orgId, { status: nextStatus });
      toast.success(`Organization status changed to ${nextStatus}`);
      fetchOrgs();
    } catch (err) {
      toast.error('Failed to update organization status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tenant Organizations Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage enterprise customer accounts, provision subscription tiers, and govern multi-tenant isolation
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
          className="shadow-glow-teal self-start"
        >
          Create Organization
        </Button>
      </div>

      {/* Orgs Table */}
      <div className="glass-card rounded-3xl border border-brand-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darkest/90 border-b border-brand-border/80 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-4 px-6">Legal Entity & Tier</th>
                <th className="py-4 px-6">Domain</th>
                <th className="py-4 px-6">Country</th>
                <th className="py-4 px-6">Users</th>
                <th className="py-4 px-6">Subscriptions</th>
                <th className="py-4 px-6">Live Nodes</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 font-sans text-slate-200">
              {orgs.map((org) => (
                <tr key={org.id} className="hover:bg-brand-card/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">
                    <div>{org.legal_name}</div>
                    <div className="text-[11px] font-mono text-cyan-400">{org.tier}</div>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-300">
                    {org.domain || '—'}
                  </td>
                  <td className="py-4 px-6 text-slate-300">
                    {org.billing_country}
                  </td>
                  <td className="py-4 px-6 font-mono text-white">
                    {org._count?.users || 0}
                  </td>
                  <td className="py-4 px-6 font-mono text-brand-cyan font-bold">
                    {org._count?.subscriptions || 0}
                  </td>
                  <td className="py-4 px-6 font-mono text-emerald-400 font-bold">
                    {org._count?.installations || 0}
                  </td>
                  <td className="py-4 px-6">
                    <Badge status={org.status}>{org.status}</Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleToggleStatus(org.id, org.status)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                        org.status === 'ACTIVE'
                          ? 'text-rose-400 border-rose-500/30 hover:bg-rose-950/40'
                          : 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-950/40'
                      }`}
                    >
                      {org.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Org Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Provision New Organization Tenant"
      >
        <form onSubmit={handleCreateOrg} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Legal Entity Name</label>
            <input
              type="text"
              required
              value={formData.legalName}
              onChange={(e) => setFormData((prev) => ({ ...prev, legalName: e.target.value }))}
              placeholder="e.g. CyberSecure Global Technologies"
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Corporate Domain</label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => setFormData((prev) => ({ ...prev, domain: e.target.value }))}
                placeholder="cybersecure.com"
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Billing Country</label>
              <input
                type="text"
                value={formData.billingCountry}
                onChange={(e) => setFormData((prev) => ({ ...prev, billingCountry: e.target.value }))}
                placeholder="India / Singapore / US"
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Service Tier</label>
            <select
              value={formData.tier}
              onChange={(e) => setFormData((prev) => ({ ...prev, tier: e.target.value }))}
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            >
              <option value="Enterprise Platinum">Enterprise Platinum</option>
              <option value="Enterprise Diamond">Enterprise Diamond (Mission Critical)</option>
              <option value="Commercial Standard">Commercial Standard</option>
              <option value="MSSP Partner Pool">MSSP Partner Pool</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={submitting}
            className="w-full shadow-glow-teal font-extrabold"
          >
            Provision Organization
          </Button>
        </form>
      </Modal>
    </div>
  );
};
