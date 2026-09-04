import { useState, useEffect, useCallback } from 'react';
import Navbar2 from './Navbar2';
import { fetchOrders, updateOrderStatus } from '../services/api';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function formatPrice(price) {
  const num = parseFloat(price);
  if (Number.isNaN(num)) return '';
  return num.toLocaleString('fr-DZ', { maximumFractionDigits: 0 }).replace(/\s/g, '.') + ' DA';
}

const statusBadge = (status) => {
  const map = {
    new: 'bg-amber-100 text-amber-800 border-amber-300',
    confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    cancelled: 'bg-rose-100 text-rose-800 border-rose-300',
  };
  return map[status] || 'bg-slate-100 text-slate-600 border-slate-300';
};

export default function AdminStoreOrders({ currentPage, setCurrentPage, currentUser, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [busyId, setBusyId] = useState(null);

  const loadOrders = useCallback(async (status = statusFilter) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page_size: 50 };
      if (status) params.status = status;
      const data = await fetchOrders(params);
      setOrders(data.results || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadOrders(statusFilter);
  }, [statusFilter, loadOrders]);

  const handleStatusChange = async (id, newStatus) => {
    setBusyId(id);
    try {
      await updateOrderStatus(id, newStatus);
      await loadOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col md:flex-row antialiased">
      <Navbar2 currentPage={currentPage} setCurrentPage={setCurrentPage} currentUser={currentUser} onLogout={onLogout} />

      <main className="flex-1 flex flex-col overflow-y-auto mb-20 md:mb-0">
        <header className="hidden md:flex w-full h-16 bg-white border-b-2 border-primary justify-between items-center px-6 md:px-12 sticky top-0 z-40">
          <div className="text-left">
            <h2 className="font-syne font-bold text-lg text-primary uppercase">Store Orders</h2>
          </div>
        </header>

        <div className="p-6 md:p-12 max-w-6xl mx-auto w-full space-y-10 text-left">
          {/* Page hero */}
          <div>
            <span className="font-space font-black text-xs text-secondary uppercase tracking-widest block mb-2">Commerce Management</span>
            <h1 className="font-syne font-black text-3xl text-primary uppercase">Orders</h1>
            <p className="font-work text-sm text-on-surface-variant max-w-2xl mt-1">
              Review and confirm incoming shop orders. Cancelling an order automatically restores stock.
            </p>
          </div>

          {/* Status filter chips */}
          <div className="flex flex-wrap gap-3">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-5 py-2 border-2 rounded font-space font-bold text-xs uppercase transition-all cursor-pointer ${
                  statusFilter === tab.value
                    ? 'bg-primary text-white border-primary shadow-[2px_2px_0px_#162c1c]'
                    : 'bg-white text-primary border-primary hover:border-secondary hover:text-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-6 text-center bg-white border-2 border-primary border-dashed rounded-xl text-on-surface-variant font-medium">
              {error}
              <button onClick={() => loadOrders()} className="ml-3 text-secondary underline font-bold">Retry</button>
            </div>
          )}

          {/* Orders table */}
          <div className="bg-white border-2 border-primary hard-shadow overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-amber-50/50 border-b-2 border-primary text-primary">
                    <th className="p-5 font-space font-black text-[10px] uppercase tracking-widest">Order</th>
                    <th className="p-5 font-space font-black text-[10px] uppercase tracking-widest">Customer</th>
                    <th className="p-5 font-space font-black text-[10px] uppercase tracking-widest">Items</th>
                    <th className="p-5 font-space font-black text-[10px] uppercase tracking-widest">Total</th>
                    <th className="p-5 font-space font-black text-[10px] uppercase tracking-widest">Status</th>
                    <th className="p-5 font-space font-black text-[10px] uppercase tracking-widest">Date</th>
                    <th className="p-5 font-space font-black text-[10px] uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  {loading ? (
                    <tr><td colSpan="7" className="p-10 text-center text-on-surface-variant font-medium">Loading orders...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan="7" className="p-10 text-center text-on-surface-variant font-medium">No orders found.</td></tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-5">
                          <span className="font-syne font-bold text-sm text-primary">#{order.id}</span>
                          {order.stock_restored && (
                            <span className="block text-[9px] font-space font-black uppercase text-amber-700 mt-0.5">stock restored</span>
                          )}
                        </td>
                        <td className="p-5">
                          <p className="font-syne font-bold text-sm text-primary leading-tight">{order.full_name}</p>
                          <p className="font-space text-[10px] text-on-surface-variant mt-0.5">{order.phone_number}</p>
                        </td>
                        <td className="p-5">
                          <div className="space-y-1 max-w-xs">
                            {order.items.map((item) => (
                              <p key={item.id} className="font-space text-[11px] text-primary font-bold leading-tight">
                                {item.product_name} <span className="text-on-surface-variant">· {item.size}/{item.color} · x{item.quantity}</span>
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="font-space font-black text-sm text-primary">{formatPrice(order.total)}</span>
                        </td>
                        <td className="p-5">
                          <span className={`px-2.5 py-0.5 rounded-full font-space font-black text-[9px] uppercase tracking-wider border ${statusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-5 text-on-surface-variant font-space text-[11px] font-bold">
                          {new Date(order.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleStatusChange(order.id, 'confirmed')}
                              disabled={order.status === 'confirmed' || busyId === order.id}
                              className={`px-3 py-1.5 rounded font-space font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                                order.status === 'confirmed'
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                  : 'bg-primary text-white hover:bg-primary/90'
                              }`}
                            >
                              CONFIRM
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'cancelled')}
                              disabled={order.status === 'cancelled' || busyId === order.id}
                              className={`px-3 py-1.5 rounded font-space font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer border ${
                                order.status === 'cancelled'
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                                  : 'border-red-600 text-red-650 hover:bg-red-50'
                              }`}
                            >
                              CANCEL
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
