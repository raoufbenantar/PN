import React from 'react';
import { ArrowRight, Mountain } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-[70vh] md:h-screen min-h-[500px] md:min-h-screen pt-16 md:pt-24 flex items-center justify-center overflow-hidden">
      
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Algerian Desert Sunset" 
          className="w-full h-full object-cover object-center scale-105" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_3UMZoA6EZgR-Y3jnJbBBL2Sg5Miyl4gD6C77cLdpBu40XMFJYIv533XhOX85AEEUDgxoTKbsFSXO4YpdLJlITGiExFfw1s-YJmK7xH6O6GhWVB0pVlL3FME7tM-WYc3KbJagxnC2La18ctFOkUD94o0zti2CBOqoRo47wSxQoOTXnPbidrGuhG5d58OAZvrNlDk3lNS8MHI_1wMlBxLZWOljOL2eXS-BOuTyqbqY0ELYSaanvHTDIlRGhPqJ-EUUvrF6MqcgFJk"
        />
        {/* Organic dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-brand-forestDark/80"></div>
      </div>

      {/* Decorative Organic Elements - Topographical Lines SVG overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-10 mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full">
          <path fill="#F4E7D3" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,213.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center px-6 py-8 md:py-16 flex flex-col items-center">
        
        {/* Micro-badge */}
        <div className="hidden md:inline-flex items-center space-x-2 bg-brand-orange text-white px-4 py-1.5 rounded-full border border-brand-sand/30 mb-6 font-space text-xs font-bold tracking-widest uppercase animate-pulse">
          <Mountain className="w-3.5 h-3.5 text-brand-sand animate-bounce" />
          <span>Algeria like you've never seen it before</span>
        </div>

        {/* Brand Name with shadow-glow */}
        <h1 className="text-4xl md:text-8xl font-black text-brand-sand font-syne uppercase tracking-tighter mb-4 md:mb-6 hero-glow leading-none select-none">
          Project Nature
        </h1>

        {/* Tagline Description Box */}
        <div className="max-w-md md:max-w-2xl bg-white/10 md:bg-brand-dark/45 backdrop-blur-sm md:backdrop-blur-md p-4 md:p-6 rounded-lg border border-white/20 md:border-2 md:border-brand-sand/20 shadow-none md:shadow-brutalist-orange mb-6 md:mb-8 transform hover:scale-[1.01] transition-transform">
          <p className="text-brand-sand text-xs md:text-lg font-medium leading-relaxed">
            Explore the wildest corners of Algeria with a community of outdoor enthusiasts. From the snow-capped Atlas peaks to the golden dunes of the deep Sahara. We redefine sustainable adventure.
          </p>
        </div>

        {/* Famous Catchphrase */}
        <div className="mb-8 md:mb-12 relative group">
          <span className="absolute -inset-1 rounded bg-brand-orange/20 blur opacity-75 group-hover:opacity-100 transition-opacity"></span>
          <h2 className="relative text-3xl md:text-7xl font-extrabold text-yellow-400 font-syne italic drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] tracking-tight">
            dji wla ndjibouk !
          </h2>
        </div>

        {/* CTA Button */}
        <a 
          href="#expeditions" 
          className="group relative bg-brand-orange text-white px-6 py-3.5 md:px-10 md:py-5 text-sm md:text-xl font-space font-black rounded border-2 border-brand-dark shadow-[4px_4px_0px_0px_rgba(22,44,28,1)] md:shadow-[6px_6px_0px_0px_rgba(22,44,28,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all inline-flex items-center space-x-2 md:space-x-3"
        >
          <span>START THE ADVENTURE</span>
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform duration-300" />
        </a>
      </div>
      
      {/* Decorative Bottom Jagged Divider */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div className="zigzag-border w-full"></div>
      </div>
    </section>
  );
}
