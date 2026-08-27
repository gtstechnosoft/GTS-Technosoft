import React, { useState, useEffect } from 'react';
import { licenseApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LicenseDetailModal } from '../../components/portal/LicenseDetailModal';
import { useToast } from '../../context/ToastContext';
import {
  KeyRound,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  RefreshCw
} from 'lucide-react';

export const LicensesPage = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const toast = useToast();

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const res = await licenseApi.getAll();
      if (res.data?.success) {
        setLicenses(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load license inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success('License Key copied');
    setTimeout(() => setCopiedKey(null), 2000);
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

  const filtered = licenses.filter((l) => {
    const product = l.entitlement?.subscription?.product?.name || '';
    const key = l.license_key || '';
    return (
      product.toLowerCase().includes(search.toLowerCase()) ||
      key.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">License Authority Inventory</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cryptographically signed licenses, metric allocations & node activation quotas
          </p>
        </div>

        <button
          onClick={fetchLicenses}
          className="p-2.5 rounded-xl bg-brand-card hover:bg-brand-border text-slate-300 border border-brand-border self-start flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-4 h-4 text-brand-teal" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or license key..."
            className="w-full bg-brand-darker border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal"
          />
        </div>
      </div>

      {/* Licenses Table */}
      <div className="glass-card rounded-3xl border border-brand-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darkest/90 border-b border-brand-border/80 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-4 px-6">Product & Edition</th>
                <th className="py-4 px-6">License Key</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Metric Limit</th>
                <th className="py-4 px-6">Activations</th>
                <th className="py-4 px-6">Expiry Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 font-sans text-slate-200">
              {filtered.length > 0 ? (
                filtered.map((lic) => {
                  const product = lic.entitlement?.subscription?.product;
                  const edition = lic.entitlement?.edition;
                  const actCount = lic.installations?.length || 0;
                  const actLimit = lic.entitlement?.activation_limit || 5;

                  return (
                    <tr key={lic.id} className="hover:bg-brand-card/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-white">
                        <div>{product?.name || 'KavachIQ Software'}</div>
                        <div className="text-[11px] font-mono text-brand-teal">{edition?.name || 'Enterprise'}</div>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[180px]">{lic.license_key}</span>
                          <button
                            onClick={() => handleCopyKey(lic.license_key)}
                            className="text-slate-400 hover:text-white"
                            title="Copy License Key"
                          >
                            {copiedKey === lic.license_key ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge status={lic.license_type}>{lic.license_type}</Badge>
                      </td>
                      <td className="py-4 px-6 font-mono text-brand-cyan font-bold">
                        {lic.entitlement?.metric_limit?.toLocaleString()} {lic.entitlement?.metric_type}
                      </td>
                      <td className="py-4 px-6 font-mono">
                        <span className={actCount >= actLimit ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {actCount} / {actLimit} nodes
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-300">
                        {new Date(lic.expiry_date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <Badge status={lic.status}>{lic.status}</Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={Eye}
                            onClick={() => setSelectedLicense(lic)}
                          >
                            Inspect
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Download}
                            onClick={() => handleDownloadLic(lic)}
                          >
                            .lic
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-mono">
                    No licenses match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
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
