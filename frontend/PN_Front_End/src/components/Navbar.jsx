import React, { useState } from 'react';
import { Menu, X, Compass, Home } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage, currentUser, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);

  const navLinks = [
    { name: 'Kherjat', href: '#expeditions' },
    { name: 'Souvenirs', href: '#souvenirs' },
    { name: 'About', href: '#about' }
  ];

  const handleNavClick = (e, link) => {
    if (e && e.preventDefault) e.preventDefault();
    if (link.name === 'Kherjat') {
      setCurrentPage('kherjat');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.name === 'Souvenirs') {
      setCurrentPage('souvenirs');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.name === 'About') {
      setCurrentPage('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* DESKTOP HEADER (Hidden on mobile) */}
      <header className="hidden md:block fixed top-0 left-0 w-full z-50 bg-brand-bg/90 backdrop-blur-md border-b-2 border-brand-forest/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Official Logo */}
          <button 
            onClick={() => {
              setCurrentPage('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-3 group text-left focus:outline-none bg-transparent border-none cursor-pointer" 
            data-purpose="logo"
          >
            <div className="relative flex items-center justify-center w-10 h-10 bg-brand-orange text-white rounded shadow-brutalist-forest border-2 border-brand-forestDark transform -rotate-3 group-hover:rotate-0 transition-transform">
              <span className="text-xl font-bold font-syne italic">△</span>
            </div>
            <span className="text-2xl font-extrabold font-syne tracking-tight text-brand-dark group-hover:text-brand-orange transition-colors">
              Project <span className="font-light italic text-brand-forest">Nature</span>
            </span>
          </button>

          {/* Desktop Navigation Links & Buttons */}
          <nav className="flex items-center space-x-8 text-sm font-space font-semibold tracking-wide">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={(e) => handleNavClick(e, link)}
                className={`text-brand-dark hover:text-brand-orange relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-orange hover:after:w-full after:transition-all after:duration-300 transition-colors focus:outline-none bg-transparent border-none cursor-pointer ${
                  (link.name === 'Kherjat' && (currentPage === 'kherjat' || currentPage === 'details')) || 
                  (link.name === 'Souvenirs' && currentPage === 'souvenirs') ||
                  (link.name === 'About' && currentPage === 'about')
                    ? 'text-brand-orange border-b-2 border-brand-orange pb-0.5' 
                    : ''
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Desktop Buttons */}
          {currentUser ? (
            <div className="flex items-center space-x-3">
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setCurrentPage('admin-dashboard')}
                  className="px-4 py-2 bg-brand-forest hover:bg-brand-forestDark text-white font-space font-black text-xs uppercase tracking-wider border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded cursor-pointer"
                >
                  Admin Panel
                </button>
              )}
              <div className="bg-brand-sand/30 border-2 border-brand-forestDark px-4 py-2 shadow-brutalist-dark rounded">
                <span className="font-space font-black text-sm text-brand-forestDark uppercase tracking-tight flex items-center gap-1.5 animate-fade-in">
                  <span className="inline-block w-2.5 h-2.5 bg-brand-orange rounded-full animate-pulse"></span>
                  {currentUser.name}
                </span>
              </div>
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                }}
                className="px-4 py-2 bg-white hover:bg-brand-orange text-brand-orange hover:text-white font-space font-black text-xs uppercase tracking-wider border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentPage('login')}
                className="px-5 py-2.5 font-space font-bold text-sm text-brand-forestDark hover:text-brand-orange transition-colors bg-transparent border-none cursor-pointer focus:outline-none"
              >
                Login
              </button>
              
              <button 
                onClick={() => setCurrentPage('register')}
                className="inline-flex items-center space-x-2 bg-brand-orange text-white px-5 py-2.5 font-space font-bold text-sm border-2 border-brand-forestDark shadow-brutalist-dark hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded cursor-pointer focus:outline-none"
              >
                <span>Join Us</span>
                <Compass className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MOBILE HEADER (Sticky Top, visible only on mobile) */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <button 
          onClick={() => {
            setCurrentPage('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-1.5 focus:outline-none bg-transparent border-none cursor-pointer"
        >
          <span className="font-extrabold text-brand-orange text-xl tracking-tighter font-syne">Project Nature</span>
        </button>

        {currentUser ? (
          <div className="relative">
            <button 
              onClick={() => setShowMobileUserMenu(!showMobileUserMenu)}
              className="flex items-center gap-2 bg-brand-sand/30 border border-brand-forest/20 rounded-full py-1.5 px-3 focus:outline-none cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-xs">
                {currentUser.name ? currentUser.name.split(' ').map(w => w[0]).join('') : 'U'}
              </div>
              <span className="font-space text-xs font-bold text-brand-forestDark max-w-[80px] truncate">{currentUser.name}</span>
            </button>

            {showMobileUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-brand-forestDark rounded-lg shadow-xl py-2 z-50 text-left animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-bold text-xs text-brand-dark truncate">{currentUser.name}</p>
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">{currentUser.role || 'Explorer'}</p>
                </div>
                {currentUser.role === 'admin' && (
                  <button 
                    onClick={() => {
                      setShowMobileUserMenu(false);
                      setCurrentPage('admin-dashboard');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-space font-bold hover:bg-brand-sand/20 text-brand-forest"
                  >
                    Admin Panel
                  </button>
                )}
                <button 
                  onClick={() => {
                    setShowMobileUserMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-space font-bold text-red-650 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => setCurrentPage('register')}
            className="bg-brand-orange text-white px-4 py-2 rounded-lg font-bold text-xs font-space tracking-tight shadow-sm cursor-pointer"
          >
            Join Us
          </button>
        )}
      </header>

      {/* MOBILE BOTTOM NAVIGATION (Fixed Bottom, visible only on mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-[60] shadow-lg">
        <button 
          onClick={() => {
            setCurrentPage('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 focus:outline-none bg-transparent border-none cursor-pointer ${
            currentPage === 'landing' ? 'text-brand-orange' : 'text-gray-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold font-space">Home</span>
        </button>

        <button 
          onClick={() => {
            setCurrentPage('kherjat');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 focus:outline-none bg-transparent border-none cursor-pointer ${
            currentPage === 'kherjat' || currentPage === 'details' ? 'text-brand-orange' : 'text-gray-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[9px] font-bold font-space">Kherjat</span>
        </button>

        <button 
          onClick={() => {
            setCurrentPage('souvenirs');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 focus:outline-none bg-transparent border-none cursor-pointer ${
            currentPage === 'souvenirs' ? 'text-brand-orange' : 'text-gray-400'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <span className="text-[9px] font-bold font-space">Souvenirs</span>
        </button>

        <button 
          onClick={() => {
            setCurrentPage('about');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 focus:outline-none bg-transparent border-none cursor-pointer ${
            currentPage === 'about' ? 'text-brand-orange' : 'text-gray-400'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <span className="text-[9px] font-bold font-space">About</span>
        </button>
      </nav>
    </>
  );
}
