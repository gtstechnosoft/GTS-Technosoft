import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import {
  Lock,
  Mail,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  Eye,
  EyeOff,
  Server,
  Award
} from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaToken, setMfaToken] = useState('');
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [userIdForMfa, setUserIdForMfa] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, verifyMfa } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/portal';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (requiresMfa) {
        await verifyMfa(userIdForMfa, mfaToken);
        toast.success('MFA verification successful');
        navigate(from, { replace: true });
      } else {
        const res = await login(email, password);
        if (res.requireMfa) {
          setRequiresMfa(true);
          setUserIdForMfa(res.userId);
          toast.info('Two-Factor Authentication required. Enter your 6-digit TOTP code.');
        } else {
          toast.success('Welcome back to GTS Technosoft AI Platform');
          if (res.user.role === 'INTERNAL_ADMIN') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/portal', { replace: true });
          }
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[88vh] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-corporate border border-slate-200 bg-white">
        {/* Left Column: Dark Navy Enterprise Visual Panel */}
        <div className="lg:col-span-5 bg-gts-darkest p-8 sm:p-10 text-white flex flex-col justify-between space-y-8 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gts-blue/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gts-purple/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-block bg-white/95 rounded-xl px-3 py-1.5 shadow-sm">
              <img
                src="/gts-logo.svg"
                alt="GTS Technosoft Logo"
                className="h-8 w-auto object-contain"
              />
            </Link>

            <div className="space-y-2">
              <span className="text-xs font-mono text-gts-orange uppercase font-bold tracking-wider">
                KavachIQ Commercial Suite
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Enterprise Sovereign Access Portal
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Centralized multi-tenant licensing, node health telemetry, and software release distribution.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ISO 27001 & SOC 2 Type II Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>End-to-End TLS 1.3 & SHA-256 Auth</span>
              </div>
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Air-Gapped Node Management</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            Domain: gtstech.ai • v4.3.0-GA
          </div>
        </div>

        {/* Right Column: Clean White Form Card */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {requiresMfa ? 'Two-Factor Challenge' : 'Sign in to KavachIQ'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {requiresMfa
                  ? 'Enter the 6-digit cryptographic TOTP code from your authenticator'
                  : 'Enter your corporate credentials to access your tenant workspace'}
              </p>
            </div>

            {/* Demo Quick-Fill Access */}
            {!requiresMfa && (
              <div className="rounded-2xl p-3.5 bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-gts-purple font-bold font-mono text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-gts-orange" />
                  <span>One-Click Demo Credentials:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin@gtstech.ai', 'Admin@GTS2026!')}
                    className="p-2 rounded-xl bg-white hover:bg-purple-50 text-left border border-slate-200 hover:border-purple-300 transition-colors shadow-subtle"
                  >
                    <div className="font-bold text-gts-purple text-[11px]">Internal Admin (GTS)</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">admin@gtstech.ai</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin@acrocorp.com', 'Customer@2026!')}
                    className="p-2 rounded-xl bg-white hover:bg-orange-50 text-left border border-slate-200 hover:border-orange-300 transition-colors shadow-subtle"
                  >
                    <div className="font-bold text-gts-orange text-[11px]">Org Admin (Acro Corp)</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">admin@acrocorp.com</div>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!requiresMfa ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Corporate Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="engineer@company.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gts-purple focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Access Password <span className="text-rose-500">*</span>
                      </label>
                      <a href="#" className="text-[11px] text-gts-purple font-semibold hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gts-purple focus:bg-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    6-Digit Authenticator TOTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-gts-orange absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      value={mfaToken}
                      onChange={(e) => setMfaToken(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm tracking-widest font-mono text-slate-900 text-center focus:outline-none focus:border-gts-orange focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full bg-gts-navy hover:bg-gts-darkest text-white font-bold text-xs shadow-sm py-3"
              >
                {requiresMfa ? 'Verify & Access Console' : 'Authenticate Session'}
              </Button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an enterprise license account?{' '}
            <Link to="/register" className="font-bold text-gts-purple hover:underline">
              Register Organization
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
