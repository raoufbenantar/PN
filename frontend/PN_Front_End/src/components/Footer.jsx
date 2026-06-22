import React from 'react';
import { Shield, MapPin, Camera } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-forestDark text-white py-20 px-6 border-t-4 border-brand-forestDark">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          
          {/* Brand/Logo Info Column */}
          <div>
            <div className="flex items-center space-x-3 mb-8" data-purpose="footer-logo">
              <div className="relative flex items-center justify-center w-10 h-10 bg-brand-orange text-white rounded border-2 border-white shadow-[2px_2px_0px_rgba(255,255,255,1)] transform -rotate-3">
                <span className="text-xl font-bold font-syne italic">△</span>
              </div>
              <span className="text-2xl font-black font-syne tracking-tight text-brand-sand">
                Project <span className="font-light italic text-white/70">Nature</span>
              </span>
            </div>
            <p className="text-brand-sand/70 max-w-xs leading-relaxed font-medium text-sm">
              The first sustainable adventure platform in Algeria. We explore, we preserve, we share with passion and rigor.
            </p>
          </div>

          {/* Column 2: Social Links */}
          <div>
            <h4 className="text-xl font-black font-syne uppercase tracking-wider text-brand-orange mb-8">
              Community
            </h4>
            <ul className="space-y-4 font-space font-semibold text-sm">
              <li>
                <a href="#" className="hover:text-brand-orange transition-colors flex items-center space-x-2.5 text-brand-sand/80 hover:text-white">
                  <svg className="w-4 h-4 text-brand-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-orange transition-colors flex items-center space-x-2.5 text-brand-sand/80 hover:text-white">
                  <svg className="w-4 h-4 text-brand-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-orange transition-colors flex items-center space-x-2.5 text-brand-sand/80 hover:text-white">
                  <svg className="w-4 h-4 text-brand-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                  <span>YouTube</span>
                </a>
              </li>
            </ul>
          </div>


          {/* Column 3: Legal Links */}
          <div>
            <h4 className="text-xl font-black font-syne uppercase tracking-wider text-brand-orange mb-8">
              Information
            </h4>
            <ul className="space-y-4 font-space font-semibold text-sm">
              <li>
                <a href="#" className="hover:text-brand-orange transition-colors text-brand-sand/80 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-orange transition-colors text-brand-sand/80 hover:text-white">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-orange transition-colors text-brand-sand/80 hover:text-white">
                  Explorer's Charter
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-brand-sand/15 flex flex-col md:flex-row justify-between items-center text-xs font-space font-semibold text-brand-sand/40">
          
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Project Nature. All rights reserved. <span className="text-brand-orange font-bold font-syne italic ml-1">dji wla ndjibouk !</span>
          </p>
          
          <div className="flex space-x-6 mt-6 md:mt-0">
            <span title="Authentic Photos" className="hover:text-brand-orange cursor-pointer transition-colors p-1 bg-white/5 rounded border border-white/5">
              <Camera className="w-4 h-4" />
            </span>
            <span title="Guaranteed Safety" className="hover:text-brand-orange cursor-pointer transition-colors p-1 bg-white/5 rounded border border-white/5">
              <Shield className="w-4 h-4" />
            </span>
            <span title="Marked Trails" className="hover:text-brand-orange cursor-pointer transition-colors p-1 bg-white/5 rounded border border-white/5">
              <MapPin className="w-4 h-4" />
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}
