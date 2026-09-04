import { useState, useMemo } from 'react';
import { ArrowLeft, ShoppingBag, CreditCard, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { createOrder } from '../services/api';

function formatPrice(price) {
  const num = parseFloat(price);
  if (Number.isNaN(num)) return '';
  return num.toLocaleString('fr-DZ', { maximumFractionDigits: 0 }).replace(/\s/g, '.') + ' DA';
}

export default function CheckoutPage({ cart, clearCart, setCurrentPage }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0),
    [cart]
  );

  const goToStore = () => {
    setCurrentPage('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!/^0\d{9}$/.test(phone.replace(/\s/g, ''))) {
      setFormError('Please enter a valid 10-digit Algerian phone number starting with 0.');
      return;
    }
    if (!address.trim()) {
      setFormError('Please enter your delivery address.');
      return;
    }
    if (cart.length === 0) {
      setFormError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        full_name: fullName.trim(),
        phone_number: phone.replace(/\s/g, ''),
        delivery_address: address.trim(),
        items: cart.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
      });
      clearCart();
      setPlacedOrder(order);
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success confirmation screen
  if (placedOrder) {
    return (
      <div className="pt-20 bg-brand-bg min-h-screen font-work flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-brand-sand border-4 border-brand-forestDark rounded p-8 shadow-[8px_8px_0px_0px_rgba(22,44,28,1)] animate-scale-up">
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-forestDark text-brand-sand rounded-full border-4 border-white mb-6 animate-bounce-short">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black font-syne text-brand-forestDark uppercase tracking-tight mb-4">
              Order Placed!
            </h3>
            <p className="text-brand-dark/80 font-medium mb-2 leading-relaxed">
              Thank you <strong className="text-brand-orange">{placedOrder.full_name}</strong>! Your order
              <strong className="text-brand-orange"> #{placedOrder.id}</strong> has been received. We'll phone you at
              <strong className="text-brand-orange"> {placedOrder.phone_number}</strong> to confirm delivery.
            </p>
            <p className="text-sm text-brand-dark/60 font-medium mb-6">
              Total: <strong className="text-brand-orange font-black">{formatPrice(placedOrder.total)}</strong>
            </p>
            <button
              onClick={goToStore}
              className="bg-brand-orange text-white px-8 py-3.5 font-space font-black border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase rounded w-full cursor-pointer"
            >
              Back to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-20 bg-brand-bg min-h-screen font-work">
        <div className="max-w-2xl mx-auto px-6 pt-16 pb-24 text-center">
          <div className="bg-white border-2 border-brand-forestDark shadow-brutalist-forest rounded p-12">
            <h2 className="font-syne text-3xl font-black text-brand-forestDark uppercase mb-3">Nothing to checkout</h2>
            <p className="text-brand-dark/60 font-medium mb-8">Your cart is empty. Add something first.</p>
            <button onClick={goToStore} className="bg-brand-orange hover:bg-brand-orangeDark text-white px-8 py-3.5 font-space font-black text-xs uppercase tracking-widest border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded mx-auto cursor-pointer">
              Browse the Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-brand-bg min-h-screen font-work relative">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-24">
        <button onClick={() => { setCurrentPage('cart'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-2 text-xs font-space font-black uppercase tracking-wider text-brand-orange hover:text-brand-orangeDark transition-colors group mb-6">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Cart
        </button>

        <h1 className="font-syne text-3xl md:text-5xl font-black text-brand-forestDark uppercase leading-none tracking-tight mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Delivery form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border-2 border-brand-forestDark shadow-brutalist-forest rounded p-6 md:p-8 space-y-6">
            <h2 className="font-syne font-black text-xl text-brand-forestDark uppercase border-b-2 border-brand-forestDark pb-3">
              Delivery information
            </h2>

            <div>
              <label className="block font-space font-black text-[10px] text-brand-forestDark/65 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Amine Benali"
                type="text"
                className="w-full pl-4 pr-4 py-3 border-2 border-brand-forestDark/20 rounded focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none text-sm font-medium transition-colors"
              />
            </div>

            <div>
              <label className="block font-space font-black text-[10px] text-brand-forestDark/65 uppercase tracking-widest mb-2">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 0555 12 34 56"
                type="tel"
                className="w-full pl-4 pr-4 py-3 border-2 border-brand-forestDark/20 rounded focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none text-sm font-medium transition-colors"
              />
              <p className="text-[10px] font-space font-bold text-brand-dark/40 uppercase tracking-wider mt-1">10-digit Algerian number starting with 0</p>
            </div>

            <div>
              <label className="block font-space font-black text-[10px] text-brand-forestDark/65 uppercase tracking-widest mb-2">
                Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your full delivery address"
                rows={4}
                className="w-full pl-4 pr-4 py-3 border-2 border-brand-forestDark/20 rounded focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none text-sm font-medium transition-colors resize-none"
              />
            </div>

            {formError && (
              <div className="flex items-start gap-2 bg-red-50 border-2 border-red-200 text-red-700 font-medium text-sm px-4 py-3 rounded">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-orange hover:bg-brand-orangeDark text-white py-4 font-space font-black border-2 border-brand-forestDark shadow-[4px_4px_0px_rgba(22,44,28,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:bg-gray-400 disabled:border-gray-500 disabled:shadow-none transition-all uppercase tracking-widest text-sm rounded flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? <Loader className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
              {submitting ? 'Placing order...' : `Place Order · ${formatPrice(total)}`}
            </button>
          </form>

          {/* Order summary */}
          <aside className="lg:col-span-5">
            <div className="bg-brand-forestDark text-white border-2 border-brand-forestDark shadow-brutalist-forest rounded p-6 md:p-8 sticky top-24">
              <h2 className="font-syne font-black text-lg text-brand-sand uppercase border-b-2 border-brand-sand/20 pb-3 mb-5">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1 mb-6">
                {cart.map((item) => (
                  <div key={item.variantId} className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="font-space font-bold text-sm text-brand-sand leading-tight">{item.productName}</p>
                      <p className="font-space font-bold text-[10px] text-brand-sand/50 uppercase tracking-wider mt-0.5">
                        {item.size} · {item.color} · x{item.quantity}
                      </p>
                    </div>
                    <span className="font-space font-black text-sm text-brand-orange shrink-0">
                      {formatPrice((parseFloat(item.price) || 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-brand-sand/20 pt-4 flex justify-between items-center">
                <span className="font-space font-black text-xs text-brand-sand uppercase tracking-widest">Total</span>
                <span className="font-syne font-black text-2xl text-brand-orange">{formatPrice(total)}</span>
              </div>
              <p className="mt-4 text-[10px] text-brand-sand/60 text-center italic font-medium flex items-center justify-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                Payment on delivery
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
