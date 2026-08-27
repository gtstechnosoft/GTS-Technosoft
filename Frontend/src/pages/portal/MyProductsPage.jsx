import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscriptionApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Boxes,
  KeyRound,
  Download,
  BookOpen,
  Server,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export const MyProductsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const res = await subscriptionApi.getAll();
        if (res.data?.success) {
          setSubscriptions(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">My Entitled Products</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Commercial subscriptions and software modules licensed to your organization
          </p>
        </div>

        <Link
          to="/portal/trials"
          className="px-4 py-2 rounded-xl bg-brand-teal text-brand-darkest font-bold text-xs shadow-glow-teal flex items-center gap-1.5 self-start"
        >
          <Sparkles className="w-4 h-4" />
          <span>Evaluate Additional Modules</span>
        </Link>
      </div>

      {/* Products Grid */}
      {subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subscriptions.map((sub) => {
            const product = sub.product;
            const entitlement = sub.entitlements?.[0];
            const edition = entitlement?.edition;
            const licenses = entitlement?.licenses || [];

            return (
              <div
                key={sub.id}
                className="glass-card rounded-3xl p-8 border border-brand-border hover:border-brand-teal/40 transition-all flex flex-col justify-between space-y-6 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-teal/15 border border-brand-teal/30 flex items-center justify-center">
                        <Boxes className="w-6 h-6 text-brand-cyan" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{product.name}</h3>
                        <div className="text-xs font-mono text-brand-teal font-semibold">{edition?.name || 'Enterprise Edition'}</div>
                      </div>
                    </div>
                    <Badge status={sub.status}>{sub.status}</Badge>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {product.description || 'Enterprise-grade infrastructure defense and telemetry observability.'}
                  </p>

                  {/* Entitlement Metrics */}
                  <div className="p-4 rounded-2xl bg-brand-darkest/80 border border-brand-border/60 grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-400">Metric Limit</span>
                      <div className="text-sm font-bold text-brand-cyan mt-0.5">
                        {entitlement?.metric_limit?.toLocaleString() || 500} {entitlement?.metric_type || 'NODES'}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Support Level</span>
                      <div className="text-sm font-bold text-white mt-0.5 truncate">
                        {sub.support_plan}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="pt-4 border-t border-brand-border/60 grid grid-cols-3 gap-2 text-xs">
                  <Link
                    to="/portal/licenses"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-card hover:bg-brand-border text-slate-200 font-semibold border border-brand-border transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-brand-teal" />
                    <span>Licenses</span>
                  </Link>

                  <Link
                    to="/portal/downloads"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-card hover:bg-brand-border text-slate-200 font-semibold border border-brand-border transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>Downloads</span>
                  </Link>

                  <Link
                    to={`/products/${product.code}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-card hover:bg-brand-border text-slate-200 font-semibold border border-brand-border transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Specs</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-brand-border">
          <Boxes className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Active Commercial Subscriptions Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your organization currently has no active commercial subscriptions. You can evaluate any KavachIQ product by requesting a trial license.
          </p>
          <Link
            to="/portal/trials"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-teal text-brand-darkest font-bold text-xs shadow-glow-teal"
          >
            <Sparkles className="w-4 h-4" />
            <span>Request Free Evaluation</span>
          </Link>
        </div>
      )}
    </div>
  );
};
