import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function AboutPage({ setCurrentPage }) {
  return (
    <div className="pt-20 bg-brand-bg min-h-screen font-work">
      
      {/* Hero Section */}
      <section className="relative px-6 md:px-24 py-12 md:py-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-black tracking-widest text-brand-orange uppercase mb-4 block font-space">
            The Wild Spirit
          </span>
          <h1 className="text-3xl md:text-7xl font-black font-syne text-brand-orange mb-6 md:mb-8 leading-none uppercase tracking-tight">
            Our Story
          </h1>
          <div className="space-y-6 text-brand-dark/70 text-sm md:text-lg leading-relaxed max-w-lg font-medium">
            <p>
              Project Nature is not just a travel agency. It is the result of a raw ambition: to reconnect the human soul with the untamed reliefs of Algeria. Founded in 2024, our adventure began with a simple promise: to transform every excursion into an epic chapter of your life.
            </p>
            <p>
              We believe in radical authenticity. No overly marked paths, no sterile comfort. We take you where the signal ends and the adventure truly begins.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex flex-wrap gap-4 mt-8 md:mt-12 font-space font-black uppercase text-xs tracking-wider">
            <div className="flex items-center gap-3 bg-[#FFE8CC] px-4 py-2.5 md:px-6 md:py-3 rounded border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)]">
              <span className="text-xl">🏔️</span>
              <span className="text-brand-forestDark">150+ Peaks</span>
            </div>
            <div className="flex items-center gap-3 bg-brand-sand px-4 py-2.5 md:px-6 md:py-3 rounded border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)]">
              <span className="text-xl">👥</span>
              <span className="text-brand-forestDark">5k Explorers</span>
            </div>
          </div>
        </div>

        {/* Hero Image Composition */}
        <div className="relative flex justify-center">
          {/* Dashed Border Container */}
          <div className="border-2 border-dashed border-brand-forestDark/30 p-4 rounded-[40px] transform rotate-3 bg-white shadow-lg">
            <div className="relative overflow-hidden rounded-[30px] transform -rotate-3 border-2 border-brand-forestDark">
              <img 
                alt="Mountain Landscape" 
                className="w-full h-auto grayscale object-cover max-w-md" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFab2nh9VRs0VbD0H1zwtFc6LRcgDIxHySdLTxN5UPMXmamTmISDYqew8iumyu7zbXYgydY9IOAUlMXwho1ofNRdaqZsL3IiBOYQ_KL2iZxDzPaP4aghhhXb9LXnlFAU1i6JBjykb_Pl0FF4iTdu0QhdH5nEFX0Z_TxdafA2Aw1kvTH7KLa68WAg2hJ4lq8OSG0DhFAseeUr1neL_eZ9x7O7w_kzB44XPkCRxIfSsLgD7mxTOtosZVI0lQi18sD7x6OXOEBWcl0ac"
              />
              {/* Established Badge */}
              <div className="absolute bottom-6 left-6 bg-brand-orange text-white px-4 py-1.5 text-xs font-space font-black -rotate-12 rounded border border-brand-forestDark shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                EST. 2024
              </div>
            </div>
          </div>
          {/* Decorative blur backdrop */}
          <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>

      {/* Values Section (Forest Green Block) */}
      <section className="bg-brand-forest py-16 md:py-24 px-6 md:px-24 border-y-4 border-brand-forestDark relative overflow-hidden">
        {/* Background Sketch Overlay */}
        <div className="absolute left-0 bottom-0 opacity-5 pointer-events-none select-none">
          <svg fill="currentColor" height="300" viewBox="0 0 100 100" width="300" className="text-white">
            <path d="M50 10 L85 70 L65 70 L80 90 L20 90 L35 70 L15 70 Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          
          {/* Value 1 */}
          <div className="bg-white/10 border-2 border-white/20 p-6 md:p-10 rounded shadow-brutalist-dark backdrop-blur-xs">
            <div className="mb-6 text-brand-sand">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 21l-8.228-3.69c-.49-.219-.772-.743-.772-1.29V5.106c0-.642.445-1.208 1.072-1.334l8.502-1.702a2 2 0 01.896 0l8.502 1.702c.627.126 1.072.692 1.072 1.335v11.01c0 .54-.282 1.07-.772 1.29L12 21z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
              </svg>
            </div>
            <h3 className="text-brand-sand text-2xl font-black font-syne mb-4 uppercase">
              Local Engagement
            </h3>
            <p className="text-white/80 font-medium leading-relaxed">
              We collaborate exclusively with local guides to preserve authenticity and support our mountain communities.
            </p>
          </div>

          {/* Value 2 */}
          <div className="bg-white/10 border-2 border-white/20 p-6 md:p-10 rounded shadow-brutalist-dark backdrop-blur-xs">
            <div className="mb-6 text-brand-sand">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
              </svg>
            </div>
            <h3 className="text-brand-sand text-2xl font-black font-syne mb-4 uppercase">
              Zero Impact
            </h3>
            <p className="text-white/80 font-medium leading-relaxed">
              Our motto is simple: take only photos, leave only footprints. Nature is our sanctuary.
            </p>
          </div>

          {/* Value 3 */}
          <div className="bg-white/10 border-2 border-white/20 p-6 md:p-10 rounded shadow-brutalist-dark backdrop-blur-xs">
            <div className="mb-6 text-brand-sand">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
              </svg>
            </div>
            <h3 className="text-brand-sand text-2xl font-black font-syne mb-4 uppercase">
              Elite Safety
            </h3>
            <p className="text-white/80 font-medium leading-relaxed">
              A rugged adventure does not mean reckless risk. Our team is fully trained in wilderness first aid.
            </p>
          </div>

        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-white text-center">
        <h2 className="text-3xl md:text-6xl font-black font-syne text-brand-orange mb-4 uppercase tracking-tight">
          The Project Nature Team
        </h2>
        <p className="text-brand-dark/50 font-medium max-w-2xl mx-auto mb-12 md:mb-16">
          Behind every climb are passionate people who live and breathe the outdoors.
        </p>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Team Member 1 */}
          <div className="relative group">
            <div className="bg-[#FFE8CC] rounded-3xl overflow-hidden aspect-[3/4] border-2 border-brand-forestDark shadow-brutalist-forest">
              <img 
                alt="Haithem" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAa6kaBxLx-qP2MRrqjAVGU1luaJoKUPJaOHNhyvpaiythKFCNSRuFUrKri4kjwDcGoDkZKfEuaHj1ZKMKgy5JARHv3QpTiUGyoLDwgBBnvK_uu1NGyODhnEgx2C-qYiBl-RkWx19nehB47oHv4_tneOlWjjLNpTwKkZKks8iUP6-EVCQ7BHlHh8Ui7tJnjnWTDeyynsGPD2tdW3Y6K7I7az_BoLDGUQph1Eojdo_gJVuEbsMRqCuw_ub0g2f2eABEcuAy_c3uz2o"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-brand-orange text-white p-4 rounded border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(0,0,0,1)] text-left transform -rotate-2">
              <h4 className="font-syne font-black text-lg uppercase">Haithem</h4>
              <p className="font-space font-bold text-[9px] uppercase tracking-wider opacity-90">
                Founder &amp; Lead Guide
              </p>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="relative group animate-delay-100">
            <div className="bg-brand-sand rounded-3xl overflow-hidden aspect-[3/4] border-2 border-brand-forestDark shadow-brutalist-forest">
              <img 
                alt="Rahim" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSyOEPIzr2_2--9wEutu0ggObOJQR0iUGw7ZdHmfRPOjKGkwXFqpv_9sReNJC82qSurjQCqHg5H3rYoJ8GMP4qX1m8KEG6ZLmNepa1IWRMjQviWHkY_WnxOHbxtcl21ToSnq6h5Q2KIfAglD82v5rhMMeR0jf-Kedgv75W7pohFrOXOg8ZrIfdpEKzoRxgqSqyMQSyvMtxXJFL_RU09QYtNdsAuXOZmdCKIjODVN81SR1RHs9db_ofLOJyMhgRG-cXUpQYjwZzh70"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-brand-forest text-white p-4 rounded border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(0,0,0,1)] text-left transform rotate-2">
              <h4 className="font-syne font-black text-lg uppercase">Rahim</h4>
              <p className="font-space font-bold text-[9px] uppercase tracking-wider opacity-90">
                Co-Founder &amp; Logistics
              </p>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="relative group animate-delay-200">
            <div className="bg-brand-sand rounded-3xl overflow-hidden aspect-[3/4] border-2 border-brand-forestDark shadow-brutalist-forest">
              <img 
                alt="Amine" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzA_OgoKJjABjlEmgp-m4fRKidFCo5Atowcp2_nc8n6CA5_wJfOU9lEo5C-fpyTArB05yiSzEtPGXohDUwzS2rPX0nQj48mzz-_i3PR1urXms24Hcu1mlJldvO5PEWRarP87m9zYSOWs55DYvQYHY6C2ZqxuQBbCZS8jWBZbTVuF5ERg0lJSJg1rTiIiu5MPxqRDB0xaOMo5CyXkuAGJzTnNSUg7aHanQBkTqZYJoWqmK4Fwch9Ud9qWLhfA-MD2vdR_LIALaGmxk"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-[#8E3A0D] text-white p-4 rounded border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(0,0,0,1)] text-left transform -rotate-1">
              <h4 className="font-syne font-black text-lg uppercase">Amine</h4>
              <p className="font-space font-bold text-[9px] uppercase tracking-wider opacity-90">
                Senior Mountaineering Guide
              </p>
            </div>
          </div>

          {/* Team Member 4 */}
          <div className="relative group animate-delay-300">
            <div className="bg-[#FFE8CC] rounded-3xl overflow-hidden aspect-[3/4] border-2 border-brand-forestDark shadow-brutalist-forest">
              <img 
                alt="Sarah" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRXJPyP3gNdz2iTuFXaNbDLxE-qdX3f1ufSmaDgx1_mJOUjseHtA3HkgEt2HGRjGS49KVPNvSD4ietq1jAuVCtOZPFewN85cp-TbNEXa55fGj2Ihr4ztTw3khFPLPtL-EGwcNPObrDBe53-Ba_Qo5zGS4x1V2q6-zfWm22G_WaB4LNqo5KIJP8e9HdaKIRy91CGKTDfRJ8JmAHNh2l-jROo4ep7Nn_y6WS2eYaINaR0Bak4Pg6W0AKIfT2to6QKySqdBzTpg4GGX4"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-brand-forestDark text-white p-4 rounded border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(0,0,0,1)] text-left transform rotate-3">
              <h4 className="font-syne font-black text-lg uppercase">Sarah</h4>
              <p className="font-space font-bold text-[9px] uppercase tracking-wider opacity-90">
                Expedition Photographer
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-orange py-16 md:py-24 px-6 text-center relative overflow-hidden border-t-4 border-brand-forestDark">
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          <h2 className="text-brand-sand text-3xl md:text-7xl font-black font-syne mb-6 md:mb-8 uppercase tracking-tight">
            Ready to write your own story?
          </h2>
          <p className="text-brand-sand/90 font-medium text-sm md:text-lg mb-8 md:mb-12 max-w-2xl leading-relaxed">
            Join our next expedition and discover Algeria like you've never seen it before. Adventure awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full sm:w-auto">
            
            <button 
              onClick={() => {
                setCurrentPage('kherjat');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-brand-sand text-brand-orange px-6 py-4 md:px-10 md:py-5 border-2 border-brand-forestDark shadow-brutalist-dark hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-space font-black text-sm uppercase tracking-widest rounded flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <span>Explore Upcoming Trips</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => {
                setCurrentPage('landing');
                setTimeout(() => {
                  const element = document.getElementById('signup');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="bg-transparent border-2 border-brand-sand text-brand-sand px-6 py-4 md:px-10 md:py-5 hover:bg-white/10 transition-colors font-space font-black text-sm uppercase tracking-widest rounded w-full sm:w-auto"
            >
              Contact Us
            </button>
            
          </div>
        </div>
      </section>

    </div>
  );
}
