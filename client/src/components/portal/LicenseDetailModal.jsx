import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { KeyRound, Download, Copy, Check, ShieldCheck, Cpu, HardDrive, Calendar } from 'lucide-react';
import { licenseApi } from '../../api/endpoints';
import { useToast } from '../../context/ToastContext';

export const LicenseDetailModal = ({ isOpen, onClose, license }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const toast = useToast();

  if (!license) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(license.license_key);
    setCopied(true);
    toast.success('License Key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLic = async () => {
    try {
      setDownloading(true);
      const res = await licenseApi.downloadLic(license.id);
      const blob = new Blob([res.data], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `KavachIQ_${license.license_key}.lic`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Downloaded signed .lic license file');
    } catch (err) {
      toast.error('Failed to download license file');
    } finally {
      setDownloading(false);
    }
  };

  let decodedPayload = null;
  try {
    if (license.signed_payload) {
      const container = JSON.parse(license.signed_payload);
      if (container.payload_base64) {
        decodedPayload = JSON.parse(atob(container.payload_base64));
      }
    }
  } catch (e) {
    // raw payload
  }

  const product = license.entitlement?.subscription?.product;
  const edition = license.entitlement?.edition;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cryptographic License Details" maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="p-4 rounded-xl bg-brand-dark/80 border border-brand-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">{product?.name || 'KavachIQ Software'}</h4>
              <Badge status={license.status}>{license.status}</Badge>
              <Badge status={license.license_type}>{license.license_type}</Badge>
            </div>
            <p className="text-xs text-brand-teal font-mono mt-0.5">{edition?.name || 'Enterprise'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={copied ? Check : Copy}
              onClick={handleCopyKey}
            >
              {copied ? 'Copied' : 'Copy Key'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Download}
              isLoading={downloading}
              onClick={handleDownloadLic}
            >
              Download .lic
            </Button>
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-brand-card/50 border border-brand-border/60">
            <div className="text-slate-400">License Key</div>
            <div className="font-mono font-bold text-white mt-1 break-all">{license.license_key}</div>
          </div>
          <div className="p-3 rounded-xl bg-brand-card/50 border border-brand-border/60">
            <div className="text-slate-400">Metric Limit</div>
            <div className="font-mono font-bold text-brand-cyan mt-1">
              {license.entitlement?.metric_limit?.toLocaleString()} {license.entitlement?.metric_type}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-brand-card/50 border border-brand-border/60">
            <div className="text-slate-400">Activations</div>
            <div className="font-mono font-bold text-white mt-1">
              {license.installations?.length || 0} / {license.entitlement?.activation_limit || 5} nodes
            </div>
          </div>
          <div className="p-3 rounded-xl bg-brand-card/50 border border-brand-border/60">
            <div className="text-slate-400">Expiry Date</div>
            <div className="font-mono font-bold text-white mt-1">
              {new Date(license.expiry_date).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Cryptographic Signature Security Box */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Cryptographic Verification Details (KMS Root Stub)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
            <div>Signing Key ID: <span className="text-cyan-200">{license.signing_key_id}</span></div>
            <div>Algorithm: <span className="text-cyan-200">HMAC-SHA256-SIGN (HSM Ready)</span></div>
          </div>
          <div className="text-[10px] font-mono text-slate-400 break-all bg-brand-darkest/80 p-2 rounded border border-brand-border/60">
            Signature: {license.signature || 'HMAC-SHA256-VALIDATED'}
          </div>
        </div>

        {/* Decoded Features */}
        {decodedPayload && (
          <div className="space-y-2">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Decoded Feature Matrix & Entitlements
            </div>
            <div className="p-3 rounded-xl bg-brand-darkest border border-brand-border/80 text-xs font-mono text-slate-300 max-h-48 overflow-y-auto">
              <pre className="text-[11px] leading-relaxed">
                {JSON.stringify(decodedPayload, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Registered Activations Table */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            Registered Active Installations ({license.installations?.length || 0})
          </div>
          {license.installations && license.installations.length > 0 ? (
            <div className="divide-y divide-brand-border/50 border border-brand-border/60 rounded-xl overflow-hidden bg-brand-card/30 text-xs">
              {license.installations.map((inst) => (
                <div key={inst.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-brand-teal" />
                    <div>
                      <div className="font-bold text-white">{inst.alias}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{inst.os} • v{inst.version}</div>
                    </div>
                  </div>
                  <Badge status={inst.activation_status}>{inst.activation_status}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-brand-card/20 border border-dashed border-brand-border text-center text-xs text-slate-400">
              No server instances registered to this license key yet.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
