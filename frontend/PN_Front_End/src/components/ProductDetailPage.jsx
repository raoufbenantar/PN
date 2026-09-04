import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ShoppingBag, Minus, Plus, CheckCircle, Store, ShieldCheck } from 'lucide-react';
import { fetchProductBySlug } from '../services/api';

function formatPrice(price) {
  const num = parseFloat(price);
  if (Number.isNaN(num)) return '';
  return num.toLocaleString('fr-DZ', { maximumFractionDigits: 0 }).replace(/\s/g, '.') + ' DA';
}

export default function ProductDetailPage({ selectedProductSlug, setCurrentPage, addToCart }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!selectedProductSlug) {
        setLoading(false);
        setError('No product selected.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductBySlug(selectedProductSlug);
        if (!cancelled) {
          setProduct(data);
          setActiveImage(data.cover_image_url || data.images?.[0]?.image || null);
          setSelectedSize(null);
          setSelectedColor(null);
          setQuantity(1);
          setAdded(false);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load product.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [selectedProductSlug]);

  const variants = useMemo(() => (product?.variants || []), [product]);
  const sizes = useMemo(() => [...new Set(variants.map((v) => v.size).filter(Boolean))], [variants]);
  const colors = useMemo(() => [...new Set(variants.map((v) => v.color).filter(Boolean))], [variants]);

  const variantFor = (size, color) => variants.find((v) => v.size === size && v.color === color && v.stock > 0);

  const isSelectable = (size, color) => !!variantFor(size, color);

  const availableColorsForSize = (size) =>
    colors.filter((c) => isSelectable(size, c));
  const availableSizesForColor = (color) =>
    sizes.filter((s) => isSelectable(s, color));

  const selectedVariant = selectedSize && selectedColor ? variantFor(selectedSize, selectedColor) : null;
  const hasStock = variants.some((v) => v.stock > 0);

  const gallery = useMemo(() => {
    if (!product) return [];
    const imgs = [];
    if (product.cover_image_url) imgs.push(product.cover_image_url);
    (product.images || []).forEach((img) => { if (img.image) imgs.push(img.image); });
    return [...new Set(imgs)];
  }, [product]);

  const handleSelectSize = (size) => {
    setSelectedSize(size);
    const avail = availableColorsForSize(size);
    if (!selectedColor || !avail.includes(selectedColor)) {
      setSelectedColor(avail[0] || null);
    }
    setQuantity(1);
    setAdded(false);
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    const avail = availableSizesForColor(color);
    if (!selectedSize || !avail.includes(selectedSize)) {
      setSelectedSize(avail[0] || null);
    }
    setQuantity(1);
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return;
    addToCart({
      variantId: selectedVariant.id,
      productName: product.name,
      size: selectedSize,
      color: selectedColor,
      price: parseFloat(product.price),
      quantity,
      stock: selectedVariant.stock,
    });
    setAdded(true);
  };

  const backToStore = () => {
    setCurrentPage('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="pt-20 bg-brand-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Store className="w-12 h-12 text-brand-orange mx-auto animate-bounce" />
          <p className="mt-4 font-space font-bold text-brand-dark/50 uppercase tracking-widest text-xs">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-20 bg-brand-bg min-h-screen">
        <div className="max-w-3xl mx-auto px-6 pt-10">
          <button onClick={backToStore} className="inline-flex items-center gap-2 text-xs font-space font-black uppercase tracking-wider text-brand-orange hover:text-brand-orangeDark transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Store
          </button>
          <div className="mt-8 text-center bg-white border-2 border-dashed border-brand-forest/20 rounded p-12">
            <p className="text-red-600 font-bold font-space text-lg mb-4">{error}</p>
            <button onClick={backToStore} className="text-xs font-space font-black bg-brand-orange text-white px-5 py-2.5 rounded border-2 border-brand-forestDark shadow-brutalist-dark cursor-pointer">
              Return to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 md:pb-0 bg-brand-bg min-h-screen relative font-work text-brand-dark">
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <button onClick={backToStore} className="inline-flex items-center gap-2 text-xs font-space font-black uppercase tracking-wider text-brand-orange hover:text-brand-orangeDark transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Store
        </button>
      </div>

      <section className="max-w-7xl mx-auto px-6 mt-4 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative bg-brand-sand/30 border-2 border-brand-forestDark shadow-brutalist-forest rounded overflow-hidden">
            {activeImage ? (
              <img alt={product.name} className="w-full aspect-square object-cover" src={activeImage} />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center text-brand-forest/30">
                <Store className="w-20 h-20" />
              </div>
            )}
            <span className="absolute top-4 left-4 bg-brand-orange text-white text-[10px] font-space font-black px-3 py-1.5 border border-brand-forestDark shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded uppercase">
              {product.category}
            </span>
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 shrink-0 rounded border-2 overflow-hidden cursor-pointer transition-all ${
                    activeImage === img ? 'border-brand-orange shadow-[2px_2px_0px_rgba(22,44,28,1)]' : 'border-brand-forestDark/30 hover:border-brand-forestDark'
                  }`}
                >
                  <img alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" src={img} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="font-syne text-3xl md:text-5xl font-black text-brand-forestDark uppercase leading-none tracking-tight mb-4">
            {product.name}
          </h1>

          <p className="font-syne text-3xl md:text-4xl font-black text-brand-orange mb-6">
            {formatPrice(product.price)}
          </p>

          <p className="text-brand-dark/70 font-medium leading-relaxed mb-8">
            {product.description || 'Official Project Nature merchandise.'}
          </p>

          {!hasStock ? (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 font-space font-black text-sm uppercase tracking-widest px-4 py-3 rounded mb-6">
              Out of stock
            </div>
          ) : (
            <>
              {/* Size picker */}
              <div className="mb-6">
                <span className="block font-space font-black text-[10px] text-brand-forestDark/65 uppercase tracking-widest mb-3">
                  Size {selectedSize && <span className="text-brand-orange">· {selectedSize}</span>}
                </span>
                <div className="flex flex-wrap gap-2">
                  {sizes.length === 0 && (
                    <span className="text-sm text-brand-dark/50 font-medium">No sizes available.</span>
                  )}
                  {sizes.map((size) => {
                    const disabled = availableColorsForSize(size).length === 0;
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        disabled={disabled}
                        onClick={() => handleSelectSize(size)}
                        className={`min-w-[48px] px-4 py-2.5 border-2 rounded font-space font-black text-xs uppercase transition-all cursor-pointer ${
                          disabled
                            ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                            : active
                            ? 'bg-brand-forestDark text-white border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] translate-x-0.5 translate-y-0.5'
                            : 'bg-white text-brand-forestDark border-brand-forestDark hover:border-brand-orange hover:text-brand-orange'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color picker */}
              <div className="mb-6">
                <span className="block font-space font-black text-[10px] text-brand-forestDark/65 uppercase tracking-widest mb-3">
                  Color {selectedColor && <span className="text-brand-orange">· {selectedColor}</span>}
                </span>
                <div className="flex flex-wrap gap-2">
                  {colors.length === 0 && (
                    <span className="text-sm text-brand-dark/50 font-medium">No colors available.</span>
                  )}
                  {colors.map((color) => {
                    const disabled = availableSizesForColor(color).length === 0;
                    const active = selectedColor === color;
                    return (
                      <button
                        key={color}
                        disabled={disabled}
                        onClick={() => handleSelectColor(color)}
                        className={`px-4 py-2.5 border-2 rounded font-space font-black text-xs uppercase transition-all cursor-pointer ${
                          disabled
                            ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                            : active
                            ? 'bg-brand-forestDark text-white border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] translate-x-0.5 translate-y-0.5'
                            : 'bg-white text-brand-forestDark border-brand-forestDark hover:border-brand-orange hover:text-brand-orange'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity + Add to cart */}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                {selectedVariant && (
                  <div className="flex items-center border-2 border-brand-forestDark rounded overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-11 h-11 flex items-center justify-center text-brand-forestDark hover:bg-brand-sand/50 disabled:text-slate-300 disabled:cursor-not-allowed bg-white cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 h-11 flex items-center justify-center font-space font-black text-brand-forestDark bg-brand-sand/40">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                      disabled={quantity >= selectedVariant.stock}
                      className="w-11 h-11 flex items-center justify-center text-brand-forestDark hover:bg-brand-sand/50 disabled:text-slate-300 disabled:cursor-not-allowed bg-white cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant}
                  className={`flex-1 min-w-[200px] bg-brand-orange hover:bg-brand-orangeDark text-white py-4 font-space font-black border-2 border-brand-forestDark shadow-[4px_4px_0px_rgba(22,44,28,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:bg-gray-400 disabled:border-gray-500 disabled:shadow-none transition-all uppercase tracking-widest text-sm rounded flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {selectedVariant ? 'Add to Cart' : 'Select a Size'}
                </button>
              </div>

              {selectedVariant && selectedVariant.stock <= 3 && (
                <p className="mt-3 text-xs font-space font-bold text-brand-orange uppercase tracking-wider">
                  Only {selectedVariant.stock} left in stock
                </p>
              )}

              {added && (
                <div className="mt-4 flex items-center gap-2 bg-emerald-50 border-2 border-emerald-200 text-emerald-800 font-space font-bold text-sm px-4 py-3 rounded">
                  <CheckCircle className="w-5 h-5" />
                  Added to cart!
                  <button
                    onClick={() => { setCurrentPage('cart'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="ml-auto text-xs font-black uppercase tracking-wider text-brand-orange hover:underline"
                  >
                    View Cart
                  </button>
                </div>
              )}
            </>
          )}

          <div className="mt-8 flex items-center gap-3 bg-brand-sand/40 border-2 border-brand-forestDark/20 rounded p-4 text-brand-forestDark font-space font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5 text-brand-orange" />
            Official merchandise · Ships Algeria-wide
          </div>
        </div>
      </section>
    </div>
  );
}
