import React, { useState, useEffect } from 'react';
import { licenseApi, subscriptionApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LicenseDetailModal } from '../../components/portal/LicenseDetailModal';
import { useToast } from '../../context/ToastContext';
import {
  KeyRound,
  Plus,
  Ban,
  Download,
  Eye,
  ShieldCheck,
  Building2,
  Lock,
  RefreshCw
} from 'lucide-react';

export const AdminLicensesPage = () => {
  const [licenses, setLicenses] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    entitlementId: '',
    licenseType: 'SUBSCRIPTION',
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customKeyId: 'KAVACHIQ-KMS-ROOT-V1'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [licRes, subsRes] = await Promise.all([
        licenseApi.getAll(),
        subscriptionApi.getAll()
      ]);
      if (licRes.data?.success) setLicenses(licRes.data.data);
      if (subsRes.data?.success) {
        setSubscriptions(subsRes.data.data);
        const firstEnt = subsRes.data.data[0]?.entitlements?.[0];
        if (firstEnt) {
          setFormData((prev) => ({ ...prev, entitlementId: firstEnt.id }));
        }
      }
    } catch (err) {
      toast.error('Failed to load licenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssueLicense = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await licenseApi.issue(formData);
      if (res.data?.success) {
        toast.success(`License ${res.data.data.license_key} cryptographically signed and issued`);
        setIssueModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue license');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevokeLicense = async (licenseId, licenseKey) => {
    const reason = window.prompt(`Please provide a reason for revoking ${licenseKey}:`, 'Administrative revocation');
    if (!reason) return;

    try {
      await licenseApi.revoke(licenseId, reason);
      toast.success(`License ${licenseKey} has been revoked`);
      fetchData();
    } catch (err) {
      toast.error('Failed to revoke license');
    }
  };

  const handleDownloadLic = async (license) => {
    try {
      const res = await licenseApi.downloadLic(license.id);
      const blob = new Blob([res.data], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `KavachIQ_${license.license_key}.lic`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Downloaded ${license.license_key}.lic`);
    } catch (err) {
      toast.error('Failed to download license file');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cryptographic Licensing Authority (KMS/HSM Engine)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Generate, re-sign, and revoke cryptographically signed RSA/HMAC software license containers
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIssueModalOpen(true)}
          className="shadow-glow-teal self-start"
        >
          Issue Cryptographic License
        </Button>
      </div>

      {/* Licenses Table */}
      <div className="glass-card rounded-3xl border border-brand-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darkest/90 border-b border-brand-border/80 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-4 px-6">Customer Organization</th>
                <th className="py-4 px-6">Product & Edition</th>
                <th className="py-4 px-6">License Key</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Metric Limit</th>
                <th className="py-4 px-6">Expiry</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 font-sans text-slate-200">
              {licenses.map((lic) => {
                const org = lic.entitlement?.subscription?.organization;
                const product = lic.entitlement?.subscription?.product;
                const edition = lic.entitlement?.edition;

                return (
                  <tr key={lic.id} className="hover:bg-brand-card/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">
                      <div>{org?.legal_name || '—'}</div>
                      <div className="text-[10px] font-mono text-slate-400">{org?.billing_country}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{product?.name}</div>
                      <div className="text-[11px] font-mono text-brand-teal">{edition?.name}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-cyan-300">
                      {lic.license_key}
                    </td>
                    <td className="py-4 px-6">
                      <Badge status={lic.license_type}>{lic.license_type}</Badge>
                    </td>
                    <td className="py-4 px-6 font-mono text-brand-cyan font-bold">
                      {lic.entitlement?.metric_limit?.toLocaleString()} {lic.entitlement?.metric_type}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">
                      {new Date(lic.expiry_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <Badge status={lic.status}>{lic.status}</Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedLicense(lic)}
                          className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-border text-slate-300"
                          title="Inspect Cryptographic Container"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadLic(lic)}
                          className="p-1.5 rounded-lg bg-brand-teal/20 text-brand-cyan hover:bg-brand-teal/30"
                          title="Download .lic File"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {lic.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleRevokeLicense(lic.id, lic.license_key)}
                            className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-500/20"
                            title="Revoke License"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue License Modal */}
      <Modal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        title="Issue & Sign Commercial License (KMS Authority)"
      >
        <form onSubmit={handleIssueLicense} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Target Entitlement</label>
            <select
              value={formData.entitlementId}
              onChange={(e) => setFormData((prev) => ({ ...prev, entitlementId: e.target.value }))}
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            >
              {subscriptions.map((s) => {
                const ent = s.entitlements?.[0];
                if (!ent) return null;
                return (
                  <option key={ent.id} value={ent.id}>
                    {s.organization?.legal_name} — {s.product?.name} ({ent.edition?.name})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">License Type</label>
              <select
                value={formData.licenseType}
                onChange={(e) => setFormData((prev) => ({ ...prev, licenseType: e.target.value }))}
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
              >
                <option value="SUBSCRIPTION">SUBSCRIPTION</option>
                <option value="PERPETUAL">PERPETUAL</option>
                <option value="TRIAL">TRIAL</option>
                <option value="NFR">NFR (Not for Resale)</option>
                <option value="PARTNER">PARTNER</option>
                <option value="INTERNAL">INTERNAL</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Expiration Date</label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Signing Key Authority ID</label>
            <input
              type="text"
              value={formData.customKeyId}
              onChange={(e) => setFormData((prev) => ({ ...prev, customKeyId: e.target.value }))}
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-teal"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={submitting}
            className="w-full shadow-glow-teal font-extrabold"
          >
            Cryptographically Sign & Issue .lic Container
          </Button>
        </form>
      </Modal>

      {/* Inspect Modal */}
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
