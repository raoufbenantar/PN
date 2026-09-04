import { useMemo } from 'react';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

function formatPrice(price) {
  const num = parseFloat(price);
  if (Number.isNaN(num)) return '';
  return num.toLocaleString('fr-DZ', { maximumFractionDigits: 0 }).replace(/\s/g, '.') + ' DA';
}

export default function CartPage({ cart, updateCartQty, removeFromCart, clearCart, setCurrentPage }) {
  const total = useMemo(
    () => cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0),
    [cart]
  );

  const goToStore = () => {
    setCurrentPage('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (cart.length === 0) {
    return (
      <div className="pt-20 bg-brand-bg min-h-screen font-work">
        <div className="max-w-2xl mx-auto px-6 pt-16 pb-24 text-center">
          <div className="bg-white border-2 border-brand-forestDark shadow-brutalist-forest rounded p-12">
            <div className="w-20 h-20 mx-auto bg-brand-sand/40 border-2 border-brand-forestDark/20 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-9 h-9 text-brand-forest/40" />
            </div>
            <h2 className="font-syne text-3xl font-black text-brand-forestDark uppercase mb-3">Your cart is empty</h2>
            <p className="text-brand-dark/60 font-medium mb-8">
              Looking for something? Explore the official store for the perfect piece.
            </p>
            <button
              onClick={goToStore}
              className="bg-brand-orange hover:bg-brand-orangeDark text-white px-8 py-3.5 font-space font-black text-xs uppercase tracking-widest border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded flex items-center gap-2 mx-auto cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse the Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-brand-bg min-h-screen font-work relative">
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-24">
        <button onClick={goToStore} className="inline-flex items-center gap-2 text-xs font-space font-black uppercase tracking-wider text-brand-orange hover:text-brand-orangeDark transition-colors group mb-6">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-8">
          <div>
            <h1 className="font-syne text-3xl md:text-5xl font-black text-brand-forestDark uppercase leading-none tracking-tight">
              Your Cart
            </h1>
            <p className="text-brand-dark/60 font-medium mt-2">
              {cart.length} item{cart.length > 1 ? 's' : ''} · {formatPrice(total)} total
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-space font-bold uppercase tracking-wider text-error hover:underline flex items-center gap-1.5 cursor-pointer bg-transparent border-none"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        <div className="space-y-5">
          {cart.map((item) => {
            const lineTotal = (parseFloat(item.price) || 0) * item.quantity;
            const maxQty = item.stock || 99;
            return (
              <div key={item.variantId} className="bg-white border-2 border-brand-forestDark shadow-brutalist-forest rounded p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-16 h-16 rounded bg-brand-sand/40 border-2 border-brand-forestDark/20 flex items-center justify-center text-brand-forest/40 shrink-0">
                  <ShoppingBag className="w-7 h-7" />
                </div>

                <div className="flex-1">
                  <h3 className="font-syne font-black text-lg text-brand-forestDark uppercase leading-tight">
                    {item.productName}
                  </h3>
                  <p className="font-space font-bold text-xs text-brand-dark/50 uppercase tracking-wider mt-1">
                    Size: {item.size} · Color: {item.color}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-space font-black text-brand-forestDark">{formatPrice(item.price)}</p>
                </div>

                <div className="flex items-center border-2 border-brand-forestDark rounded overflow-hidden">
                  <button
                    onClick={() => updateCartQty(item.variantId, item.quantity - 1)}
                    className="w-9 h-9 flex items-center justify-center text-brand-forestDark hover:bg-brand-sand/50 bg-white cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 h-9 flex items-center justify-center font-space font-black text-brand-forestDark bg-brand-sand/40">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQty(item.variantId, Math.min(maxQty, item.quantity + 1))}
                    disabled={item.quantity >= maxQty}
                    className="w-9 h-9 flex items-center justify-center text-brand-forestDark hover:bg-brand-sand/50 disabled:text-slate-300 disabled:cursor-not-allowed bg-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right w-full sm:w-32">
                  <p className="font-syne font-black text-lg text-brand-orange">{formatPrice(lineTotal)}</p>
                  <button
                    onClick={() => removeFromCart(item.variantId)}
                    className="mt-1 text-[10px] font-space font-bold uppercase tracking-wider text-error hover:underline flex items-center gap-1 sm:justify-end cursor-pointer bg-transparent border-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="mt-8 bg-brand-forestDark text-white border-2 border-brand-forestDark shadow-brutalist-forest rounded p-6 md:p-8">
          <div className="flex justify-between items-center mb-2">
            <span className="font-space font-black text-[10px] text-brand-sand/60 uppercase tracking-widest">Subtotal</span>
            <span className="font-syne font-black text-xl text-brand-sand">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="font-space font-black text-[10px] text-brand-sand/60 uppercase tracking-widest">Delivery</span>
            <span className="font-space font-black text-sm text-brand-sand/80 uppercase">Calculated at checkout</span>
          </div>
          <div className="border-t-2 border-brand-sand/20 pt-4 flex justify-between items-center mb-6">
            <span className="font-space font-black text-xs text-brand-sand uppercase tracking-widest">Total</span>
            <span className="font-syne font-black text-3xl text-brand-orange">{formatPrice(total)}</span>
          </div>
          <button
            onClick={() => { setCurrentPage('checkout'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="w-full bg-brand-orange hover:bg-brand-orangeDark text-white py-4 font-space font-black border-2 border-brand-forestDark shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-widest text-sm rounded flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
