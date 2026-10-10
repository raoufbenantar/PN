import React, { useState } from 'react';
import Navbar2 from './Navbar2';

export default function AdminRegistrations({
  currentPage,
  setCurrentPage,
  currentUser,
  onLogout,
  registrations,
  onConfirmRegistration,
  onSuspendRegistration
}) {
  const [selectedSelfie, setSelectedSelfie] = useState(null);
  const pendingCount = registrations.filter(r => r.status === 'PENDING').length;
  const confirmedCount = registrations.filter(r => r.status === 'CONFIRMED').length;

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Navbar2
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto mb-20 md:mb-0">
        
        {/* Top App Bar */}
        <header className="hidden md:flex w-full h-16 bg-white border-b-2 border-primary justify-between items-center px-6 md:px-12 sticky top-0 z-40">
          <div className="text-left">
            <h2 className="font-syne font-bold text-lg text-primary uppercase">Pending Registrations</h2>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="relative hidden sm:block">
              <input
                className="bg-slate-100 border-2 border-primary rounded-lg py-1 px-4 pl-10 focus:ring-0 focus:border-secondary transition-all w-64 text-sm font-medium"
                placeholder="Search..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary text-base">search</span>
            </div>
            <button className="p-2 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-primary">notifications</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-12 max-w-6xl mx-auto w-full space-y-10 text-left">
          
          {/* Page Hero */}
          <div>
            <span className="font-space font-black text-xs text-secondary uppercase tracking-widest block mb-2">Participant Management</span>
            <h1 className="font-syne font-black text-3xl text-primary uppercase">Registrations</h1>
            <p className="font-work text-sm text-on-surface-variant max-w-2xl mt-1">
              Review and validate registration requests for upcoming expeditions. Make sure each adventurer is equipped and prepared before confirming.
            </p>
          </div>

          {/* Statistics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-amber-50 p-6 border-2 border-primary hard-shadow flex flex-col rounded-xl">
              <span className="font-space font-black text-[10px] text-primary opacity-60 uppercase mb-2">Total Pending</span>
              <span className="font-syne font-black text-4xl text-primary leading-none">
                {pendingCount < 10 ? `0${pendingCount}` : pendingCount}
              </span>
            </div>
            <div className="bg-primary p-6 border-2 border-primary hard-shadow flex flex-col text-white rounded-xl">
              <span className="font-space font-black text-[10px] opacity-80 uppercase mb-2">Confirmed</span>
              <span className="font-syne font-black text-4xl leading-none text-secondary-container">
                {confirmedCount < 10 ? `0${confirmedCount}` : confirmedCount}
              </span>
            </div>
            <div className="bg-white p-6 border-2 border-primary hard-shadow flex flex-col rounded-xl">
              <span className="font-space font-black text-[10px] text-secondary uppercase mb-2">Last Updated</span>
              <span className="font-syne font-bold text-base text-primary mt-auto">Just now</span>
            </div>
          </div>

          {/* Main Data Table Container */}
          <div className="bg-white border-2 border-primary hard-shadow overflow-hidden rounded-xl">
            {/* Table Header Controls */}
            <div className="p-5 border-b-2 border-primary bg-amber-50/20 flex justify-between items-center">
              <div className="flex gap-4">
                <button className="font-space font-black text-xs border-b-2 border-secondary text-primary px-2 py-1">ALL REQUESTS</button>
              </div>
              <button className="flex items-center gap-2 font-space font-black text-[11px] text-primary hover:underline">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                FILTER BY DATE
              </button>
            </div>

            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-amber-50/50 border-b-2 border-primary text-primary">
                    <th className="p-5 font-space font-black text-[10px] uppercase tracking-widest">Participant</th>
                    <th className="p-5 font-space font-black text-[10px] uppercase tracking-widest">Selfie</th>
                    <th className="p-5 font-space font-black text-[10px] uppercase tracking-widest">Expedition</th>
                    <th className="p-5 font-space font-black text-[10px] uppercase tracking-widest">Contact Phone</th>
                    <th className="p-5 font-space font-black text-[10px] uppercase tracking-widest">Request Date</th>
                    <th className="p-5 font-space font-black text-[10px] uppercase tracking-widest">Status</th>
                    <th className="p-5 font-space font-black text-[10px] uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded bg-primary text-white flex items-center justify-center font-bold text-xs">
                            {reg.name.split(' ').map(w => w[0]).join('')}
                          </div>
                          <div>
                            <p className="font-syne font-bold text-sm text-primary leading-tight">{reg.name}</p>
                            <p className="font-space text-[10px] text-on-surface-variant mt-0.5">Level: {reg.level || 'Intermediate'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        {reg.selfieUrl ? (
                          <button
                            type="button"
                            onClick={() => setSelectedSelfie(reg)}
                            className="relative group/selfie block rounded-lg overflow-hidden border-2 border-primary cursor-pointer hover:shadow-md transition-all focus:outline-none"
                            title="Click to view full selfie"
                          >
                            <img
                              src={reg.selfieUrl}
                              alt={reg.name}
                              className="w-12 h-12 rounded object-cover group-hover/selfie:scale-110 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover/selfie:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="material-symbols-outlined text-white text-base">zoom_in</span>
                            </div>
                          </button>
                        ) : (
                          <div className="w-12 h-12 rounded bg-slate-100 border-2 border-primary/20 flex items-center justify-center text-primary/40">
                            <span className="material-symbols-outlined text-base">person</span>
                          </div>
                        )}
                      </td>
                      <td className="p-5">
                        <span className="font-syne font-bold text-sm text-primary block leading-tight">{reg.tripTitle}</span>
                        <span className="font-space text-[9px] text-secondary uppercase font-bold tracking-wider">{reg.tripSubtitle}</span>
                      </td>
                      <td className="p-5 font-space text-xs text-primary font-bold">
                        {reg.phone || 'N/A'}
                      </td>
                      <td className="p-5 text-on-surface-variant font-space text-[11px] font-bold">
                        {reg.date}
                      </td>
                      <td className="p-5">
                        <span className={`px-2.5 py-0.5 rounded-full font-space font-black text-[9px] uppercase tracking-wider ${
                          reg.status === 'CONFIRMED' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : reg.status === 'SUSPENDED'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onConfirmRegistration(reg.id)}
                            disabled={reg.status === 'CONFIRMED'}
                            className={`px-3 py-1.5 rounded font-space font-black text-[10px] uppercase tracking-wider transition-all focus:outline-none cursor-pointer ${
                              reg.status === 'CONFIRMED'
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                : 'bg-primary text-white hover:bg-primary/90'
                            }`}
                          >
                            CONFIRM
                          </button>
                          <button
                            onClick={() => onSuspendRegistration(reg.id)}
                            disabled={reg.status === 'SUSPENDED'}
                            className={`px-3 py-1.5 rounded font-space font-black text-[10px] uppercase tracking-wider transition-all focus:outline-none cursor-pointer border ${
                              reg.status === 'SUSPENDED'
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                                : 'border-red-600 text-red-650 hover:bg-red-50'
                            }`}
                          >
                            SUSPEND
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {registrations.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-10 text-center text-on-surface-variant font-medium">
                        No pending registrations.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* Selfie Preview Modal */}
      {selectedSelfie && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedSelfie(null)}
        >
          <div
            className="bg-white border-2 border-primary rounded-2xl max-w-lg w-full overflow-hidden hard-shadow relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-amber-50 border-b-2 border-primary flex justify-between items-center">
              <div>
                <h3 className="font-syne font-black text-lg text-primary">{selectedSelfie.name}</h3>
                <p className="font-space text-xs text-secondary uppercase font-bold">{selectedSelfie.tripTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSelfie(null)}
                className="w-8 h-8 rounded-full border border-primary flex items-center justify-center hover:bg-slate-200 text-primary transition-colors cursor-pointer"
                title="Close"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Selfie Image Display */}
            <div className="p-4 flex flex-col items-center justify-center bg-slate-900/5 min-h-[300px]">
              <img
                src={selectedSelfie.selfieUrl}
                alt={`Selfie of ${selectedSelfie.name}`}
                className="max-h-[65vh] w-auto max-w-full rounded-xl border-2 border-primary object-contain shadow-md"
              />
            </div>

            {/* Modal Footer with Details */}
            <div className="p-4 bg-white border-t-2 border-primary flex flex-wrap items-center justify-between gap-3 text-xs font-space">
              <div>
                <span className="text-on-surface-variant">Phone: </span>
                <span className="font-bold text-primary">{selectedSelfie.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-on-surface-variant">Status: </span>
                <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                  selectedSelfie.status === 'CONFIRMED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedSelfie.status === 'SUSPENDED'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedSelfie.status}
                </span>
              </div>
              <a
                href={selectedSelfie.selfieUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="ml-auto inline-flex items-center gap-1 text-primary hover:underline font-bold"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                Open full size
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
