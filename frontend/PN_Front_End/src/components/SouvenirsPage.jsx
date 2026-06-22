import React, { useState } from 'react';
import { Heart, Play, ArrowRight, Quote } from 'lucide-react';

export default function SouvenirsPage({ setCurrentPage }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="pt-20 bg-brand-bg min-h-screen relative overflow-x-hidden font-work">
      
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-40 right-20 w-64 h-64 bg-brand-orange/10 opacity-25 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-brand-forest/10 opacity-25 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-16 py-8 md:py-20 relative">
        
        {/* Hero Header Section */}
        <section className="mb-12 md:mb-24 relative z-10">
          <h1 className="font-syne text-3xl md:text-8xl font-black text-brand-forestDark mb-4 md:mb-6 leading-none tracking-tight uppercase relative">
            Our <br/>
            <span className="text-brand-orange italic font-light">Souvenirs</span>
            
            {/* Decorative hand-drawn underline effect */}
            <svg className="absolute bottom-1.5 left-0 w-48 md:w-64 h-4 text-brand-orange/20 -z-10" preserveAspectRatio="none" viewBox="0 0 100 10">
              <path d="M0,5 Q50,0 100,5" fill="none" stroke="currentColor" strokeWidth="4"></path>
            </svg>
          </h1>
          
          <p className="text-brand-dark/70 font-medium text-sm md:text-lg max-w-2xl border-l-4 border-brand-orange pl-4 md:pl-6 leading-relaxed">
            Moments of sharing, overcoming limits, and pure freedom. Dive into our visual logbook, a collection of moments captured during our expeditions across the raw wilderness of Algeria.
          </p>
        </section>

        {/* Masonry-Style Scrapbook Gallery */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-16 md:mb-32 relative">
          
          {/* Column 1: Main Image & Testimonial */}
          <div className="md:col-span-7 flex flex-col gap-8 md:gap-12 relative z-10">
            
            {/* Large Image: The Call of the Ridge */}
            <div className="relative group">
              <div className="absolute inset-0 bg-brand-forestDark translate-x-3 translate-y-3 rounded"></div>
              <div className="relative z-10 border-2 border-brand-forestDark rounded overflow-hidden shadow-md">
                <img 
                  alt="Expedition view" 
                  className="w-full h-[300px] md:h-[600px] object-cover filter grayscale-0 hover:grayscale-[15%] transition-all duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNJ6MthZV3LUC_FRUFQB1hYBzRZyykaGAHG0YydAG4-u6g88t1RZ6VOfsvsC5-iFzBx1yycxzjhU0il7NRjeoJ9kAiugENxsSjpLq51WQMg4O-A95-N4plyun3GEhALoC6xNTvZ_GmYxi0YwLxxkzhNlmRH3KLF8fiyP1Xdsec2oFQrZkDhji138zdU7W2AumJNXbZUUjqn7jDGqaQDn8KF5K-3hV_wpCxRTyUIBlZGyfEEamMxEU2iy0ymjtF2DRargDsMXap9Cw"
                />
                
                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-brand-sand px-4 py-3 md:px-6 md:py-4 border-2 border-brand-forestDark shadow-[4px_4px_0px_rgba(22,44,28,1)] z-20 rounded">
                  <span className="font-space font-black text-[10px] md:text-xs text-brand-orange uppercase tracking-widest block mb-1">
                    Middle Atlas
                  </span>
                  <h3 className="font-syne text-lg md:text-2xl font-black text-brand-forestDark uppercase tracking-tight">
                    The Call of the Ridge
                  </h3>
                </div>
              </div>
            </div>

            {/* Testimonial Quote Block */}
            <div className="bg-[#FFE8CC] p-6 md:p-10 border-2 border-brand-forestDark shadow-brutalist-forest relative mt-6 md:mt-10 md:mr-10 rounded">
              <div className="absolute -top-6 -left-6 bg-brand-sand rounded-full p-3.5 border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] flex items-center justify-center">
                <Quote className="w-6 h-6 md:w-8 md:h-8 text-brand-forestDark fill-brand-forestDark" />
              </div>
              
              <p className="font-syne text-lg md:text-2xl lg:text-3xl font-black text-brand-forestDark leading-snug italic mb-6">
                "Adventure is not in the climb, but in what we discover along the way."
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-0.5 bg-brand-forestDark"></div>
                <span className="font-space font-black text-[10px] md:text-xs text-brand-forestDark/80 uppercase tracking-widest">
                  — Mehdi, 2023
                </span>
              </div>
            </div>

          </div>

          {/* Column 2: Video & Polaroids */}
          <div className="md:col-span-5 flex flex-col gap-8 md:gap-12 mt-10 md:mt-0 relative z-20">
            
            {/* Video Player Component */}
            <div className="relative bg-brand-sand p-4 border-2 border-brand-forestDark shadow-brutalist-forest rotate-[1.5deg] hover:rotate-0 transition-transform duration-500 rounded">
              <div className="relative aspect-video border-2 border-brand-forestDark overflow-hidden rounded bg-black">
                {isPlaying ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white p-6 relative">
                    {/* Simulated playing background */}
                    <img 
                      alt="Hikers moving" 
                      className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xs" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyNf55M1qfo_5nfXnDnIx4D5-2kRtOCWdaIAev2J0WYY6CELnwtB5qQHrNprkJYTccl06UBYmIQJb48pXiMNEuZ4j_9d__YOecvFGd0H9w2Ci9I3vNNlkId4Qudhxa7Ic7UTGullXCtitnCTHivigtRSBrGiV6NHnTYLXMi8FgS_R6a-K2WRefUsxKhaWEECFY2ruAmvpvLjhmOfi_kKEGKm6FUIBlLGdkIt0mLGuvKgoOveJLIvcFeVJzdVBeIRiHRyq1G8Jzbo0"
                    />
                    <div className="relative z-10 text-center">
                      <div className="animate-pulse mb-3 font-space font-black text-xs text-brand-orange uppercase tracking-widest bg-brand-sand px-3 py-1 rounded inline-block border border-brand-forestDark">
                        ● Playing Logbook
                      </div>
                      <button 
                        onClick={() => setIsPlaying(false)} 
                        className="bg-brand-orange text-white text-xs font-space font-black px-4 py-2 border border-brand-forestDark rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-brand-orangeDark transition-colors"
                      >
                        Pause Stream
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <img 
                      alt="Hikers moving" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyNf55M1qfo_5nfXnDnIx4D5-2kRtOCWdaIAev2J0WYY6CELnwtB5qQHrNprkJYTccl06UBYmIQJb48pXiMNEuZ4j_9d__YOecvFGd0H9w2Ci9I3vNNlkId4Qudhxa7Ic7UTGullXCtitnCTHivigtRSBrGiV6NHnTYLXMi8FgS_R6a-K2WRefUsxKhaWEECFY2ruAmvpvLjhmOfi_kKEGKm6FUIBlLGdkIt0mLGuvKgoOveJLIvcFeVJzdVBeIRiHRyq1G8Jzbo0"
                    />
                    {/* Play Button Overlay */}
                    <div 
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-xs group cursor-pointer hover:bg-black/25 transition-all duration-300"
                    >
                      <div className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center border-2 border-brand-forestDark shadow-[4px_4px_0px_rgba(22,44,28,1)] group-hover:scale-110 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-300">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-4 flex justify-between items-center px-2">
                <span className="font-space font-black text-xs text-brand-forestDark tracking-wider">
                  IN MOTION
                </span>
                <span className="font-space font-bold text-xs text-brand-dark/50">
                  02:14
                </span>
              </div>
            </div>

            {/* Smiling Explorer Polaroid */}
            <div className="bg-white p-4 pb-8 md:pb-12 border-2 border-brand-forestDark shadow-brutalist-forest -rotate-[2deg] hover:rotate-0 transition-transform duration-500 w-full md:w-4/5 md:-ml-12 md:self-end z-30 rounded-xs">
              <div className="border border-brand-forestDark/20 rounded-xs overflow-hidden">
                <img 
                  alt="Smiling explorer" 
                  className="w-full h-48 md:h-64 object-cover filter sepia-[0.15]" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOohTC0kfJuk7rKUMapilcSMUt5vq5KbAGUO4gGUk56YTjJkLyQKaAM06nHdg83ueAHrY56sACofIU83fIzxRIDzBpDbP-ootq5pGZnTNX4Gt8Oc5cV93bo22Zp4ZgNEQ9myGfhTsEk94zarXDCc_dFCLwb-TqG63xVrhIyGsPL3MohkZEsgvFMZtE8J1CWpeEEGNkWSIPoyT6HM9K7PKipaJGCBAunrsth3B29LvryZ0zm1fzQrkdzpOe8N6QUY8FUWKWtBrV9Ls"
                />
              </div>
              <div className="mt-4 md:mt-6 flex items-center justify-between px-1">
                <span className="font-space font-black text-xs md:text-sm text-brand-forestDark uppercase tracking-tight">
                  Altitude Smiles
                </span>
                <Heart className="w-5 h-5 text-brand-orange fill-brand-orange" />
              </div>
            </div>

            {/* Campfire Bivouac at night */}
            <div className="relative group mt-4 md:mt-8">
              <div className="absolute inset-0 bg-brand-orange translate-x-2.5 translate-y-2.5 rounded"></div>
              <div className="relative z-10 border-2 border-brand-forestDark rounded overflow-hidden shadow-md">
                <img 
                  alt="Campfire at night" 
                  className="w-full h-[200px] md:h-[300px] object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa17PPlXhB7xwgOKujX8dE3KJcIpGOvtBSfZLSc1VvztLeuy3t4aQUg4fqftLsDGKwiVwFmor6yFkmMNb5g7BuwoSaKBXCYDOKVb0mzWZgB7oyaSNG2lXeqRTWPVtithlkm9ki2unqNa8v-X_puuMxdjE5OXLKL4S0aSdMT1e_kunebs3MOww_XXwImlVEohD6_-up6g5C_-VEHxD6FbKvbBrmIts2oImVsHrN_eky7yhjtLefaVNt9qKU3ndl_JXUY2M1kpQCgAk"
                />
                
                <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 bg-brand-sand px-4 py-2 md:px-5 md:py-3 border-2 border-brand-forestDark z-20 rotate-[-3deg] rounded shadow-[2px_2px_0px_rgba(22,44,28,1)]">
                  <span className="font-space font-black text-[10px] md:text-xs text-brand-forestDark uppercase tracking-widest">
                    Bivouac Evening
                  </span>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* Call to Action Section */}
        <section className="bg-brand-forestDark p-6 py-12 md:p-24 border-4 border-brand-forestDark shadow-brutalist-forest relative overflow-hidden mb-16 md:mb-20 rounded text-center">
          {/* Leaf Background Sketch Decorator */}
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <svg height="400" viewBox="0 0 200 200" width="400">
              <path d="M45.7,-76.1C58.9,-69.3,68.8,-55.4,76.5,-41.1C84.2,-26.8,89.7,-12.1,87.6,1.8C85.5,15.7,75.8,28.8,65.8,40.4C55.8,52,45.5,62.1,32.6,69.5C19.7,76.9,4.2,81.6,-10.8,80.1C-25.8,78.6,-40.3,70.9,-52.3,60.6C-64.3,50.3,-73.8,37.4,-79.8,22.7C-85.8,8,-88.3,-8.5,-83.4,-23.4C-78.5,-38.3,-66.2,-51.6,-51.8,-58.5C-37.4,-65.4,-20.9,-65.9,-4.6,-59.5C11.7,-53.1,28.2,-50,45.7,-76.1Z" fill="#cfe9d1" transform="translate(100 100)"></path>
            </svg>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="font-syne text-2xl md:text-5xl font-black text-brand-sand mb-6 uppercase tracking-tight">
              Want to create your own memories?
            </h2>
            
            <p className="font-medium text-sm md:text-lg text-brand-sand/75 mb-8 md:mb-10 leading-relaxed">
              Join our next expedition and write your own chapter in raw nature.
            </p>
            
            <button 
              onClick={() => {
                setCurrentPage('kherjat');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-brand-orange text-white px-8 py-4 border-2 border-brand-forestDark shadow-[4px_4px_0px_rgba(22,44,28,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-space font-black text-sm uppercase tracking-widest rounded flex items-center gap-3"
            >
              <span>View Upcoming Trips</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </main>
      
    </div>
  );
}
