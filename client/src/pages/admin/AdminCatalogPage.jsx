import React, { useState, useEffect } from 'react';
import { productApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { Boxes, Plus, Layers, ShieldCheck, Tag } from 'lucide-react';

export const AdminCatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createProdModalOpen, setCreateProdModalOpen] = useState(false);
  const [createEdModalOpen, setCreateEdModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [prodForm, setProdForm] = useState({
    code: '',
    name: '',
    category: 'Network Operations & Observability',
    tagline: '',
    description: ''
  });

  const [edForm, setEdForm] = useState({
    code: '',
    name: '',
    releaseChannel: 'stable',
    featureProfile: '["CORE_MODULE", "ENTERPRISE_METRICS", "AIR_GAP_MODE"]'
  });

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await productApi.getAll();
      if (res.data?.success) setProducts(res.data.data);
    } catch (err) {
      toast.error('Failed to load product catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await productApi.createProduct(prodForm);
      if (res.data?.success) {
        toast.success(`Product ${prodForm.name} created in catalog`);
        setCreateProdModalOpen(false);
        setProdForm({ code: '', name: '', category: 'Network Operations & Observability', tagline: '', description: '' });
        fetchCatalog();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateEdition = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      let parsedFeatures = [];
      try {
        parsedFeatures = JSON.parse(edForm.featureProfile);
      } catch (jsonErr) {
        parsedFeatures = edForm.featureProfile.split(',').map((s) => s.trim());
      }

      const res = await productApi.createEdition(selectedProductId, {
        code: edForm.code,
        name: edForm.name,
        releaseChannel: edForm.releaseChannel,
        featureProfile: parsedFeatures
      });

      if (res.data?.success) {
        toast.success(`Edition ${edForm.name} added`);
        setCreateEdModalOpen(false);
        fetchCatalog();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add edition');
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
            KavachIQ Product Catalog & Editions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure core OEM software definitions, SKU codes, edition matrices, and feature profiles
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setCreateProdModalOpen(true)}
          className="shadow-glow-teal self-start"
        >
          Add Product SKU
        </Button>
      </div>

      {/* Catalog Cards */}
      <div className="space-y-8">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="glass-card rounded-3xl p-8 border border-brand-border space-y-6 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{prod.name}</h3>
                  <Badge status={prod.lifecycle_state}>{prod.lifecycle_state}</Badge>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                    CODE: {prod.code.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-brand-teal font-mono mt-1">{prod.category}</p>
                <p className="text-xs text-slate-300 mt-2 max-w-2xl">{prod.description}</p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={() => {
                  setSelectedProductId(prod.id);
                  setCreateEdModalOpen(true);
                }}
              >
                Add Edition
              </Button>
            </div>

            {/* Editions List */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-slate-400">
                Packaging Editions & Feature Profiles:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {prod.editions?.map((ed) => (
                  <div key={ed.id} className="p-4 rounded-2xl bg-brand-darkest border border-brand-border/70 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-white">{ed.name}</strong>
                      <Badge status={ed.release_channel}>{ed.release_channel}</Badge>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">Code: {ed.code}</div>
                    <div className="text-[10px] font-mono text-brand-teal bg-brand-card p-2 rounded max-h-24 overflow-y-auto">
                      {Array.isArray(ed.feature_profile)
                        ? ed.feature_profile.join(', ')
                        : JSON.stringify(ed.feature_profile)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Product Modal */}
      <Modal
        isOpen={createProdModalOpen}
        onClose={() => setCreateProdModalOpen(false)}
        title="Add Product to Commercial Catalog"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Product Code (Unique identifier)</label>
            <input
              type="text"
              required
              value={prodForm.code}
              onChange={(e) => setProdForm((prev) => ({ ...prev, code: e.target.value.toLowerCase().trim() }))}
              placeholder="e.g. ndr or edr"
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-teal"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Full Commercial Name</label>
            <input
              type="text"
              required
              value={prodForm.name}
              onChange={(e) => setProdForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. KavachIQ NDR (Network Detection & Response)"
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Category</label>
            <input
              type="text"
              value={prodForm.category}
              onChange={(e) => setProdForm((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="Network & SecOps"
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={prodForm.description}
              onChange={(e) => setProdForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Product overview and capabilities..."
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
            Create Product in Catalog
          </Button>
        </form>
      </Modal>

      {/* Create Edition Modal */}
      <Modal
        isOpen={createEdModalOpen}
        onClose={() => setCreateEdModalOpen(false)}
        title="Add Edition to Product"
      >
        <form onSubmit={handleCreateEdition} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Edition Code</label>
            <input
              type="text"
              required
              value={edForm.code}
              onChange={(e) => setEdForm((prev) => ({ ...prev, code: e.target.value.toLowerCase().trim() }))}
              placeholder="e.g. ultimate or enterprise"
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-teal"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Edition Name</label>
            <input
              type="text"
              required
              value={edForm.name}
              onChange={(e) => setEdForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ultimate Edition"
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-teal"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Feature Profile (JSON Array)</label>
            <textarea
              rows={3}
              value={edForm.featureProfile}
              onChange={(e) => setEdForm((prev) => ({ ...prev, featureProfile: e.target.value }))}
              placeholder='["FEATURE_1", "FEATURE_2"]'
              className="w-full bg-brand-darkest border border-brand-border rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-teal resize-none"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={submitting}
            className="w-full shadow-glow-teal font-extrabold"
          >
            Add Edition SKU
          </Button>
        </form>
      </Modal>
    </div>
  );
};
