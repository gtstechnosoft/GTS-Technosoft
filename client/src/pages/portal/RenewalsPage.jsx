import React, { useState, useEffect } from 'react';
import { subscriptionApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { RefreshCw, Calendar, ShieldCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const RenewalsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        setLoading(true);
        const res = await subscriptionApi.getAll();
        if (res.data?.success) {
          setSubscriptions(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  const handleRequestQuote = (productName) => {
    toast.success(`Commercial renewal quote requested for ${productName}. Account executive assigned.`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Subscription & Support Renewals
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review commercial support lifecycles, contract anniversary dates, and initiate maintenance renewals
        </p>
      </div>

      {/* Subscriptions Renewals List */}
      <div className="space-y-6">
        {subscriptions.map((sub) => {
          const endDate = new Date(sub.end_date);
          const now = new Date();
          const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
          const isExpiringSoon = diffDays <= 90;

          return (
            <div
              key={sub.id}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-border hover:border-brand-teal/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal/15 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-brand-cyan" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{sub.product?.name}</h3>
                      <Badge status={sub.status}>{sub.status}</Badge>
                    </div>
                    <div className="text-xs font-mono text-brand-teal">{sub.support_plan}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono pt-2">
                  <div>
                    <span className="text-slate-400">Coverage Start</span>
                    <div className="text-slate-200 font-bold mt-0.5">{new Date(sub.start_date).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Contract End</span>
                    <div className="text-white font-bold mt-0.5">{endDate.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Status Timeline</span>
                    <div className={`font-bold mt-0.5 ${isExpiringSoon ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {diffDays > 0 ? `${diffDays} Days Remaining` : 'Expired'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleRequestQuote(sub.product?.name)}
                  className="shadow-glow-teal font-bold"
                >
                  Request Renewal Quotation
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
