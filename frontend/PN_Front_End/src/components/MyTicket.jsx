import React, { useState, useEffect } from 'react';
import { Camera, Phone, User, MapPin, ArrowLeft, CheckCircle, X, RefreshCw } from 'lucide-react';
import { fetchInquiryTicket, getMyInquiryId } from '../services/api';

export default function MyTicket({ setCurrentPage, currentUser, onLogout }) {
  const [status, setStatus] = useState('loading'); // loading | found | notConfirmed | error | none
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTicket() {
      const id = getMyInquiryId();
      if (!id) {
        if (!cancelled) setStatus('none');
        return;
      }
      try {
        const data = await fetchInquiryTicket(id);
        if (cancelled) return;
        setTicket(data);
        setStatus('found');
      } catch (err) {
        if (cancelled) return;
        // 404 -> not confirmed yet; anything else -> error
        setStatus(err && err.status === 404 ? 'notConfirmed' : 'error');
      }
    }

    loadTicket();
    return () => { cancelled = true; };
  }, []);

  const handleBack = () => {
    if (setCurrentPage) setCurrentPage('landing');
    if (window) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-brand-bg text-brand-dark min-h-screen font-work selection:bg-brand-orange selection:text-white">
      {/* Top header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-brand-bg/90 backdrop-blur-md border-b-2 border-brand-forest/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-brand-orange text-brand-forestDark hover:text-white font-space font-black text-xs uppercase tracking-wider border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleBack}
            className="flex items-center space-x-2 group focus:outline-none bg-transparent border-none cursor-pointer"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-brand-orange text-white rounded shadow-brutalist-forest border-2 border-brand-forestDark transform -rotate-3 group-hover:rotate-0 transition-transform">
              <span className="text-base font-bold font-syne italic">△</span>
            </div>
            <span className="text-lg font-extrabold font-syne tracking-tight text-brand-dark">Project <span className="font-light italic text-brand-forest">Nature</span></span>
          </button>

          {currentUser ? (
            <button
              onClick={() => { if (onLogout) onLogout(); }}
              className="px-4 py-2 bg-white hover:bg-brand-orange text-brand-orange hover:text-white font-space font-black text-xs uppercase tracking-wider border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <span className="px-2" />
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-28 pb-16">
        {status === 'loading' && (
          <div className="text-center py-20">
            <RefreshCw className="w-8 h-8 text-brand-orange animate-spin mx-auto mb-4" />
            <p className="font-space font-black text-sm text-brand-forestDark uppercase tracking-wider">Loading your ticket...</p>
          </div>
        )}

        {status === 'none' && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-forestDark text-brand-sand rounded-full border-4 border-white mb-6">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black font-syne text-brand-forestDark uppercase tracking-tight mb-3">No Ticket Yet</h3>
            <p className="text-brand-dark/70 font-medium mb-6 leading-relaxed text-sm max-w-xs mx-auto">
              No booking yet — your ticket will appear here once you book and your trip is confirmed.
            </p>
            <button
              onClick={() => setCurrentPage && setCurrentPage('kherjat')}
              className="bg-brand-orange hover:bg-brand-orangeDark text-white px-8 py-3.5 font-space font-black border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-widest text-sm rounded cursor-pointer"
            >
              Browse Trips
            </button>
          </div>
        )}

        {status === 'notConfirmed' && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-full border-4 border-amber-200 mb-6">
              <X className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black font-syne text-amber-700 uppercase tracking-tight mb-3">Not Confirmed</h3>
            <p className="text-brand-dark/70 font-medium mb-6 leading-relaxed text-sm max-w-xs mx-auto">
              Your trip is not confirmed yet. Our team will confirm it shortly.
            </p>
            <button
              onClick={handleBack}
              className="bg-brand-orange hover:bg-brand-orangeDark text-white px-8 py-3.5 font-space font-black border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-widest text-sm rounded cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full border-4 border-red-200 mb-6">
              <X className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black font-syne text-red-700 uppercase tracking-tight mb-3">Something Went Wrong</h3>
            <p className="text-brand-dark/70 font-medium mb-6 leading-relaxed text-sm max-w-xs mx-auto">
              We could not load your ticket. Please try again later.
            </p>
            <button
              onClick={handleBack}
              className="bg-brand-orange hover:bg-brand-orangeDark text-white px-8 py-3.5 font-space font-black border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-widest text-sm rounded cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        )}

        {status === 'found' && ticket && (
          <div className="bg-brand-sand border-4 border-brand-forestDark rounded shadow-[8px_8px_0px_0px_rgba(22,44,28,1)] overflow-hidden">
            {/* Selfie */}
            <div className="relative bg-brand-forestDark">
              {ticket.selfie_url ? (
                <img src={ticket.selfie_url} alt={ticket.name || 'Explorer'} className="w-full aspect-square object-cover" />
              ) : (
                <div className="w-full aspect-square flex flex-col items-center justify-center gap-3 text-brand-sand/70">
                  <Camera className="w-16 h-16" />
                  <span className="font-space font-black text-xs uppercase tracking-wider">No Photo</span>
                </div>
              )}
              <span className="absolute top-3 left-3 bg-brand-orange text-white text-[9px] font-space font-black px-2.5 py-1 rounded uppercase tracking-wider">
                EXPEDITION TICKET
              </span>
              <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[9px] font-space font-black px-2.5 py-1 rounded uppercase tracking-wider flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" /> CONFIRMED
              </span>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-brand-forestDark/10 pb-3">
                <span className="font-space font-bold text-brand-forestDark/65 uppercase text-[10px] tracking-widest flex items-center">
                  <User className="w-3.5 h-3.5 mr-1 text-brand-orange" />
                  Name
                </span>
                <span className="font-work font-bold text-brand-forestDark">{ticket.name || '—'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-brand-forestDark/10 pb-3">
                <span className="font-space font-bold text-brand-forestDark/65 uppercase text-[10px] tracking-widest flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1 text-brand-orange" />
                  Phone
                </span>
                <span className="font-work font-bold text-brand-forestDark">{ticket.phone || '—'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-brand-forestDark/10 pb-3">
                <span className="font-space font-bold text-brand-forestDark/65 uppercase text-[10px] tracking-widest flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-brand-orange" />
                  Expedition
                </span>
                <span className="font-work font-black text-brand-forestDark text-right">{ticket.expedition_title || 'General Inquiry'}</span>
              </div>
              {ticket.created_at && (
                <div className="flex justify-between items-center text-sm border-b border-brand-forestDark/10 pb-3">
                  <span className="font-space font-bold text-brand-forestDark/65 uppercase text-[10px] tracking-widest flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 mr-1 text-brand-orange" />
                    Reserved
                  </span>
                  <span className="font-work font-bold text-brand-forestDark">
                    {new Date(ticket.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
              <p className="text-[11px] font-space font-bold text-brand-dark/50 text-center pt-1">
                Show this screen to your trip organizer at departure.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
