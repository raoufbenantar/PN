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
              <div className="relative flex items-center justify-center w-12 h-12 transform -rotate-3">
                <img src="/projet-nature.webp" alt="Project Nature logo" className="w-12 h-12 object-contain drop-shadow-[2px_2px_0px_rgba(255,255,255,0.35)]" />
              </div>
              <span className="text-2xl font-black font-syne tracking-tight text-brand-sand">
                Project <span className="font-light italic text-white/70">Nature</span>
              </span>
            </div>
            <p className="text-brand-sand/70 max-w-xs leading-relaxed font-medium text-sm">
              The first sustainable adventure platform in Algeria. We explore, we preserve, we share with passion and rigor.
            </p>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h4 className="text-xl font-black font-syne uppercase tracking-wider text-brand-orange mb-8">
              Contact Us
            </h4>
            <ul className="space-y-4 font-space font-semibold text-sm">
              <li>
                <a href="https://www.instagram.com/project.naturedz/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors flex items-center space-x-2.5 text-brand-sand/80 hover:text-white">
                  <svg className="w-4 h-4 text-brand-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>Instagram</span>
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
