import React from 'react';
import Navbar2 from './Navbar2';

export default function AdminDashboard({ 
  currentPage, 
  setCurrentPage, 
  currentUser, 
  onLogout,
  trips,
  registrations
}) {
  const activeTripsCount = trips.filter(t => !t.completed).length;
  const totalRegistrations = registrations.length;
  const pendingRequestsCount = registrations.filter(r => r.status === 'PENDING').length;

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
      <main className="flex-1 p-6 md:p-12 overflow-y-auto mb-20 md:mb-0">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Header section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-primary/20 pb-6">
            <div className="space-y-2 text-left">
              <span className="font-space font-black text-xs text-secondary uppercase tracking-widest block">Dashboard</span>
              <h2 className="font-syne text-3xl font-black text-primary leading-tight">Welcome back, Admin.</h2>
              <p className="font-work text-sm text-on-surface-variant font-medium">The wild is calling. Here is the current pulse of your expeditions.</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border-2 border-primary hard-shadow text-left">
              <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-xl border-2 border-primary">
                {currentUser?.name ? currentUser.name.split(' ').map(w => w[0]).join('') : 'AD'}
              </div>
              <div>
                <p className="font-syne font-bold text-base text-primary leading-none">{currentUser?.name || 'Admin User'}</p>
                <p className="font-space text-[10px] text-on-surface-variant font-bold mt-1 uppercase tracking-wider">Adventure Lead</p>
              </div>
            </div>
          </header>

          {/* Overview Stats Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Trips Card */}
            <div className="bg-primary p-6 rounded-xl hard-shadow text-white text-left group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-4xl text-secondary-container">map</span>
                <span className="font-space font-black text-[10px] px-2.5 py-1 bg-primary-container text-on-primary-container rounded-full tracking-wider">LIVE</span>
              </div>
              <h3 className="font-syne font-black text-5xl leading-none mb-1">{activeTripsCount}</h3>
              <p className="font-space font-bold text-xs uppercase tracking-wide opacity-80">Active Trips</p>
            </div>

            {/* Total Registrations Card */}
            <div className="bg-tertiary-fixed p-6 rounded-xl border-2 border-primary hard-shadow text-left group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_ind</span>
              </div>
              <h3 className="font-syne font-black text-5xl leading-none mb-1 text-primary">{totalRegistrations}</h3>
              <p className="font-space font-bold text-xs uppercase tracking-wide text-on-surface-variant">Total Registrations</p>
            </div>

            {/* Pending Requests Card */}
            <div className="bg-secondary-container p-6 rounded-xl border-2 border-primary hard-shadow text-left group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-4xl text-on-secondary-container">pending_actions</span>
                {pendingRequestsCount > 0 && (
                  <span className="bg-on-secondary-container text-white text-[10px] px-2.5 py-1 rounded font-bold tracking-wider animate-pulse">URGENT</span>
                )}
              </div>
              <h3 className="font-syne font-black text-5xl leading-none mb-1 text-on-secondary-container">
                {pendingRequestsCount < 10 ? `0${pendingRequestsCount}` : pendingRequestsCount}
              </h3>
              <p className="font-space font-bold text-xs uppercase tracking-wide text-on-secondary-container">Pending Requests</p>
            </div>
          </section>

          {/* Main Layout Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Sign-ups (2/3 Column) */}
            <div className="lg:col-span-2 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-syne font-black text-xl text-primary uppercase">Recent Sign-ups</h3>
                <button 
                  onClick={() => setCurrentPage('admin-registrations')}
                  className="text-secondary font-space font-black text-xs tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
                >
                  VIEW ALL <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              <div className="overflow-x-auto border-2 border-primary rounded-xl hard-shadow bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-primary text-white border-b-2 border-primary">
                      <th className="px-5 py-3.5 font-space font-black text-[10px] uppercase tracking-widest">Explorer</th>
                      <th className="px-5 py-3.5 font-space font-black text-[10px] uppercase tracking-widest">Expedition</th>
                      <th className="px-5 py-3.5 font-space font-black text-[10px] uppercase tracking-widest">Date</th>
                      <th className="px-5 py-3.5 font-space font-black text-[10px] uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/10">
                    {registrations.slice(0, 5).map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-secondary-fixed flex items-center justify-center font-bold text-on-secondary-container text-xs">
                              {reg.name.split(' ').map(w => w[0]).join('')}
                            </div>
                            <span className="font-syne font-bold text-sm text-primary">{reg.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-work text-sm text-on-surface-variant font-medium">{reg.tripTitle}</td>
                        <td className="px-5 py-4 font-work text-sm text-on-surface-variant font-medium">{reg.date}</td>
                        <td className="px-5 py-4 text-right">
                          <span className={`font-space font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            reg.status === 'CONFIRMED' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {registrations.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-5 py-8 text-center text-on-surface-variant font-medium">
                          No registrations recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Current Expeditions (1/3 Column) */}
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-syne font-black text-xl text-primary uppercase">Active Expeditions</h3>
                <span className="material-symbols-outlined text-primary">filter_list</span>
              </div>
              
              <div className="space-y-4">
                {trips.filter(t => !t.completed).slice(0, 2).map((trip) => {
                  // Calculate progress percentage
                  const bookedCount = parseInt(trip.capacity?.split('/')[0]) || 0;
                  const maxCount = parseInt(trip.capacity?.split('/')[1]) || 20;
                  const progressPct = Math.min(100, Math.round((bookedCount / maxCount) * 100));

                  return (
                    <div 
                      key={trip.id} 
                      className="group relative bg-white border-2 border-primary rounded-xl overflow-hidden hard-shadow hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="h-28 w-full overflow-hidden relative">
                        <img 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={trip.title} 
                          src={trip.image}
                        />
                        <div className="absolute top-2 left-2 px-2.5 py-0.5 bg-secondary text-white font-space font-bold text-[9px] rounded uppercase tracking-wider">
                          IN PROGRESS
                        </div>
                      </div>
                      
                      <div className="p-4 bg-tertiary-fixed/40">
                        <h4 className="font-syne font-bold text-sm text-primary mb-1 line-clamp-1">{trip.title}</h4>
                        <div className="flex items-center gap-1.5 text-on-surface-variant mb-3">
                          <span className="material-symbols-outlined text-xs">group</span>
                          <span className="font-space text-[10px] font-bold">{trip.capacity || '18 / 20'} Explorers</span>
                        </div>
                        
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full transition-all duration-500" 
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {trips.filter(t => !t.completed).length === 0 && (
                  <div className="p-8 text-center bg-white border-2 border-primary border-dashed rounded-xl text-on-surface-variant">
                    No active expeditions.
                  </div>
                )}

                <button 
                  onClick={() => setCurrentPage('admin-trips')}
                  className="w-full py-2.5 border-2 border-primary text-primary font-space font-black text-xs uppercase tracking-widest rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer"
                >
                  Manage Expeditions
                </button>
              </div>
            </div>

          </div>

          {/* Footer Branding */}
          <div className="pt-12 text-center opacity-40 pb-16">
            <span className="material-symbols-outlined text-4xl text-primary">eco</span>
            <p className="font-space text-[9px] font-bold mt-2 uppercase tracking-[0.5em]">Project Nature • Dashboard System v2.4</p>
          </div>

        </div>
      </main>
    </div>
  );
}
