import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Search, SlidersHorizontal, ChevronRight, Package, Store } from 'lucide-react';
import { fetchProducts } from '../services/api';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 't-shirt', label: 'T-Shirt' },
  { value: 'hoodie', label: 'Hoodie' },
  { value: 'cap', label: 'Cap' },
];

const CATEGORY_LABELS = {
  't-shirt': 'T-Shirt',
  hoodie: 'Hoodie',
  cap: 'Cap',
};

function formatPrice(price) {
  const num = parseFloat(price);
  if (Number.isNaN(num)) return '';
  return num.toLocaleString('fr-DZ', { maximumFractionDigits: 0 }).replace(/\s/g, '.') + ' DA';
}

export default function StorePage({ setCurrentPage, onSelectProduct, cart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  async function load(cat = category, term = searchTerm) {
    setLoading(true);
    setError(null);
    try {
      const params = { page_size: 50 };
      if (cat) params.category = cat;
      if (term) params.search = term;
      const data = await fetchProducts(params);
      setProducts(data.results || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load('', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleView = (slug) => {
    onSelectProduct(slug);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.quantity, 0), [cart]);

  const visibleProducts = useMemo(() => {
    if (!searchTerm) return products;
    const q = searchTerm.toLowerCase();
    return products.filter((p) => (p.name || '').toLowerCase().includes(q));
  }, [products, searchTerm]);

  return (
    <div className="pt-20 bg-brand-bg min-h-screen relative overflow-x-hidden font-work">
      {/* Decorative blurred background glows */}
      <div className="absolute top-40 right-16 w-64 h-64 bg-brand-orange/10 opacity-25 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-brand-forest/10 opacity-25 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Hero banner */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-10 relative">
        <div className="bg-brand-forest text-white border-4 border-brand-forestDark shadow-[8px_8px_0px_0px_rgba(22,44,28,1)] rounded p-8 md:p-14 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <svg fill="currentColor" height="240" viewBox="0 0 100 100" width="240" className="text-brand-sand">
              <path d="M45.7,-76.1C58.9,-69.3,68.8,-55.4,76.5,-41.1C84.2,-26.8,89.7,-12.1,87.6,1.8C85.5,15.7,75.8,28.8,65.8,40.4C55.8,52,45.5,62.1,32.6,69.5C19.7,76.9,4.2,81.6,-10.8,80.1C-25.8,78.6,-40.3,70.9,-52.3,60.6C-64.3,50.3,-73.8,37.4,-79.8,22.7C-85.8,8,-88.3,-8.5,-83.4,-23.4C-78.5,-38.3,-66.2,-51.6,-51.8,-58.5C-37.4,-65.4,-20.9,-65.9,-4.6,-59.5C11.7,-53.1,28.2,-50,45.7,-76.1Z" transform="translate(100 100)"></path>
            </svg>
          </div>
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 bg-brand-orange text-white font-space font-black text-[10px] uppercase tracking-widest px-3 py-1.5 border border-brand-forestDark shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded mb-4">
              <Store className="w-4 h-4" />
              Official Store
            </span>
            <h1 className="font-syne text-3xl md:text-6xl font-black text-brand-sand uppercase leading-none tracking-tight mb-4">
              Wear the <span className="text-brand-orange">Adventure.</span>
            </h1>
            <p className="font-medium text-sm md:text-lg text-brand-sand/85 max-w-2xl leading-relaxed">
              Official Project Nature merchandise. Every piece funds a new expedition across the raw wilderness of Algeria.
            </p>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-brand-forest/15 pb-6">
          <div className="flex items-center gap-3 w-full overflow-x-auto scrollbar-none pb-2 md:pb-0">
            <span className="text-sm font-bold text-brand-forestDark mr-1 font-space shrink-0 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-brand-orange" />
              Filter:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setCategory(cat.value);
                  load(cat.value, '');
                }}
                className={`px-5 py-2.5 border-2 border-brand-forestDark rounded font-space font-bold text-xs uppercase transition-all shrink-0 cursor-pointer ${
                  category === cat.value
                    ? 'bg-brand-orange text-white shadow-brutalist-dark translate-x-0.5 translate-y-0.5'
                    : 'bg-white text-brand-forestDark hover:border-brand-orange hover:text-brand-orange'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40">
              <Search className="w-4 h-4" />
            </span>
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                load(category, e.target.value);
              }}
              placeholder="Search products..."
              type="text"
              className="w-full pl-10 pr-4 py-3 border-2 border-brand-forestDark/20 rounded focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none text-sm font-medium transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
        {loading ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-brand-orange mx-auto animate-bounce" />
            <p className="mt-4 font-space font-bold text-brand-dark/50 uppercase tracking-widest text-xs">Loading the shop...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white border-2 border-dashed border-brand-forest/20 rounded p-8">
            <p className="text-red-600 font-bold font-space mb-4">{error}</p>
            <button
              onClick={() => load(category, '')}
              className="text-xs font-space font-black bg-brand-orange text-white px-5 py-2.5 rounded border-2 border-brand-forestDark shadow-brutalist-dark cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border-2 border-dashed border-brand-forest/20 rounded p-8">
            <p className="text-brand-dark/50 font-bold font-space text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProducts.map((product, idx) => (
              <article
                key={product.id}
                className={`bg-white border-2 border-brand-forestDark rounded overflow-hidden shadow-brutalist-forest hover:shadow-brutalist-orange hover:-translate-y-1 transition-all duration-300 flex flex-col transform cursor-pointer ${
                  idx % 3 === 1 ? 'md:-translate-y-3' : ''
                }`}
              >
                <div className="relative h-64 overflow-hidden border-b-2 border-brand-forestDark bg-brand-sand/30">
                  {product.cover_image_url ? (
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      src={product.cover_image_url}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-forest/30">
                      <Store className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-brand-orange text-white text-[10px] font-space font-black px-3 py-1.5 border border-brand-forestDark shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded uppercase">
                    {CATEGORY_LABELS[product.category] || product.category}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-brand-forestDark/95 text-brand-sand text-xs font-space font-black px-3 py-1.5 border border-white/20 rounded shadow-lg">
                    {formatPrice(product.price)}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black text-brand-forestDark font-syne mb-2 uppercase leading-none">
                      {product.name}
                    </h3>
                    <p className="text-brand-dark/70 text-sm font-medium leading-relaxed mb-4 line-clamp-2">
                      {product.description || 'Official Project Nature merchandise.'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-brand-forest/10 mt-auto">
                    <span className="text-[10px] font-space font-bold text-brand-dark/45 flex items-center gap-1.5 uppercase">
                      <ShoppingBag className="w-3.5 h-3.5 text-brand-orange" />
                      {product.variants?.length || 0} sizes
                    </span>
                    <button
                      onClick={() => handleView(product.slug)}
                      className="text-[11px] font-space font-black text-brand-orange hover:text-brand-orangeDark uppercase flex items-center gap-1 transition-all group"
                    >
                      <span>View</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Floating cart button */}
      {cartCount > 0 && (
        <button
          onClick={() => {
            setCurrentPage('cart');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-6 right-6 z-50 bg-brand-orange hover:bg-brand-orangeDark text-white font-space font-black text-xs uppercase tracking-widest px-5 py-3.5 border-2 border-brand-forestDark shadow-[4px_4px_0px_rgba(22,44,28,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          View Cart ({cartCount})
        </button>
      )}
    </div>
  );
}
