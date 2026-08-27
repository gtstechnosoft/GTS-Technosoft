import React, { useState, useEffect } from 'react';
import { installationApi, licenseApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import {
  Server,
  Cpu,
  Activity,
  Plus,
  Trash2,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  Terminal
} from 'lucide-react';

export const InstallationsPage = () => {
  const [installations, setInstallations] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    licenseKey: '',
    alias: '',
    version: '4.2.1-lts',
    os: 'Linux (RHEL 9.2 x86_64)',
    ipAddress: '10.240.0.1'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [instRes, licRes] = await Promise.all([
        installationApi.getAll(),
        licenseApi.getAll()
      ]);
      if (instRes.data?.success) setInstallations(instRes.data.data);
      if (licRes.data?.success) {
        setLicenses(licRes.data.data);
        if (licRes.data.data.length > 0) {
          setFormData((prev) => ({ ...prev, licenseKey: licRes.data.data[0].license_key }));
        }
      }
    } catch (err) {
      toast.error('Failed to load installations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterInstance = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await installationApi.register(formData);
      if (res.data?.success) {
        toast.success('Instance registered and activated successfully');
        setRegisterModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Instance registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHeartbeat = async (id) => {
    try {
      await installationApi.sendHeartbeat(id, { version: '4.2.1-lts' });
      toast.success('Heartbeat telemetry signal acknowledged');
      fetchData();
    } catch (err) {
      toast.error('Failed to pulse heartbeat');
    }
  };

  const handleDelete = async (id, alias) => {
    if (!window.confirm(`Are you sure you want to decommission instance '${alias}'?`)) return;
    try {
      await installationApi.delete(id);
      toast.success(`Instance '${alias}' decommissioned`);
      fetchData();
    } catch (err) {
      toast.error('Failed to decommission instance');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Registered Software Instances & Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time health signals, node telemetry heartbeats, and license node assignments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setRegisterModalOpen(true)}
            className="shadow-glow-teal self-start"
          >
            Register Instance
          </Button>
        </div>
      </div>

      {/* Installations Table */}
      <div className="glass-card rounded-3xl border border-brand-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darkest/90 border-b border-brand-border/80 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-4 px-6">Instance Alias & Product</th>
                <th className="py-4 px-6">Instance ID</th>
                <th className="py-4 px-6">OS & Architecture</th>
                <th className="py-4 px-6">IP Address</th>
                <th className="py-4 px-6">License Key</th>
                <th className="py-4 px-6">Last Contact</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 font-sans text-slate-200">
              {installations.length > 0 ? (
                installations.map((inst) => (
                  <tr key={inst.id} className="hover:bg-brand-card/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <Server className="w-4 h-4 text-brand-cyan shrink-0" />
                        <div>
                          <div className="font-bold">{inst.alias}</div>
                          <div className="text-[11px] font-mono text-brand-teal">
                            {inst.product?.name} (v{inst.version})
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-400">
                      {inst.id.substring(0, 8)}...
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">
                      {inst.os}
                    </td>
                    <td className="py-4 px-6 font-mono text-brand-teal">
                      {inst.ip_address || '127.0.0.1'}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">
                      <span className="truncate max-w-[140px] block">{inst.license?.license_key}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">
                      {new Date(inst.last_contact).toLocaleTimeString()}
                    </td>
                    <td className="py-4 px-6">
                      <Badge status={inst.activation_status}>{inst.activation_status}</Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleHeartbeat(inst.id)}
                          className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-border text-emerald-400"
                          title="Trigger Telemetry Heartbeat"
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(inst.id, inst.alias)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/20"
                          title="Decommission Instance"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-mono">
                    No instances registered. Click "Register Instance" to register an active node or agent.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Instance Modal */}
      <Modal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title="Register Software Instance / Poller Daemon"
      >
        <form onSubmit={handleRegisterInstance} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Attach to License Key</label>
            <select
              value={formData.licenseKey}
              onChange={(e) => setFormData((prev) => ({ ...prev, licenseKey: e.target.value }))}
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            >
              {licenses.map((lic) => (
                <option key={lic.id} value={lic.license_key}>
                  {lic.entitlement?.subscription?.product?.name} — {lic.license_key} ({lic.entitlement?.metric_limit} {lic.entitlement?.metric_type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Instance Hostname / Alias</label>
            <input
              type="text"
              required
              value={formData.alias}
              onChange={(e) => setFormData((prev) => ({ ...prev, alias: e.target.value }))}
              placeholder="e.g. dc1-kavachiq-nms-core-01"
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Software Version</label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData((prev) => ({ ...prev, version: e.target.value }))}
                placeholder="4.2.1-lts"
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">IP Address</label>
              <input
                type="text"
                value={formData.ipAddress}
                onChange={(e) => setFormData((prev) => ({ ...prev, ipAddress: e.target.value }))}
                placeholder="10.240.12.88"
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Host Operating System</label>
            <input
              type="text"
              value={formData.os}
              onChange={(e) => setFormData((prev) => ({ ...prev, os: e.target.value }))}
              placeholder="Red Hat Enterprise Linux 9.2 (x86_64)"
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
            Activate & Register Node
          </Button>
        </form>
      </Modal>
    </div>
  );
};
