import React from 'react';
import Navbar2 from './Navbar2';

export default function AdminTrips({
  currentPage,
  setCurrentPage,
  currentUser,
  onLogout,
  trips,
  onMarkCompleted,
  onDeleteTrip
}) {
  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Navbar2
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto mb-20 md:mb-0">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-primary text-left">
            <div>
              <h2 className="font-syne text-3xl font-black text-primary uppercase">Manage Expeditions</h2>
              <p className="font-work text-sm text-on-surface-variant font-medium mt-1">Manage upcoming trips, monitor capacity, and curate the wilderness experience.</p>
            </div>
            <button 
              onClick={() => setCurrentPage('admin-add-trip')}
              className="bg-secondary text-white font-space font-black text-xs uppercase tracking-widest px-5 py-3 border-2 border-primary shadow-[4px_4px_0px_#162c1c] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all flex items-center shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2">add</span>
              New Expedition
            </button>
          </div>

          {/* Trips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {trips.map((trip) => (
              <article 
                key={trip.id} 
                className="bg-white border-2 border-primary shadow-[6px_6px_0px_#162c1c] flex flex-col relative transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_#162c1c] transition-all duration-300 rounded"
              >
                <div className="h-64 border-b-2 border-primary relative overflow-hidden bg-primary-container p-2 pb-6">
                  <img 
                    className="w-full h-full object-cover border-2 border-primary shadow-[2px_2px_0px_#162c1c] rounded" 
                    alt={trip.title} 
                    src={trip.image}
                  />
                  <div className="absolute top-4 right-4 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 font-space font-bold text-[11px] border-2 border-primary shadow-[2px_2px_0px_#162c1c] rotate-2">
                    {trip.duration}
                  </div>
                  {trip.type && (
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 font-space font-bold text-[10px] border border-brand-sand rounded uppercase tracking-wider">
                      {trip.type}
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-grow flex flex-col bg-white z-10">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-syne font-black text-xl text-primary uppercase leading-tight line-clamp-1">{trip.title}</h3>
                    <div className={`px-2.5 py-1 font-space font-bold text-[10px] rounded-DEFAULT border ${
                      trip.completed 
                        ? 'bg-amber-100 text-amber-800 border-amber-300' 
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {trip.completed ? 'FULLY BOOKED' : `${trip.capacity || '0/20'} Seats`}
                    </div>
                  </div>
                  
                  <div className="font-space font-bold text-xs text-on-surface-variant mb-4 flex items-center">
                    <span className="material-symbols-outlined mr-2 text-[18px]">calendar_today</span>
                    {trip.dates || 'TBD'}
                  </div>

                  <p className="font-work text-sm text-on-surface-variant mb-6 line-clamp-2">{trip.description}</p>

                  <div className="mt-auto flex gap-4 pt-4 border-t border-primary/10">
                    <button 
                      disabled={trip.completed}
                      onClick={() => onMarkCompleted(trip.id)}
                      className={`flex-grow border-2 px-4 py-2 font-space font-black text-[10px] uppercase tracking-wider flex items-center justify-center transition-colors cursor-pointer focus:outline-none ${
                        trip.completed 
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-slate-50 border-primary text-primary hover:bg-primary hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined mr-1.5 text-[16px]">check_circle</span>
                      {trip.completed ? 'Fully Booked' : 'Mark Completed'}
                    </button>
                    <button 
                      onClick={() => onDeleteTrip(trip.id)}
                      className="px-4 py-2 text-error border-2 border-transparent hover:border-error hover:bg-red-55/20 transition-colors font-space font-black text-[10px] uppercase tracking-wider flex items-center justify-center cursor-pointer focus:outline-none"
                    >
                      <span className="material-symbols-outlined mr-1.5 text-[16px]">delete</span>
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {trips.length === 0 && (
              <div className="col-span-2 p-12 text-center bg-white border-2 border-primary border-dashed rounded-xl text-on-surface-variant font-medium">
                No excursions configured. Create one to begin.
              </div>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
