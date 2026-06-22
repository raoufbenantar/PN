import React from 'react';

export default function Categories() {
  const profiles = [
    {
      name: 'Youth',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxYS9U9_hRyyqbePwqEXfAFnGxbSc1hiEYJTDqjOvSfGCstYVwTfFuLt7phMTqHJDHvA7fweUSjQqAJdN7spbdRkvIo6uUeChbtD_sssdOm-wLRPH4fBJwuqWoq1uWQCORRgf1WuBfmVLYaM-QSL53BvBKU52QYJdxWgJaZ1HwSeKTPJcYe3lj5AfoZGmuYrxOZqDQqoVyb8z61Dd4DO2HWXQTsfe4WDJjQbMG9c5iMW9aVgET5luvbgfXB3CPaEsqEwI1qWWqWVk',
      borderColor: 'border-brand-orange',
      shadowColor: 'shadow-brutalist-orange',
      rotation: '-rotate-2',
      description: 'For those who want to disconnect, have fun, and meet other passionate explorers.'
    },
    {
      name: 'Athletes',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKUM7kvjJdyRpGeUzJzUCLw4i4PSD8aRIKTlwF948s4ppyeRrGTV7m6OBTubAOWYP4yM0wpYjTr6B7vuNZxuearxt9Fjy4qBfqxBzYtkk16Q5sUC9zbcUOcWwUuTP42SO6xdNFgdMWGPKHy1Pglny0WxYqmRI5C1QCZDdtkhzr_J2Q8uy9H36y3enKKUZ26IZfRAhGdPUEfpgC8QNHzLqOnPNtx4iA_60aEZPq_YsmLCeLF2SSr9iIUKafkB5J0NnsINSPtdMSP4k',
      borderColor: 'border-yellow-500',
      shadowColor: 'shadow-brutalist-dark',
      rotation: 'rotate-1',
      description: 'Intense treks with high elevation gains and physical challenges to push your boundaries.'
    },
    {
      name: 'Students',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKy1GC84YvTvHR1yo8yOCa_zr3OkD7jSwg-F2r2gO6OrB_V1ogrDwnX9AHVLUc9Z_0ZEk6pYTGpjtq5CZ28fIq5H4Mk_YeE4gIa_1MrXzIwQveQ4dK9toP4bv-QEvkChxmJU1Zl8W74DR8CruZwLShcWbTxnae7DpNabXFITUphTuMVb9h-ZIJnkOz0aFOU0HX6upK4_X4X4AtJZ6auuFX8s-8OtmR9mabwzBgleaRIlu8-vGcFCkXKg1fsM5KnWee216SgbLntfA',
      borderColor: 'border-brand-sand',
      shadowColor: 'shadow-brutalist-forest',
      rotation: '-rotate-1',
      description: 'Special rates and adapted adventures to escape during the weekends.'
    }
  ];

  return (
    <section id="about" className="bg-brand-forestDark py-12 md:py-24 px-6 relative overflow-hidden">
      
      {/* Decorative organic leaf background SVG sketch */}
      <div className="absolute top-10 left-10 w-48 h-48 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white w-full h-full">
          <path d="M50 10C50 10 30 40 30 70C30 85 40 90 50 90C60 90 70 85 70 70C70 40 50 10 50 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M50 10V90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M50 40C50 40 40 45 35 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M50 60C50 60 60 65 65 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-10 md:mb-16">
          <span className="text-brand-sand font-space text-xs font-black tracking-widest px-3 py-1 rounded border border-brand-sand/20 uppercase bg-white/5">
            For All Profiles
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white font-syne uppercase tracking-tight mt-4">
            Find Your Trip
          </h2>
        </div>

        {/* DESKTOP Polaroid Card Grid (Hidden on mobile) */}
        <div className="hidden md:grid grid-cols-3 gap-12 max-w-5xl mx-auto">
          {profiles.map((profile) => (
            <div 
              key={profile.name}
              className={`flex flex-col items-center group transition-all duration-300 ${profile.rotation} hover:rotate-0 hover:scale-105`}
            >
              {/* Polaroid Frame */}
              <div className={`w-full bg-white p-4 pb-8 border-4 ${profile.borderColor} rounded ${profile.shadowColor} transition-shadow`}>
                <div className="aspect-square w-full overflow-hidden rounded border border-brand-forest/20 relative">
                  <img 
                    alt={profile.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    src={profile.image}
                  />
                  {/* Subtle vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent"></div>
                </div>
                
                {/* Handwritten-style/Epilogue label */}
                <h3 className="text-2xl font-black text-brand-dark font-syne text-center mt-6 uppercase tracking-wider">
                  {profile.name}
                </h3>
              </div>

              {/* Card Description */}
              <p className="text-brand-sand/80 text-sm font-medium mt-6 text-center max-w-[240px] leading-relaxed">
                {profile.description}
              </p>
            </div>
          ))}
        </div>

        {/* MOBILE Circular profile list (Hidden on desktop) */}
        <div className="flex md:hidden flex-col gap-10 items-center">
          {profiles.map((profile) => (
            <div key={profile.name} className="flex flex-col items-center">
              <div className={`w-36 h-36 rounded-3xl border-4 ${profile.name === 'Youth' ? 'border-brand-orange' : 'border-white/30'} p-1.5 mb-3 overflow-hidden shadow-lg`}>
                <img 
                  alt={profile.name} 
                  className="w-full h-full object-cover rounded-2xl" 
                  src={profile.image}
                />
              </div>
              <span className="text-lg font-bold font-syne text-white uppercase tracking-wide">{profile.name}</span>
              <p className="text-xs text-brand-sand/70 mt-1 max-w-[220px] text-center font-medium">
                {profile.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
