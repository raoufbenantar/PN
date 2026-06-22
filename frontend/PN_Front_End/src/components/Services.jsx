import React from 'react';
import { Compass, Tent, Trees } from 'lucide-react';

export default function Services() {
  return (
    <section id="services" className="py-12 md:py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* Left Side: Organic Polaroid Showcase with Angled Cards */}
        <div className="relative group mb-4 lg:mb-0">
          {/* Decorative Backing Frame */}
          <div className="absolute -inset-2 bg-brand-orange/15 rounded-lg transform rotate-2 blur-md group-hover:rotate-0 transition-transform duration-500"></div>
          
          <div className="relative bg-brand-forestDark w-full aspect-video rounded border-4 border-brand-forestDark shadow-2xl angled-card overflow-hidden">
            <img 
              alt="Hiker in Algerian mountains" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7nxhAOiHeW2WXuHwO-24jmqtrNfxy22xwA94dzOhyl6O90l-SJ9rWm0tuOL7PjisPnEkk3XkYo6Rvwme4lQ2FP34uPgg6LmT67I0t-FD8yAb80eV6IzF43JHRiCB_fHfqaqJB123Na0yF8dbyrEq7dPEQNJVjDB3Tv_TqFpnUNTGqC-WUwkjEpbF8tsNgHP423KwsNV5Nv_5N7145URzeUREA6Ym--teRKPsA-CWQ-_id3wzJprUzrGeOhxaJeFlHpiiL_vYZH08"
            />
            
            {/* Overlay description badge */}
            <div className="absolute bottom-0 left-0 right-0 lg:bottom-6 lg:right-6 lg:left-auto bg-brand-forestDark/90 lg:bg-brand-forestDark p-4 lg:p-6 text-white lg:max-w-xs shadow-none lg:shadow-brutalist-orange border-t-2 lg:border-2 border-brand-sand transform-none lg:rotate-1">
              <div className="flex items-center space-x-2 mb-1 lg:mb-2">
                <Trees className="w-5 h-5 text-brand-orange" />
                <h3 className="text-lg lg:text-2xl font-bold font-syne uppercase">Hikes</h3>
              </div>
              <p className="text-xs lg:text-sm text-brand-sand/90 font-medium">
                Secret trails through the green Tell mountains, rocky canyons, and alpine forests of Kabylie.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Services Content List */}
        <div className="space-y-8 lg:space-y-10">
          <div className="text-center lg:text-left block">
            <span className="bg-brand-sand text-brand-orangeDark font-space text-xs font-black tracking-widest px-3 py-1 rounded border border-brand-orangeDark/20 uppercase">
              What We Do
            </span>
            <h2 className="text-3xl lg:text-5xl font-black text-brand-forestDark font-syne uppercase tracking-tight mt-3">
              Our Services
            </h2>
          </div>
          
          <div className="space-y-6">
            {/* Service item: Camps */}
            <div className="group flex items-start space-x-4 lg:space-x-6 p-4 lg:p-6 bg-white border-2 border-brand-forestDark/25 rounded shadow-brutalist-forest hover:shadow-brutalist-orange hover:bg-brand-sand/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded bg-brand-orange/10 border-2 border-brand-orange text-brand-orange shrink-0">
                <Tent className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div>
                <h4 className="text-lg lg:text-2xl font-bold text-brand-forestDark font-syne">Camps</h4>
                <p className="text-xs lg:text-sm text-brand-dark/70 mt-1 lg:mt-2 font-medium">
                  Experience unforgettable starry nights in the middle of nowhere. Professional gear provided, traditional campfire meals, and absolute safety.
                </p>
              </div>
            </div>

            {/* Service item: Expeditions */}
            <div className="group flex items-start space-x-4 lg:space-x-6 p-4 lg:p-6 bg-white border-2 border-brand-forestDark/25 rounded shadow-brutalist-forest hover:shadow-brutalist-orange hover:bg-brand-sand/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded bg-brand-forest/10 border-2 border-brand-forestDark text-brand-forestDark shrink-0">
                <Compass className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div>
                <h4 className="text-lg lg:text-2xl font-bold text-brand-forestDark font-syne">Expeditions</h4>
                <p className="text-xs lg:text-sm text-brand-dark/70 mt-1 lg:mt-2 font-medium">
                  Intense multi-day treks for the brave. Push your limits alongside certified guides and passionate hikers.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
