import React, { useState, useEffect } from 'react';
import { orgApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  UserPlus,
  Trash2,
  Shield,
  Mail,
  UserCheck,
  Lock,
  KeyRound
} from 'lucide-react';

const availableRoles = [
  { id: 'ORG_ADMIN', name: 'Org Admin', desc: 'Full administrative rights across licenses, downloads, users & billing' },
  { id: 'LICENSE_ADMIN', name: 'License Admin', desc: 'Can generate, inspect & download cryptographic license containers' },
  { id: 'SOFTWARE_ADMIN', name: 'Software Admin', desc: 'Can download packages, register telemetry nodes & instances' },
  { id: 'SUPPORT_USER', name: 'Support User', desc: 'Can open and resolve technical support tickets with TAC' },
  { id: 'AUDITOR', name: 'Auditor', desc: 'Read-only access to audit logs and compliance reports' },
  { id: 'PROCUREMENT', name: 'Procurement', desc: 'Manages renewal quotes and commercial subscriptions' }
];

export const UsersRolesPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user: currentUser, isOrgAdmin } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'SOFTWARE_ADMIN',
    tempPassword: 'KavachIQ@Welcome2026!'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await orgApi.getUsers();
      if (res.data?.success) setUsers(res.data.data);
    } catch (err) {
      toast.error('Failed to load organization members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await orgApi.inviteUser(formData);
      if (res.data?.success) {
        toast.success(`User ${formData.email} added to organization`);
        setInviteModalOpen(false);
        setFormData({ email: '', firstName: '', lastName: '', role: 'SOFTWARE_ADMIN', tempPassword: 'KavachIQ@Welcome2026!' });
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (userId, email) => {
    if (!window.confirm(`Are you sure you want to remove ${email} from the organization?`)) return;
    try {
      await orgApi.removeUser(userId);
      toast.success('User removed');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove user');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Organization Users & Access Roles
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Role-based access control (RBAC) across licenses, downloads, support, and audit telemetry
          </p>
        </div>

        {isOrgAdmin && (
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => setInviteModalOpen(true)}
            className="shadow-glow-teal self-start"
          >
            Add Team Member
          </Button>
        )}
      </div>

      {/* Role Definitions Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        {availableRoles.map((r) => (
          <div key={r.id} className="p-3 rounded-2xl bg-brand-card/40 border border-brand-border/60 space-y-1">
            <div className="font-bold text-white text-[11px]">{r.name}</div>
            <p className="text-[10px] text-slate-400 leading-tight">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-3xl border border-brand-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darkest/90 border-b border-brand-border/80 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-4 px-6">Member</th>
                <th className="py-4 px-6">Corporate Email</th>
                <th className="py-4 px-6">Role Assignment</th>
                <th className="py-4 px-6">MFA Protection</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 font-sans text-slate-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-brand-card/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-brand-teal/15 text-brand-cyan flex items-center justify-center font-bold text-xs">
                        {u.first_name ? u.first_name[0] : u.email[0].toUpperCase()}
                      </div>
                      <span>{u.first_name ? `${u.first_name} ${u.last_name || ''}` : 'Team Member'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-300">
                    {u.email}
                  </td>
                  <td className="py-4 px-6">
                    <Badge status={u.role}>{u.role.replace('_', ' ')}</Badge>
                  </td>
                  <td className="py-4 px-6 font-mono">
                    {u.mfa_enabled ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Enforced
                      </span>
                    ) : (
                      <span className="text-slate-500">Optional</span>
                    )}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-300">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <Badge status={u.status}>{u.status}</Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {isOrgAdmin && u.id !== currentUser.id && (
                      <button
                        onClick={() => handleRemove(u.id, u.email)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                        title="Remove User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Add Organization Team Member"
      >
        <form onSubmit={handleInvite} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Corporate Work Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="colleague@company.com"
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                placeholder="Elena"
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                placeholder="Rostova"
                className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Assigned Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            >
              {availableRoles.map((r) => (
                <option key={r.id} value={r.id}>{r.name} — {r.desc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Temporary Access Password</label>
            <input
              type="text"
              value={formData.tempPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, tempPassword: e.target.value }))}
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
            Provision Member Account
          </Button>
        </form>
      </Modal>
    </div>
  );
};
