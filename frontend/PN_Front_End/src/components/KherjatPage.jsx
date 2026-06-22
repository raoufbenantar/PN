import React, { useState, useMemo } from 'react';
import { Calendar, ArrowRight, MapPin, SlidersHorizontal, Search, ChevronRight } from 'lucide-react';

export default function KherjatPage({ onBookTrip, onSelectTrip, excursions: propExcursions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const defaultExcursions = [
    {
      id: 'tassili-tadrat',
      title: "Trek Tassili n'Ajjer - Tadrat",
      tag: "7 Days",
      price: "65.000 DA",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMKavewIZbjpyiAzXfa5nVUsF6BCpv0Fbc6KaEPnKiGg7jflvdj6NMemI6DTPUI9mle_1KrzG2QRuCFFkUmmZ5VbponDp78wrF9Odd7VGQuMg0_8do_5Pa_v6Omd2-eRRNtJ_0677yxuHkJ8ExeF9uyQG0c7FIoxE4x-EJngzVjYzbEZv8q3TehGDhA_q7X9SuGX_n3O1FBiLlC_Pqp3-afu60Pn-SNGBkLt6zQAh0403E11v0nCxDPjIAX4iC51R2Lqk4H43ABsk",
      category: "Expedition",
      difficulty: "Difficult",
      description: "Explore the most beautiful desert in the world. A total immersion between red dunes and lunar landscapes.",
      date: "15 OCT 2024"
    },
    {
      id: 'tikjda-bivouac',
      title: "Weekend Tikjda - Kabylie",
      tag: "2 Days",
      price: "4.500 DA",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoNiNyrNHq8PTrt-M3pcPTLBAwEUR1GSVHJI-ty0Kegq9l207XBClbvUCAsCM6U0wWqhQYMRcDUEmnrBNz_DzzqBiTTNZfz0KSKMS0gzKmJc8d4YDDjf1_VcZV0PFNWgFgHpWUgwS2GP1NqP-fl_-PlUNjkVSd7CpuTnOas5eAXTyJ13e0Bi9chQq5obprpC5Vot8QWP1CLUsPxFw-msFrMebLl_yB9I3o6vc8hrqEvL97bTWhEZzb4qhlIBvLmnfqKHRiJETcy0k",
      category: "Bivouac",
      difficulty: "Moderate",
      description: "A bivouac among thousand-year-old cedars. Admire the sunset from the summit of Djurdjura.",
      date: "12 JUL 2024"
    },
    {
      id: 'sahara-tadrat',
      title: "Sahara - Tadrat Rouge",
      tag: "5 Days",
      price: "52.000 DA",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-trsUYpxIr08SfpMR95tnqqURrr_7Ue-rdkwUkZONXoe_RDMMeQp0vuKm8KmCNqO5cpzcSJy7wNNFPxTD3rMddH-QjfseUoyQlPMfyvFwOAkE0WhWje8GMXggRE1V0RmmWdvQO7tuUSkEytwc8oew_0Qenmkbx-GaypLATMMCgStXA-eboiDj1mEloSxONaosUnLYXuAN5wJdiG0DYCSbw0e1YrqQ6XREIkBEiIN4EQ07fSKsq_Ok7QJXxinqWjV9zQK-OL3stT0",
      category: "Expedition",
      difficulty: "Difficult",
      description: "Absolute silence. Trek the highest red sand dunes in the world under a unique starry sky.",
      date: "20 NOV 2024"
    }
  ];

  const allExcursions = useMemo(() => {
    if (propExcursions) {
      return propExcursions.map(t => {
        let diff = 'Moderate';
        if (t.price.includes('12.000') || t.price.includes('8.500')) diff = 'Easy';
        if (t.price.includes('35.000')) diff = 'Difficult';
        
        // Capitalize category/type
        let cat = 'Expedition';
        if (t.type) {
          cat = t.type.charAt(0).toUpperCase() + t.type.slice(1).toLowerCase();
          if (cat === 'Hike') cat = 'Hiking';
        }
        
        return {
          id: t.id,
          title: t.title,
          tag: t.duration,
          price: t.price,
          image: t.image,
          category: cat,
          difficulty: diff,
          description: t.description,
          date: t.dates ? t.dates.split(' - ')[0] : 'TBD'
        };
      });
    }
    return defaultExcursions;
  }, [propExcursions]);

  // Dynamic filter logic
  const filteredExcursions = useMemo(() => {
    return allExcursions.filter((excursion) => {
      const matchesSearch = excursion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            excursion.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDifficulty = difficultyFilter === 'All' || excursion.difficulty === difficultyFilter;
      const matchesCategory = categoryFilter === 'All' || excursion.category === categoryFilter;

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [searchTerm, difficultyFilter, categoryFilter]);

  return (
    <div className="pt-20 bg-brand-bg min-h-screen">
      
      {/* Hero Header Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative overflow-hidden">
        {/* Background Sketch Overlay */}
        <div className="absolute top-10 left-0 opacity-10 pointer-events-none -z-10">
          <svg className="text-brand-forest" fill="currentColor" height="200" viewBox="0 0 100 100" width="200">
            <path d="M50 10L10 90h80z"></path>
          </svg>
        </div>

        <h1 className="text-3xl md:text-7xl font-black text-brand-orange font-syne uppercase leading-none tracking-tight mb-8 md:mb-12 select-none">
          Discover your<br/>next <span className="bg-gradient-to-t from-brand-sand/70 via-brand-sand/50 to-transparent px-2 border-b-4 border-brand-orange">adventure</span>.
        </h1>

        {/* Search Bar Block */}
        <div className="bg-white p-4 md:p-6 rounded border-2 border-brand-forestDark max-w-4xl shadow-brutalist-forest flex flex-col md:flex-row gap-6 items-end relative z-10">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-space font-black uppercase text-brand-orange mb-2 tracking-widest">
              Destination
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40">
                <Search className="w-4 h-4" />
              </span>
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Where do you want to go?" 
                type="text"
                className="w-full pl-10 pr-4 py-3 border-2 border-brand-forestDark/20 rounded focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none text-sm font-medium transition-colors"
              />
            </div>
          </div>

          <div className="w-full md:w-64">
            <label className="block text-[10px] font-space font-black uppercase text-brand-orange mb-2 tracking-widest">
              Difficulty
            </label>
            <div className="relative">
              <select 
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border-2 border-brand-forestDark/20 rounded focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none text-sm font-bold bg-white text-brand-dark/80 appearance-none cursor-pointer"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Difficult">Difficult</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-dark/40">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              // Quick alert if search is submitted
              console.log('Filtering applied');
            }}
            className="bg-brand-orange hover:bg-brand-orangeDark text-white px-8 py-3.5 font-space font-black uppercase tracking-widest text-xs border-2 border-brand-forestDark shadow-brutalist-dark hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all w-full md:w-auto rounded shrink-0"
          >
            Search
          </button>
        </div>
      </section>

      {/* Filter Category Tabs Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-forest/15 pb-6">
          <div className="flex items-center gap-3 w-full overflow-x-auto scrollbar-none pb-2 md:pb-0">
            <span className="text-sm font-bold text-brand-forestDark mr-2 font-space shrink-0">Filter:</span>
            
            {/* Category Buttons */}
            {['All', 'Hiking', 'Bivouac', 'Expedition'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-5 py-2.5 border-2 border-brand-forestDark rounded font-space font-bold text-xs uppercase transition-all shrink-0 ${
                  categoryFilter === cat 
                    ? 'bg-brand-orange text-white shadow-brutalist-dark translate-x-0.5 translate-y-0.5' 
                    : 'bg-white text-brand-forestDark hover:border-brand-orange hover:text-brand-orange'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button 
            onClick={() => {
              setSearchTerm('');
              setDifficultyFilter('All');
              setCategoryFilter('All');
            }}
            className="px-4 py-2 border border-brand-forestDark/30 hover:border-brand-orange hover:text-brand-orange rounded font-space font-bold text-xs uppercase bg-white text-brand-dark/60 transition-colors w-full md:w-auto"
          >
            Clear Filters
          </button>
        </div>
      </section>

      {/* Expeditions Grid Section */}
      <section className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
        {filteredExcursions.length === 0 ? (
          <div className="text-center py-20 bg-white border-2 border-dashed border-brand-forest/20 rounded p-8">
            <p className="text-brand-dark/50 font-bold font-space text-lg">No excursions found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setDifficultyFilter('All');
                setCategoryFilter('All');
              }}
              className="mt-4 text-xs font-space font-black bg-brand-orange text-white px-5 py-2.5 rounded border-2 border-brand-forestDark shadow-brutalist-dark"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredExcursions.map((trip, idx) => (
              <article 
                key={trip.id}
                onClick={() => onSelectTrip(trip)}
                className={`bg-white border-2 border-brand-forestDark rounded overflow-hidden shadow-brutalist-forest hover:shadow-brutalist-orange hover:-translate-y-1 transition-all duration-300 flex flex-col transform cursor-pointer ${
                  idx === 1 ? 'md:-translate-y-3' : ''
                }`}
              >
                {/* Image Area */}
                <div className="relative h-64 overflow-hidden border-b-2 border-brand-forestDark">
                  <img 
                    alt={trip.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                    src={trip.image}
                  />
                  <div className="absolute top-4 left-4 bg-brand-orange text-white text-[10px] font-space font-black px-3 py-1.5 border border-brand-forestDark shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded uppercase">
                    {trip.tag}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-brand-forestDark/95 text-brand-sand text-xs font-space font-black px-3 py-1.5 border border-white/20 rounded shadow-lg">
                    {trip.price}
                  </div>
                </div>

                {/* Body details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-2 mb-4">
                      <span className="text-[9px] font-space font-black uppercase tracking-tight border-2 border-brand-forest/20 px-2.5 py-0.5 rounded text-brand-forestDark bg-brand-sand/30">
                        {trip.category}
                      </span>
                      <span className="text-[9px] font-space font-black uppercase tracking-tight border-2 border-brand-forest/20 px-2.5 py-0.5 rounded text-brand-forestDark bg-brand-sand/30">
                        {trip.difficulty}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-brand-forestDark font-syne mb-3 uppercase leading-none">
                      {trip.title}
                    </h3>
                    
                    <p className="text-brand-dark/70 text-sm font-medium leading-relaxed mb-6">
                      {trip.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-brand-forest/10 mt-auto">
                    <span className="text-[10px] font-space font-bold text-brand-dark/45 flex items-center gap-1.5 uppercase">
                      <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                      {trip.date}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookTrip({
                          title: trip.title,
                          duration: trip.tag,
                          price: trip.price
                        });
                      }}
                      className="text-[10px] font-space font-black text-brand-orange hover:text-brand-orangeDark uppercase flex items-center gap-1 transition-all group"
                    >
                      <span>Book Now</span> 
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Philosophy Showcase Section */}
      <section className="bg-brand-forest text-white py-16 md:py-24 relative overflow-hidden border-t-4 border-brand-forestDark">
        {/* Sketch Background */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none select-none">
          <svg fill="currentColor" height="400" viewBox="0 0 100 100" width="400" className="text-brand-sand">
            <path d="M50 10 L85 70 L65 70 L80 90 L20 90 L35 70 L15 70 Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative">
            {/* Outline Card Effect */}
            <div className="absolute inset-0 border-2 border-brand-sand/30 rounded translate-x-4 -translate-y-4"></div>
            <img 
              alt="Immersion Nature" 
              className="relative z-10 w-full aspect-[4/3] object-cover border-2 border-brand-sand rounded shadow-brutalist-dark" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCibTEd5I-KSowPb_fIJWZlWnlJXjLghZ8qQXew7MDT-qcsm6nDL9QSgvhpHksML5q-Arw-wbFDFV0KQ75ch89xC7qhHK0BQOI6nkDkBVB-bNB5P2mjJKnim2YlCjWFMydVTjfayiSTthzEV81NSBb-U6IZ7s_091_31tewrune4_2KVs344VpZTTSuWeTHJJ1v1p2RmocCYPmD09PUe5Q3ypPwyR2qbAaws_3YDG7C6VrwA9YdKyT85GlK6eeBLGI13S20EFfk2qc"
            />
          </div>
          <div className="z-10">
            <h2 className="text-2xl md:text-5xl font-black font-syne leading-tight mb-6 md:mb-8 uppercase tracking-tight text-brand-sand">
              More than just an outing, an immersion.
            </h2>
            <p className="text-sm md:text-lg text-brand-sand/85 mb-8 md:mb-10 leading-relaxed font-medium">
              Project Nature doesn't organize simple tourist sightseeing. We design expeditions that test your limits and reveal the raw splendor of Algeria. Every itinerary is tested by our expert guides to guarantee a safe and authentic experience.
            </p>
            <ul className="space-y-4 font-space font-black uppercase text-xs tracking-wider text-brand-sand/90">
              <li className="flex items-center gap-4">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-brand-orange text-white border border-brand-forestDark text-[10px] font-bold">✓</span>
                <span>Certified & local guides</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-brand-orange text-white border border-brand-forestDark text-[10px] font-bold">✓</span>
                <span>High-end safety equipment</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-brand-orange text-white border border-brand-forestDark text-[10px] font-bold">✓</span>
                <span>Total respect for the environment</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}
