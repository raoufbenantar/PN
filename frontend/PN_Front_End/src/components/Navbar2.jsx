import React from 'react';

export default function Navbar2({ currentPage, setCurrentPage, currentUser, onLogout }) {
  const adminLinks = [
    { name: 'Overview', icon: 'dashboard', page: 'admin-dashboard' },
    { name: 'Trips', icon: 'explore', page: 'admin-trips' },
    { name: 'Registrations', icon: 'assignment_ind', page: 'admin-registrations' }
  ];

  return (
    <>
      {/* SideNavBar - Desktop */}
      <aside className="hidden md:flex flex-col h-screen sticky top-0 bg-white h-full w-64 border-r-2 border-primary shadow-[4px_4px_0px_0px_rgba(44,66,49,0.2)] z-50 shrink-0">
        <div className="p-8">
          <h1 className="font-headline-lg text-2xl font-bold text-primary mb-1">Project Nature</h1>
          <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">Adventure Admin</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {adminLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => setCurrentPage(link.page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg duration-200 transition-all text-left focus:outline-none cursor-pointer ${
                  isActive
                    ? 'text-primary font-bold border-l-4 border-secondary bg-surface-container-high translate-x-1'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="font-title-md font-semibold text-base">{link.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Button & User Info */}
        <div className="p-4 mt-auto border-t-2 border-primary/10 space-y-4">
          <button
            onClick={() => setCurrentPage('admin-add-trip')}
            className={`w-full py-3 bg-secondary text-white font-bold rounded sturdy-border btn-shadow flex items-center justify-center gap-2 cursor-pointer focus:outline-none transition-all ${
              currentPage === 'admin-add-trip' ? 'bg-secondary/90' : ''
            }`}
          >
            <span className="material-symbols-outlined">add_circle</span>
            New Expedition
          </button>

          <div className="flex items-center justify-between pt-2 border-t border-primary/5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold font-space text-sm border-2 border-primary">
                {currentUser?.name ? currentUser.name.split(' ').map(w => w[0]).join('') : 'AD'}
              </div>
              <div className="text-left">
                <p className="font-bold text-xs text-primary leading-tight truncate max-w-[100px]">{currentUser?.name || 'Admin User'}</p>
                <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Admin</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer bg-transparent border-none p-1 focus:outline-none"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </aside>

      {/* Top Bar - Mobile Only */}
      <header className="md:hidden flex justify-between items-center px-6 w-full sticky top-0 z-40 bg-white h-16 border-b-2 border-primary">
        <span className="font-bold text-xl text-primary font-syne uppercase">Project Nature</span>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-primary">notifications</span>
          <button 
            onClick={() => setCurrentPage('landing')} 
            className="flex items-center text-primary"
            title="Go to landing page"
          >
            <span className="material-symbols-outlined">home</span>
          </button>
        </div>
      </header>

      {/* BottomNavBar - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-white border-t-2 border-primary shadow-[0px_-4px_10px_rgba(0,0,0,0.1)]">
        {adminLinks.map((link) => {
          const isActive = currentPage === link.page;
          return (
            <button
              key={link.page}
              onClick={() => setCurrentPage(link.page)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl scale-95 transition-transform duration-200 focus:outline-none cursor-pointer ${
                isActive
                  ? 'bg-secondary/15 text-secondary font-bold'
                  : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="text-[10px] font-semibold">{link.name}</span>
            </button>
          );
        })}
        <button
          onClick={() => setCurrentPage('admin-add-trip')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl scale-95 transition-transform duration-200 focus:outline-none cursor-pointer ${
            currentPage === 'admin-add-trip'
              ? 'bg-secondary/15 text-secondary font-bold'
              : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-[10px] font-semibold">New Trip</span>
        </button>
        <button
          onClick={onLogout}
          className="flex flex-col items-center justify-center p-2 rounded-xl scale-95 text-red-600 focus:outline-none cursor-pointer"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-[10px] font-semibold">Logout</span>
        </button>
      </nav>
    </>
  );
}
