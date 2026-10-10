import React from 'react';

export default function Navbar2({ currentPage, setCurrentPage, currentUser, onLogout }) {
  const adminLinks = [
    { name: 'Overview', icon: 'dashboard', page: 'admin-dashboard' },
    { name: 'Trips', icon: 'explore', page: 'admin-trips' },
    { name: 'Registrations', icon: 'assignment_ind', page: 'admin-registrations' },
    { name: 'Store Products', icon: 'inventory_2', page: 'admin-store-products' },
    { name: 'Store Orders', icon: 'assignment', page: 'admin-store-orders' },
    { name: 'Site Images', icon: 'image', page: 'admin-site-images' }
  ];

  return (
    <>
      {/* SideNavBar - Desktop */}
      <aside className="hidden md:flex flex-col h-screen sticky top-0 bg-white h-full w-64 border-r-2 border-primary shadow-[4px_4px_0px_0px_rgba(44,66,49,0.2)] z-50 shrink-0">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <img src="/projet-nature.webp" alt="Project Nature logo" className="w-10 h-10 object-contain" />
            <h1 className="font-headline-lg text-2xl font-bold text-primary">Project Nature</h1>
          </div>
          <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">Adventure Admin</p>
        </div>

        {/* Quick Action - Back to Client View */}
        <div className="px-4 pb-4">
          <button
            onClick={() => setCurrentPage('landing')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-primary border-2 border-primary rounded-xl font-space font-black text-xs uppercase tracking-wider transition-all cursor-pointer hard-shadow hover:translate-x-0.5 active:translate-y-0.5"
            title="Return to client website"
          >
            <span className="material-symbols-outlined text-base">storefront</span>
            <span>Back to Client View</span>
          </button>
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
        <div className="p-4 mt-auto border-t-2 border-primary/10 space-y-3">
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
      <header className="md:hidden flex justify-between items-center px-4 w-full sticky top-0 z-40 bg-white h-16 border-b-2 border-primary">
        <span className="flex items-center gap-2 font-bold text-lg text-primary font-syne uppercase">
          <img src="/projet-nature.webp" alt="Project Nature logo" className="w-7 h-7 object-contain" />
          Project Nature
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage('landing')} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-primary border-2 border-primary rounded-lg font-space font-black text-[11px] uppercase tracking-wider cursor-pointer hard-shadow active:translate-y-0.5"
            title="Back to client view"
          >
            <span className="material-symbols-outlined text-sm">storefront</span>
            Client View
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
