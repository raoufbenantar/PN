import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

export default function SpecialTrips({ onBookTrip, onSelectTrip, excursions: propExcursions }) {
  const defaultExcursions = [
    {
      id: 'tassili',
      title: 'Expédition Tassili',
      tag: 'Starting Soon',
      tagBg: 'bg-brand-orange',
      duration: '7 DAYS',
      price: '35.000 DA',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_fplLA2f9VciGOp44Y0R9lf1xjB3Dcb5655Ndy6UKSUOG-_GVjVjC9UXXCvkaA0wlQYGXpxvEckloVd_4-NTpgizkQCqf0N9iQpnLLJetBAn8ZbKCK1AjlRlb7TIrvPZZW-plgKAKaMcwigSv6UImlYFHLwakqFWqig0T8Gaay1tS596uAZZ0qrL9zt5u8CtxFt9bW_Ay-moHhgoIe-zLqwMhUnAKGR67hqddd2dKNbflY8ZkFsdbnuifO1aIiZucB0XETU-aiC4',
      description: 'A mystical trek through the stone forests and Saharan canyons of Tassili n\'Ajjer.'
    },
    {
      id: 'chrea',
      title: 'Bivouac Chrea',
      tag: 'Winter Bivouac',
      tagBg: 'bg-slate-800',
      duration: 'WEEKEND',
      price: '8.500 DA',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDheSNMBtEws48_bPSb-uw6gJ0LJt7bmSDOX4y6XCueH0vJoFlW_sAvtT-PA1FHQbX0xi_HcCl4nMs1wKGbLFwcmWDay7ZjZGStRMNgrL6K_JutkzuTTmofrdh2EoRIJlTIH03yI2Bqwe_Gu_P7TZj_CQ44oCHrl44gQDSxIY-eEteCat6o31zp2yuVj2TZcNwTMWqm8IPMGwVE_VWNLPhc5Zked_pRNvs65Pn90vWcOhyjGefzygGrwskq0QJxPfiNqxkgdcNbmLo',
      description: 'An overnight stay under the snowy, ancient cedars of the Blida Atlas with a warm campfire.'
    },
    {
      id: 'jijel',
      title: 'Criques de Jijel',
      tag: 'Coastal',
      tagBg: 'bg-teal-700',
      duration: '3 DAYS',
      price: '15.000 DA',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgYWQ3ohV_siOvNWCY6pcsqUZPnAUyZYNYjKjpUcvxjZPe2Nm2tbDbK6zA5YBS7iFNTkvurqoOW4xiE9QIXUIaDnJ5M0Sti_H3ysjUY6c1Y4oghXhR7C4sgkgjOEFKo2RIMAt3cQAcY18wYx-ZKUzdN2Y6FWizuHwm-XU_THlitHhOb45VFh1-10VawdPXnFsNFfU1yoPplN2rvFRYSItz8esn2-4oYYB3TuJCiJu6LwLIEFptH_n6Haa9xl6e5-uJJnMu-3beJ5s',
      description: 'A coastal trek combining sea and mountains, with secret swims in wild coves.'
    }
  ];
  const excursions = propExcursions || defaultExcursions;

  return (
    <section id="expeditions" className="py-12 md:py-24 px-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16">
        <div className="text-center md:text-left">
          <span className="bg-brand-sand text-brand-orangeDark font-space text-xs font-black tracking-widest px-3 py-1 rounded border border-brand-orangeDark/20 uppercase">
            Our Upcoming Departures
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-brand-forestDark font-syne uppercase tracking-tight mt-4">
            Featured Expeditions
          </h2>
        </div>
        <p className="text-brand-dark/60 text-xs md:text-sm font-medium max-w-md mt-4 md:mt-0 text-center md:text-right">
          Places are extremely limited. Book now to join the next adventure with the community.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
        {excursions.map((trip) => (
          <div 
            key={trip.id}
            onClick={() => onSelectTrip(trip)}
            className="group bg-white border-2 border-brand-forestDark rounded shadow-brutalist-forest hover:shadow-brutalist-orange hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
          >
            {/* Header Image */}
            <div className="relative h-48 md:h-64 overflow-hidden border-b-2 border-brand-forestDark">
              <img 
                alt={trip.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src={trip.image}
              />
              <span className={`absolute top-4 left-4 ${trip.tagBg} text-white text-[10px] font-space font-black px-3 py-1.5 tracking-wider uppercase border border-brand-dark shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded`}>
                {trip.tag}
              </span>
            </div>

            {/* Content Body */}
            <div className="p-5 md:p-6 flex-grow flex flex-col justify-between">
              
              <div>
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <h3 className="text-xl md:text-2xl font-black text-brand-forestDark font-syne group-hover:text-brand-orange transition-colors uppercase leading-none">
                    {trip.title}
                  </h3>
                  
                  {/* Duration Tag */}
                  <span className="bg-brand-sand text-brand-orangeDark text-[9px] md:text-[10px] font-space font-bold px-2 md:px-2.5 py-1 rounded border border-brand-orange/25 inline-flex items-center space-x-1 shrink-0">
                    <Calendar className="w-3 h-3" />
                    <span>{trip.duration}</span>
                  </span>
                </div>

                <p className="text-brand-dark/70 text-xs md:text-sm font-medium leading-relaxed mb-6">
                  {trip.description}
                </p>
              </div>

              {/* Price & Booking Trigger */}
              <div className="flex justify-between items-center pt-4 md:pt-5 border-t border-brand-forest/15">
                <div className="flex flex-col">
                  <span className="text-[9px] font-space text-brand-dark/45 font-bold uppercase tracking-wider">Full Price</span>
                  <span className="font-space font-black text-lg md:text-xl text-brand-forestDark">
                    {trip.price}
                  </span>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookTrip(trip);
                  }}
                  className="bg-brand-orange hover:bg-brand-orangeDark text-white px-3.5 py-2 md:px-4 md:py-2.5 rounded border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs md:text-sm font-space font-black flex items-center space-x-1.5 md:space-x-2"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
