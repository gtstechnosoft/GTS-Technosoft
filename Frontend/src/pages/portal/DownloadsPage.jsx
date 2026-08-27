import React, { useState, useEffect } from 'react';
import { releaseApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import {
  Download,
  Copy,
  Check,
  Package,
  HardDrive,
  ShieldCheck,
  FileCode,
  Terminal,
  Clock
} from 'lucide-react';

export const DownloadsPage = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        const res = await releaseApi.getAll();
        if (res.data?.success) {
          setReleases(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load software packages');
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, []);

  const handleCopyChecksum = (checksum) => {
    navigator.clipboard.writeText(checksum);
    setCopiedHash(checksum);
    toast.success('SHA-256 Checksum copied');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleSecureDownload = async (release) => {
    try {
      setDownloadingId(release.id);
      // Step 1: Request short-lived signed download token
      const tokenRes = await releaseApi.getDownloadToken(release.id);
      if (!tokenRes.data?.success) throw new Error('Could not issue download signature');

      const { downloadUrl, filename } = tokenRes.data.data;
      toast.info('Cryptographic download signature generated (valid for 10 minutes)');

      // Step 2: Trigger secure download via browser with token
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Download started for ${filename}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Download request failed');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatBytes = (bytes) => {
    const b = parseInt(bytes, 10) || 0;
    if (b === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return parseFloat((b / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Certified Software Downloads & Installers
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Cryptographically signed, SHA-256 verified installation packages with short-lived authenticated download tokens
        </p>
      </div>

      {/* Package List */}
      <div className="space-y-6">
        {releases.map((rel) => {
          const isDownloading = downloadingId === rel.id;
          return (
            <div
              key={rel.id}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-border hover:border-brand-teal/40 transition-all space-y-6 shadow-xl"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-teal/15 border border-brand-teal/30 flex items-center justify-center">
                      <Package className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">
                          {rel.product?.name || 'KavachIQ Package'}
                        </h3>
                        <Badge status={rel.release_channel}>{rel.release_channel}</Badge>
                      </div>
                      <div className="text-xs font-mono text-brand-teal font-semibold">
                        Version {rel.version} • {rel.platform} • {rel.package_type.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    icon={Download}
                    isLoading={isDownloading}
                    onClick={() => handleSecureDownload(rel)}
                    className="shadow-glow-teal font-bold"
                  >
                    Generate Signed Download
                  </Button>
                </div>
              </div>

              {/* Release Notes */}
              {rel.release_notes && (
                <div className="p-4 rounded-2xl bg-brand-darkest/70 border border-brand-border/60 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block font-mono uppercase text-[11px] mb-1">Release Highlights:</strong>
                  {rel.release_notes}
                </div>
              )}

              {/* SHA-256 Checksum & Metadata Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-mono bg-brand-darkest/90 p-4 rounded-2xl border border-brand-border/70 items-center">
                <div className="md:col-span-8 flex items-center gap-2 truncate">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-400">SHA-256:</span>
                  <span className="text-slate-200 font-bold truncate">{rel.checksum}</span>
                  <button
                    onClick={() => handleCopyChecksum(rel.checksum)}
                    className="text-slate-400 hover:text-white p-1"
                    title="Copy Checksum"
                  >
                    {copiedHash === rel.checksum ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="md:col-span-2 text-slate-400 text-right">
                  Size: <span className="text-white">{formatBytes(rel.file_size_bytes)}</span>
                </div>

                <div className="md:col-span-2 text-slate-400 text-right">
                  Downloads: <span className="text-brand-cyan">{rel.download_count}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
