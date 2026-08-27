import React, { useState, useEffect } from 'react';
import { releaseApi, productApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { Package, Plus, ShieldCheck, Download, HardDrive } from 'lucide-react';

export const AdminReleasesPage = () => {
  const [releases, setReleases] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    productId: '',
    editionId: '',
    version: '4.3.0-ga',
    packageType: 'tar.gz',
    platform: 'linux-x86_64',
    fileSizeBytes: 314572800,
    releaseChannel: 'stable',
    releaseNotes: 'Official enterprise release with automated cluster health monitors and performance fixes.'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [relRes, prodRes] = await Promise.all([
        releaseApi.getAll(),
        productApi.getAll()
      ]);
      if (relRes.data?.success) setReleases(relRes.data.data);
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
      toast.error('Failed to load software releases');
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

  const handlePublishRelease = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await releaseApi.create(formData);
      if (res.data?.success) {
        toast.success(`Release v${formData.version} published with SHA-256 checksum.`);
        setPublishModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish release');
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
            Software Releases & Package Distribution Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish software packages, compute SHA-256 cryptographic checksums, and manage LTS channels
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setPublishModalOpen(true)}
          className="shadow-glow-teal self-start"
        >
          Publish New Version
        </Button>
      </div>

      {/* Releases Table */}
      <div className="glass-card rounded-3xl border border-brand-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darkest/90 border-b border-brand-border/80 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-4 px-6">Product & Version</th>
                <th className="py-4 px-6">Platform & Format</th>
                <th className="py-4 px-6">Channel</th>
                <th className="py-4 px-6">SHA-256 Checksum</th>
                <th className="py-4 px-6">Downloads</th>
                <th className="py-4 px-6">Published Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 font-sans text-slate-200">
              {releases.map((rel) => (
                <tr key={rel.id} className="hover:bg-brand-card/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">
                    <div>{rel.product?.name}</div>
                    <div className="text-[11px] font-mono text-brand-teal">Version {rel.version}</div>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-300">
                    {rel.platform} ({rel.package_type})
                  </td>
                  <td className="py-4 px-6">
                    <Badge status={rel.release_channel}>{rel.release_channel}</Badge>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-300 max-w-[220px] truncate">
                    {rel.checksum}
                  </td>
                  <td className="py-4 px-6 font-mono text-brand-cyan font-bold">
                    {rel.download_count}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-400">
                    {new Date(rel.published_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Publish Release Modal */}
      <Modal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        title="Publish Certified Software Release"
      >
        <form onSubmit={handlePublishRelease} className="space-y-4 text-xs">
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
              <label className="block font-semibold text-slate-300 mb-1.5">Edition Target</label>
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
              <label className="block font-semibold text-slate-300 mb-1.5">Version String</label>
              <input
                type="text"
                required
                value={formData.version}
                onChange={(e) => setFormData((prev) => ({ ...prev, version: e.target.value }))}
                placeholder="4.3.0-ga"
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData((prev) => ({ ...prev, platform: e.target.value }))}
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
              >
                <option value="linux-x86_64">Linux (x86_64)</option>
                <option value="windows-x64">Windows Server (x64)</option>
                <option value="container-arm64">Container (ARM64)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Package Format</label>
              <select
                value={formData.packageType}
                onChange={(e) => setFormData((prev) => ({ ...prev, packageType: e.target.value }))}
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
              >
                <option value="tar.gz">tar.gz</option>
                <option value="msi">MSI (Windows)</option>
                <option value="deb">DEB (Debian/Ubuntu)</option>
                <option value="rpm">RPM (RHEL/Rocky)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Release Notes & Changelog</label>
            <textarea
              rows={3}
              value={formData.releaseNotes}
              onChange={(e) => setFormData((prev) => ({ ...prev, releaseNotes: e.target.value }))}
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
            Compute Checksum & Publish Package
          </Button>
        </form>
      </Modal>
    </div>
  );
};
