import { useState, useEffect, useCallback } from 'react';
import Navbar2 from './Navbar2';
import { Boxes, Tag, Save, RefreshCw } from 'lucide-react';
import {
  fetchProducts,
  createStoreProduct,
  deleteStoreProduct,
  deleteProductVariant,
  createProductVariant,
  updateProductVariant,
  updateStoreProduct,
  createProductImage,
  deleteProductImage,
} from '../services/api';

const ALLOWED_IMG = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMG_BYTES = 5 * 1024 * 1024;

function validateImage(file) {
  if (!file) return 'No file selected.';
  if (file.size > MAX_IMG_BYTES) return 'Image must be less than 5 MB.';
  if (!ALLOWED_IMG.includes(file.type)) return 'Only JPG, PNG, and WebP images are allowed.';
  return null;
}

const CATEGORIES = [
  { value: 't-shirt', label: 'T-Shirt' },
  { value: 'hoodie', label: 'Hoodie' },
  { value: 'cap', label: 'Cap' },
];

const CATEGORY_LABELS = { 't-shirt': 'T-Shirt', hoodie: 'Hoodie', cap: 'Cap' };

function formatPrice(price) {
  const num = parseFloat(price);
  if (Number.isNaN(num)) return '';
  return num.toLocaleString('fr-DZ', { maximumFractionDigits: 0 }).replace(/\s/g, '.') + ' DA';
}

const emptyProductForm = () => ({
  name: '',
  description: '',
  price: '',
  category: 't-shirt',
  is_active: true,
  cover_image: null,
});

export default function AdminStoreProducts({ currentPage, setCurrentPage, currentUser, onLogout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showNewProduct, setShowNewProduct] = useState(false);
  const [np, setNp] = useState(emptyProductForm());
  const [npSubmitting, setNpSubmitting] = useState(false);
  const [npError, setNpError] = useState(null);

  const [variantAdd, setVariantAdd] = useState({});
  const [variantEdit, setVariantEdit] = useState(null); // { id, size, color, stock }
  const [busyId, setBusyId] = useState(null);

  const [imagesOpenId, setImagesOpenId] = useState(null);
  const [imgBusy, setImgBusy] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts({ page_size: 50 });
      setProducts(data.results || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setNpError(null);
    if (!np.name.trim() || !np.price) {
      setNpError('Name and price are required.');
      return;
    }
    setNpSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', np.name.trim());
      formData.append('description', np.description || '');
      formData.append('price', String(np.price));
      formData.append('category', np.category);
      formData.append('is_active', String(np.is_active));
      if (np.cover_image) formData.append('cover_image', np.cover_image, np.cover_image.name || 'cover.jpg');
      await createStoreProduct(formData);
      setNp(emptyProductForm());
      setShowNewProduct(false);
      await loadProducts();
    } catch (err) {
      setNpError(err.message || 'Failed to create product.');
    } finally {
      setNpSubmitting(false);
    }
  };

  const handleDeleteProduct = async (slug) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setBusyId(slug);
    try {
      await deleteStoreProduct(slug);
      await loadProducts();
    } catch (err) {
      console.error('Failed to delete product:', err.message);
      alert(err.message || 'Failed to delete product.');
    } finally {
      setBusyId(null);
    }
  };

  const handleAddVariant = async (product) => {
    const form = variantAdd[product.id] || {};
    if (!form.size?.trim() || !form.color?.trim() || form.stock === undefined || form.stock === '') {
      alert('Size, color and stock are required.');
      return;
    }
    setBusyId(product.id);
    try {
      await createProductVariant({
        product: product.id,
        size: form.size.trim(),
        color: form.color.trim(),
        stock: parseInt(form.stock, 10) || 0,
      });
      setVariantAdd((prev) => ({ ...prev, [product.id]: { size: '', color: '', stock: '' } }));
      await loadProducts();
    } catch (err) {
      alert(err.message || 'Failed to add variant.');
    } finally {
      setBusyId(null);
    }
  };

  const handleUpdateVariant = async () => {
    if (!variantEdit) return;
    setBusyId(variantEdit.id);
    try {
      await updateProductVariant(variantEdit.id, {
        size: variantEdit.size.trim(),
        color: variantEdit.color.trim(),
        stock: parseInt(variantEdit.stock, 10) || 0,
      });
      setVariantEdit(null);
      await loadProducts();
    } catch (err) {
      alert(err.message || 'Failed to update variant.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteVariant = async (id) => {
    if (!window.confirm('Delete this variant?')) return;
    setBusyId(id);
    try {
      await deleteProductVariant(id);
      await loadProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete variant.');
    } finally {
      setBusyId(null);
    }
  };

  const handleChangeCover = async (product, file) => {
    const invalid = validateImage(file);
    if (invalid) {
      alert(invalid);
      return;
    }
    setImgBusy(`cover-${product.id}`);
    try {
      await updateStoreProduct(product.slug, {}, file);
      await loadProducts();
    } catch (err) {
      alert(err.message || 'Cover upload failed.');
    } finally {
      setImgBusy(null);
    }
  };

  const handleAddProductImages = async (product, files) => {
    if (!files || files.length === 0) return;
    setImgBusy(`gallery-${product.id}`);
    try {
      let order = product.images?.length || 0;
      for (const file of Array.from(files)) {
        const invalid = validateImage(file);
        if (invalid) {
          alert(`${file.name}: ${invalid}`);
          continue;
        }
        await createProductImage(product.id, file, '', order);
        order += 1;
      }
      await loadProducts();
    } catch (err) {
      alert(err.message || 'Gallery upload failed.');
    } finally {
      setImgBusy(null);
    }
  };

  const handleDeleteProductImage = async (imageId) => {
    if (!window.confirm('Remove this product photo?')) return;
    setImgBusy(`del-${imageId}`);
    try {
      await deleteProductImage(imageId);
      await loadProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete photo.');
    } finally {
      setImgBusy(null);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col md:flex-row antialiased">
      <Navbar2 currentPage={currentPage} setCurrentPage={setCurrentPage} currentUser={currentUser} onLogout={onLogout} />

      <main className="flex-1 p-6 md:p-12 overflow-y-auto mb-20 md:mb-0">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-primary text-left">
            <div>
              <h2 className="font-syne text-3xl font-black text-primary uppercase">Store Products</h2>
              <p className="font-work text-sm text-on-surface-variant font-medium mt-1">Manage the clothing shop catalog, variants and stock.</p>
            </div>
            <button
              onClick={() => setShowNewProduct((v) => !v)}
              className="bg-secondary text-white font-space font-black text-xs uppercase tracking-widest px-5 py-3 border-2 border-primary shadow-[4px_4px_0px_#162c1c] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all flex items-center shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2">{showNewProduct ? 'close' : 'add'}</span>
              {showNewProduct ? 'Cancel' : 'New Product'}
            </button>
          </div>

          {/* New product form */}
          {showNewProduct && (
            <form onSubmit={handleCreateProduct} className="bg-white border-2 border-primary shadow-[4px_4px_0px_#162c1c] rounded p-6 space-y-5 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-space font-black text-[10px] text-primary uppercase mb-2">Name</label>
                  <input
                    value={np.name}
                    onChange={(e) => setNp({ ...np, name: e.target.value })}
                    placeholder="Ex: Mountain Hoodie"
                    className="w-full px-4 py-2.5 border-2 border-primary/20 rounded focus:border-secondary outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block font-space font-black text-[10px] text-primary uppercase mb-2">Price (DA)</label>
                  <input
                    value={np.price}
                    onChange={(e) => setNp({ ...np, price: e.target.value })}
                    placeholder="Ex: 4500"
                    type="number"
                    className="w-full px-4 py-2.5 border-2 border-primary/20 rounded focus:border-secondary outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block font-space font-black text-[10px] text-primary uppercase mb-2">Category</label>
                  <select
                    value={np.category}
                    onChange={(e) => setNp({ ...np, category: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-primary/20 rounded focus:border-secondary outline-none text-sm font-bold bg-white cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 font-space font-bold text-sm text-primary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={np.is_active}
                      onChange={(e) => setNp({ ...np, is_active: e.target.checked })}
                      className="w-5 h-5 accent-secondary"
                    />
                    Active (visible in store)
                  </label>
                </div>
              </div>
              <div>
                <label className="block font-space font-black text-[10px] text-primary uppercase mb-2">Description</label>
                <textarea
                  value={np.description}
                  onChange={(e) => setNp({ ...np, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 border-2 border-primary/20 rounded focus:border-secondary outline-none text-sm font-medium resize-none"
                />
              </div>
              <div>
                <label className="block font-space font-black text-[10px] text-primary uppercase mb-2">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNp({ ...np, cover_image: e.target.files[0] || null })}
                  className="w-full text-sm font-medium text-on-surface-variant"
                />
              </div>
              {npError && (
                <div className="flex items-center gap-2 bg-red-50 border-2 border-red-200 text-red-700 font-medium text-sm px-4 py-3 rounded">
                  <Tag className="w-4 h-4 shrink-0" />
                  {npError}
                </div>
              )}
              <button
                type="submit"
                disabled={npSubmitting}
                className="bg-secondary text-white font-space font-black text-xs uppercase tracking-widest px-6 py-3 border-2 border-primary shadow-[3px_3px_0px_#162c1c] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {npSubmitting ? 'Saving...' : 'Create Product'}
              </button>
            </form>
          )}

          {error && (
            <div className="p-6 text-center bg-white border-2 border-primary border-dashed rounded-xl text-on-surface-variant font-medium">
              {error}
              <button onClick={loadProducts} className="ml-3 text-secondary underline font-bold">Retry</button>
            </div>
          )}

          {/* Products grid */}
          {loading ? (
            <div className="p-12 text-center text-on-surface-variant font-medium">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center bg-white border-2 border-primary border-dashed rounded-xl text-on-surface-variant font-medium">
              No products yet. Create one to begin.
            </div>
          ) : (
            <div className="space-y-8">
              {products.map((product) => (
                <article key={product.id} className="bg-white border-2 border-primary shadow-[6px_6px_0px_#162c1c] rounded p-6 text-left">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 border-b-2 border-primary/10 pb-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded bg-primary-container border-2 border-primary overflow-hidden shrink-0">
                        {product.cover_image_url ? (
                          <img src={product.cover_image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-on-primary">
                            <span className="material-symbols-outlined">image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-syne font-black text-xl text-primary uppercase leading-tight">{product.name}</h3>
                        <p className="font-space font-bold text-xs text-on-surface-variant uppercase tracking-wider mt-0.5 flex items-center gap-2">
                          <span>{CATEGORY_LABELS[product.category] || product.category}</span>
                          <span>·</span>
                          <span>{formatPrice(product.price)}</span>
                          <span className={`px-2 py-0.5 rounded-full font-space font-black text-[9px] uppercase ${product.is_active ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 self-start">
                      <button
                        onClick={() => setImagesOpenId((v) => (v === product.id ? null : product.id))}
                        className={`px-3 py-1.5 border-2 font-space font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                          imagesOpenId === product.id
                            ? 'bg-secondary text-white border-primary'
                            : 'border-secondary text-secondary hover:bg-secondary hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">photo_library</span>
                        {imagesOpenId === product.id ? 'Close Photos' : 'Manage Photos'}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.slug)}
                        disabled={busyId === product.slug}
                        className="px-3 py-1.5 text-error border-2 border-transparent hover:border-error hover:bg-red-55/20 transition-colors font-space font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Inline image manager */}
                  {imagesOpenId === product.id && (
                    <div className="bg-slate-50 border-2 border-primary/20 rounded p-4 mb-4 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-space font-black text-[10px] text-primary uppercase tracking-widest flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-secondary">image</span>
                          Cover Image
                        </span>
                        <label className={`text-[9px] font-space font-black uppercase tracking-wider px-3 py-1.5 border-2 border-primary cursor-pointer transition-colors ${imgBusy === `cover-${product.id}` ? 'bg-slate-200 text-slate-400' : 'bg-secondary text-white hover:bg-primary'}`}>
                          {imgBusy === `cover-${product.id}` ? 'Uploading...' : 'Change Cover'}
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            className="hidden"
                            disabled={imgBusy === `cover-${product.id}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              e.target.value = '';
                              if (file) handleChangeCover(product, file);
                            }}
                          />
                        </label>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-32 h-32 shrink-0 rounded border-2 border-primary overflow-hidden bg-primary-container">
                          {product.cover_image_url ? (
                            <img src={product.cover_image_url} alt={product.name} className="w-full h-full object-cover cursor-zoom-in" onClick={() => setLightbox(product.cover_image_url)} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-on-primary">
                              <span className="material-symbols-outlined">image</span>
                            </div>
                          )}
                        </div>
                        <p className="font-work text-xs text-on-surface-variant font-medium">
                          This is the main photo shown in the store grid.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-primary/10 pt-4">
                        <span className="font-space font-black text-[10px] text-primary uppercase tracking-widest flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-secondary">collections</span>
                          Gallery ({product.images?.length || 0})
                        </span>
                        <label className={`text-[9px] font-space font-black uppercase tracking-wider px-3 py-1.5 border-2 border-primary cursor-pointer transition-colors ${imgBusy === `gallery-${product.id}` ? 'bg-slate-200 text-slate-400' : 'bg-primary text-white hover:bg-secondary'}`}>
                          {imgBusy === `gallery-${product.id}` ? 'Uploading...' : 'Add Photos'}
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            className="hidden"
                            multiple
                            disabled={imgBusy === `gallery-${product.id}`}
                            onChange={(e) => {
                              const files = e.target.files;
                              e.target.value = '';
                              handleAddProductImages(product, files);
                            }}
                          />
                        </label>
                      </div>

                      {product.images?.length ? (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                          {product.images.map((im) => (
                            <div key={im.id} className="relative group aspect-square rounded overflow-hidden border-2 border-primary">
                              <img src={im.image} alt="Product" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setLightbox(im.image)} />
                              <button
                                onClick={() => handleDeleteProductImage(im.id)}
                                disabled={imgBusy === `del-${im.id}`}
                                className="absolute top-1 right-1 w-6 h-6 rounded bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
                                title="Delete"
                              >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-on-surface-variant font-medium border-2 border-dashed border-primary/30 rounded p-4 text-center">
                          No gallery photos yet.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Variants */}
                  <div className="bg-slate-50 border-2 border-primary/20 rounded p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-space font-black text-[10px] text-primary uppercase tracking-widest flex items-center gap-1.5">
                        <Boxes className="w-4 h-4 text-secondary" />
                        Variants & Stock
                      </span>
                      <RefreshCw className="w-4 h-4 text-on-surface-variant" />
                    </div>

                    {product.variants?.length === 0 ? (
                      <p className="text-sm text-on-surface-variant font-medium mb-3">No variants yet.</p>
                    ) : (
                      <div className="overflow-x-auto mb-3">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b-2 border-primary/20 text-primary">
                              <th className="py-2 pr-4 font-space font-black text-[9px] uppercase tracking-widest">Size</th>
                              <th className="py-2 pr-4 font-space font-black text-[9px] uppercase tracking-widest">Color</th>
                              <th className="py-2 pr-4 font-space font-black text-[9px] uppercase tracking-widest">Stock</th>
                              <th className="py-2 font-space font-black text-[9px] uppercase tracking-widest text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-primary/10">
                            {product.variants.map((v) => (
                              <tr key={v.id}>
                                {variantEdit && variantEdit.id === v.id ? (
                                  <>
                                    <td className="py-2 pr-2"><input value={variantEdit.size} onChange={(e) => setVariantEdit({ ...variantEdit, size: e.target.value })} className="w-20 px-2 py-1.5 border-2 border-primary/20 rounded text-sm" /></td>
                                    <td className="py-2 pr-2"><input value={variantEdit.color} onChange={(e) => setVariantEdit({ ...variantEdit, color: e.target.value })} className="w-24 px-2 py-1.5 border-2 border-primary/20 rounded text-sm" /></td>
                                    <td className="py-2 pr-2"><input value={variantEdit.stock} onChange={(e) => setVariantEdit({ ...variantEdit, stock: e.target.value })} type="number" className="w-20 px-2 py-1.5 border-2 border-primary/20 rounded text-sm" /></td>
                                    <td className="py-2 text-right whitespace-nowrap">
                                      <button onClick={handleUpdateVariant} disabled={busyId === v.id} className="px-2 py-1 text-secondary font-bold text-[10px] uppercase mr-1 cursor-pointer disabled:opacity-50">Save</button>
                                      <button onClick={() => setVariantEdit(null)} className="px-2 py-1 text-on-surface-variant font-bold text-[10px] uppercase cursor-pointer">Cancel</button>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="py-2 pr-4 font-space font-bold text-sm text-primary">{v.size}</td>
                                    <td className="py-2 pr-4 font-space font-bold text-sm text-primary">{v.color}</td>
                                    <td className="py-2 pr-4">
                                      <span className={`px-2 py-0.5 rounded-full font-space font-black text-[10px] ${v.stock > 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-700 border border-rose-300'}`}>
                                        {v.stock} in stock
                                      </span>
                                    </td>
                                    <td className="py-2 text-right whitespace-nowrap">
                                      <button onClick={() => setVariantEdit({ id: v.id, size: v.size, color: v.color, stock: v.stock })} className="px-2 py-1 text-secondary font-bold text-[10px] uppercase mr-1 cursor-pointer">Edit</button>
                                      <button onClick={() => handleDeleteVariant(v.id)} disabled={busyId === v.id} className="px-2 py-1 text-error font-bold text-[10px] uppercase cursor-pointer disabled:opacity-50">Delete</button>
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Add variant inline */}
                    <div className="flex flex-wrap items-center gap-2 border-t-2 border-primary/10 pt-3">
                      <input
                        placeholder="Size (Ex: M)"
                        value={variantAdd[product.id]?.size || ''}
                        onChange={(e) => setVariantAdd({ ...variantAdd, [product.id]: { ...variantAdd[product.id], size: e.target.value } })}
                        className="w-24 px-3 py-2 border-2 border-primary/20 rounded text-sm"
                      />
                      <input
                        placeholder="Color (Ex: Green)"
                        value={variantAdd[product.id]?.color || ''}
                        onChange={(e) => setVariantAdd({ ...variantAdd, [product.id]: { ...variantAdd[product.id], color: e.target.value } })}
                        className="w-32 px-3 py-2 border-2 border-primary/20 rounded text-sm"
                      />
                      <input
                        placeholder="Stock"
                        value={variantAdd[product.id]?.stock || ''}
                        onChange={(e) => setVariantAdd({ ...variantAdd, [product.id]: { ...variantAdd[product.id], stock: e.target.value } })}
                        type="number"
                        className="w-24 px-3 py-2 border-2 border-primary/20 rounded text-sm"
                      />
                      <button
                        onClick={() => handleAddVariant(product)}
                        disabled={busyId === product.id}
                        className="px-4 py-2 bg-primary text-white font-space font-black text-[10px] uppercase tracking-wider border-2 border-primary shadow-[2px_2px_0px_#162c1c] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Add Variant
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="Preview" className="max-h-full max-w-full object-contain border-4 border-white rounded" />
        </div>
      )}
    </div>
  );
}
