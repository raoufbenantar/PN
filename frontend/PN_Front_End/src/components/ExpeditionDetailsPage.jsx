import React from 'react';
import { Calendar, MapPin, ShieldAlert, CheckCircle, Users, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

const tripDetailsMap = {
  'tassili-tadrat': {
    categoryTag: 'EXPÉDITION SUD',
    duration: '7 Days',
    difficulty: 'Difficult',
    location: 'Djanet',
    groupSize: '12 Max',
    departure: 'Djanet Airport (Tiska)',
    physicalLevel: '5-6h of daily walking. Good physical endurance required.',
    inclusions: [
      'Certified Tuareg guides',
      'Complete bivouac gear',
      'Full board (local cuisine)',
      'Repatriation assistance insurance'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Immersion in Djanet', desc: 'Arrival at the oasis, preparation of 4x4 vehicles, and first bivouac under the stars of Tassili.' },
      { day: 'Day 2-4', title: 'The Red Heart of Tadrat', desc: 'Crossing narrow canyons and ascending the giant dunes of Moul Naga. Total geological immersion.' },
      { day: 'Day 5', title: 'Tin Merzouga Rock Paintings', desc: 'Observation of thousands-of-years-old rock engravings. Sunset on the highest sand dunes of the region.' },
      { day: 'Day 6-7', title: 'Return and Serenity', desc: 'Descending the In Djerane wadi, final Saharan tea ceremonies, and return flight from Djanet.' }
    ],
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuALilPKig5ZquRh8gOLEg_9o1fHQleAd4_1-zkeRgzRHHQgFDf7cwan32ekskYEXvSzQjjOLi8LgwRMGGJrkC2ISPJT9zd3u0U57TK6bobZBE0bd-Zbq8ZNnH4EzXQnUDO2HNHxC8NuWSycGUaQvF7ql-mDpFKjt0DmomSD7NtE9625leVJ83jTBi9jBewH1YyORf0gdm9VRN4lAG6u_2D2myw-OkiOAnu4P_m5N2XyUBCcMWJudN744pjhYp6yiswPaQ_QisftPgs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCEEmn9z6QbsHIndR-iAc-v7wdAlUZBzGEIGFO_TJ1rf9DNQaATfBWPHXsZ1XXMpn96x22J1SmZEdvWUNE4KYdYKUTKRqBUasYEA4M_51Pv75jxae98-GVA2KRM_OQkSRtd0Qmi_NvsdJMrDSh_TS0vGiL-3ienFmCZMk_7kgt-8-OPvwoynkZUPtBfuw4TRgP4nN7fTbOcQDzHyHF2698Yoj9FeSTE7VvSFEyRkM8Kbhw1cv4UKpN3m9naDdwdAXSVyB5yY28vDwM',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjNCRRw_1BL6NoaN7FLJGzCvNs-KQ8RaQ9O7TuGmHQRFjl5GJhIYuj0u9msATANjMzx4Ey1grOTHoDYwEOXb5b7hvL4xTDnDEqjC-uhcyXH2uulwXomESxiiekykCWbaNBcIOVvPZVKc9L2m1NjECxgrBlMTDQV4KboeEPMdXoxpWFJQRil-Ev2sYU58wRgFAefnQKV3GxJq3kllaJgHMmLtEc1Pia4xqjY4JCR-mmGD8oLnz_hnfMjiXtXswVUcU1dgnkdYDgkhk',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBJowLkyBNnfmaLT7SeD_SYtWeI8eTfypC3yzhVnBk1QDD1XE3poqYYcdnRF78VfKhoRc-vqm8xBwvsCTkM8MD1UEmdeqAmHCz6J589gqK1QyA1XNX1ct4HC5CPHMP0sPT38Vbw2O0AfurlzJlNQz5IT2uuhAco2EbPXIGdRl0Y4MRxXu9EE4gwp-YLQ65Slo1juSRYth6ZJ7NsuqHoaHjK7q0SB2qS6duAknryK3mZQJIhMzr_-mYQ8E2oeqV1oa455jRd1Ez89x0'
    ]
  },
  'tassili': {
    categoryTag: 'EXPÉDITION SUD',
    duration: '7 Days',
    difficulty: 'Difficult',
    location: 'Djanet',
    groupSize: '12 Max',
    departure: 'Djanet Airport (Tiska)',
    physicalLevel: '5-6h of daily walking. Good physical endurance required.',
    inclusions: [
      'Certified Tuareg guides',
      'Complete bivouac gear',
      'Full board (local cuisine)',
      'Repatriation assistance insurance'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Immersion in Djanet', desc: 'Arrival at the oasis, preparation of 4x4 vehicles, and first bivouac under the stars of Tassili.' },
      { day: 'Day 2-4', title: 'The Red Heart of Tadrat', desc: 'Crossing narrow canyons and ascending the giant dunes of Moul Naga. Total geological immersion.' },
      { day: 'Day 5', title: 'Tin Merzouga Rock Paintings', desc: 'Observation of thousands-of-years-old rock engravings. Sunset on the highest sand dunes of the region.' },
      { day: 'Day 6-7', title: 'Return and Serenity', desc: 'Descending the In Djerane wadi, final Saharan tea ceremonies, and return flight from Djanet.' }
    ],
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuALilPKig5ZquRh8gOLEg_9o1fHQleAd4_1-zkeRgzRHHQgFDf7cwan32ekskYEXvSzQjjOLi8LgwRMGGJrkC2ISPJT9zd3u0U57TK6bobZBE0bd-Zbq8ZNnH4EzXQnUDO2HNHxC8NuWSycGUaQvF7ql-mDpFKjt0DmomSD7NtE9625leVJ83jTBi9jBewH1YyORf0gdm9VRN4lAG6u_2D2myw-OkiOAnu4P_m5N2XyUBCcMWJudN744pjhYp6yiswPaQ_QisftPgs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCEEmn9z6QbsHIndR-iAc-v7wdAlUZBzGEIGFO_TJ1rf9DNQaATfBWPHXsZ1XXMpn96x22J1SmZEdvWUNE4KYdYKUTKRqBUasYEA4M_51Pv75jxae98-GVA2KRM_OQkSRtd0Qmi_NvsdJMrDSh_TS0vGiL-3ienFmCZMk_7kgt-8-OPvwoynkZUPtBfuw4TRgP4nN7fTbOcQDzHyHF2698Yoj9FeSTE7VvSFEyRkM8Kbhw1cv4UKpN3m9naDdwdAXSVyB5yY28vDwM',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjNCRRw_1BL6NoaN7FLJGzCvNs-KQ8RaQ9O7TuGmHQRFjl5GJhIYuj0u9msATANjMzx4Ey1grOTHoDYwEOXb5b7hvL4xTDnDEqjC-uhcyXH2uulwXomESxiiekykCWbaNBcIOVvPZVKc9L2m1NjECxgrBlMTDQV4KboeEPMdXoxpWFJQRil-Ev2sYU58wRgFAefnQKV3GxJq3kllaJgHMmLtEc1Pia4xqjY4JCR-mmGD8oLnz_hnfMjiXtXswVUcU1dgnkdYDgkhk',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBJowLkyBNnfmaLT7SeD_SYtWeI8eTfypC3yzhVnBk1QDD1XE3poqYYcdnRF78VfKhoRc-vqm8xBwvsCTkM8MD1UEmdeqAmHCz6J589gqK1QyA1XNX1ct4HC5CPHMP0sPT38Vbw2O0AfurlzJlNQz5IT2uuhAco2EbPXIGdRl0Y4MRxXu9EE4gwp-YLQ65Slo1juSRYth6ZJ7NsuqHoaHjK7q0SB2qS6duAknryK3mZQJIhMzr_-mYQ8E2oeqV1oa455jRd1Ez89x0'
    ]
  },
  'chrea': {
    categoryTag: 'BIVOUAC ATLAS',
    duration: '2 Days',
    difficulty: 'Moderate',
    location: 'Chréa, Blida',
    groupSize: '20 Max',
    departure: 'Algiers Center (Place Audin)',
    physicalLevel: 'Cedar forest trekking of 3-4h. Accessible to beginners with standard physical condition.',
    inclusions: [
      'Accredited mountain guides',
      'Winter tents and sleeping pads',
      'Campfire dinner and traditional breakfast',
      'First-aid cover'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Cedar Forest Hike & Campfire', desc: 'Welcome briefing, hiking through towering cedars, setting up tents, and starting a warm sunset bonfire.' },
      { day: 'Day 2', title: 'Morning Rise & Return', desc: 'Traditional breakfast, high altitude ridge walks, group photo, and return transfer to Algiers.' }
    ],
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgYWQ3ohV_siOvNWCY6pcsqUZPnAUyZYNYjKjpUcvxjZPe2Nm2tbDbK6zA5YBS7iFNTkvurqoOW4xiE9QIXUIaDnJ5M0Sti_H3ysjUY6c1Y4oghXhR7C4sgkgjOEFKo2RIMAt3cQAcY18wYx-ZKUzdN2Y6FWizuHwm-XU_THlitHhOb45VFh1-10VawdPXnFsNFfU1yoPplN2rvFRYSItz8esn2-4oYYB3TuJCiJu6LwLIEFptH_n6Haa9xl6e5-uJJnMu-3beJ5s',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC1LgM_dpgqlqrG5T_ehJjD60W2M-pcyekmrIx8HidvvMHqAW0UBPkAKfUkBRwA709wMcUVTeE9uLHvVPMCYag58PRWyP59qf2EaiLj8E-Qbrj8arUIAU4m5Ea4CG7ckB_jxd4UUvV1Kk3atLbCs3VCyyxV0k4KBFARYR3EfMnGUvaL8VXpe6chDSOgonpsI2XpEItqgglG8ERGvm4_fvT0cn50lDWg71yp6NkpssTzSTkTJGJ8hWes-pxq5_Tv8oZtQs7lxJXlmMs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDa17PPlXhB7xwgOKujX8dE3KJcIpGOvtBSfZLSc1VvztLeuy3t4aQUg4fqftLsDGKwiVwFmor6yFkmMNb5g7BuwoSaKBXCYDOKVb0mzWZgB7oyaSNG2lXeqRTWPVtithlkm9ki2unqNa8v-X_puuMxdjE5OXLKL4S0aSdMT1e_kunebs3MOww_XXwImlVEohD6_-up6g5C_-VEHxD6FbKvbBrmIts2oImVsHrN_eky7yhjtLefaVNt9qKU3ndl_JXUY2M1kpQCgAk'
    ]
  },
  'tikjda-bivouac': {
    categoryTag: 'BIVOUAC ATLAS',
    duration: '2 Days',
    difficulty: 'Moderate',
    location: 'Tikjda, Kabylie',
    groupSize: '20 Max',
    departure: 'Algiers Center (Place Audin)',
    physicalLevel: 'Cedar forest trekking of 3-4h. Accessible to beginners with standard physical condition.',
    inclusions: [
      'Accredited mountain guides',
      'Winter tents and sleeping pads',
      'Campfire dinner and traditional breakfast',
      'First-aid cover'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Cedar Forest Hike & Campfire', desc: 'Welcome briefing, hiking through towering cedars, setting up tents, and starting a warm sunset bonfire.' },
      { day: 'Day 2', title: 'Morning Rise & Return', desc: 'Traditional breakfast, high altitude ridge walks, group photo, and return transfer to Algiers.' }
    ],
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgYWQ3ohV_siOvNWCY6pcsqUZPnAUyZYNYjKjpUcvxjZPe2Nm2tbDbK6zA5YBS7iFNTkvurqoOW4xiE9QIXUIaDnJ5M0Sti_H3ysjUY6c1Y4oghXhR7C4sgkgjOEFKo2RIMAt3cQAcY18wYx-ZKUzdN2Y6FWizuHwm-XU_THlitHhOb45VFh1-10VawdPXnFsNFfU1yoPplN2rvFRYSItz8esn2-4oYYB3TuJCiJu6LwLIEFptH_n6Haa9xl6e5-uJJnMu-3beJ5s',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC1LgM_dpgqlqrG5T_ehJjD60W2M-pcyekmrIx8HidvvMHqAW0UBPkAKfUkBRwA709wMcUVTeE9uLHvVPMCYag58PRWyP59qf2EaiLj8E-Qbrj8arUIAU4m5Ea4CG7ckB_jxd4UUvV1Kk3atLbCs3VCyyxV0k4KBFARYR3EfMnGUvaL8VXpe6chDSOgonpsI2XpEItqgglG8ERGvm4_fvT0cn50lDWg71yp6NkpssTzSTkTJGJ8hWes-pxq5_Tv8oZtQs7lxJXlmMs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDa17PPlXhB7xwgOKujX8dE3KJcIpGOvtBSfZLSc1VvztLeuy3t4aQUg4fqftLsDGKwiVwFmor6yFkmMNb5g7BuwoSaKBXCYDOKVb0mzWZgB7oyaSNG2lXeqRTWPVtithlkm9ki2unqNa8v-X_puuMxdjE5OXLKL4S0aSdMT1e_kunebs3MOww_XXwImlVEohD6_-up6g5C_-VEHxD6FbKvbBrmIts2oImVsHrN_eky7yhjtLefaVNt9qKU3ndl_JXUY2M1kpQCgAk'
    ]
  },
  'jijel': {
    categoryTag: 'COASTAL TREK',
    duration: '3 Days',
    difficulty: 'Moderate',
    location: 'Jijel coves',
    groupSize: '15 Max',
    departure: 'Jijel Central Station',
    physicalLevel: 'Coastal cliff walk of 4-5h daily. Capable swimmer highly recommended.',
    inclusions: [
      'Professional coast guides',
      'Premium camping setup',
      'Snorkeling gear & security vest',
      'All meals & fresh seafood dinners'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Coastal Path Hike', desc: 'Arrival in Jijel, start hike along the red rocks and setup basecamp near a secluded cove.' },
      { day: 'Day 2', title: 'Secret Beach & Snorkeling', desc: 'Exploring hidden caves, wild beach swims, snorkeling, and campfire under the stars.' },
      { day: 'Day 3', title: 'Scenic Ridge & Departure', desc: 'Short morning walk to the lighthouse, farewell seafood lunch, and shuttle return.' }
    ],
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgYWQ3ohV_siOvNWCY6pcsqUZPnAUyZYNYjKjpUcvxjZPe2Nm2tbDbK6zA5YBS7iFNTkvurqoOW4xiE9QIXUIaZen94Ld7WjGj602p-xT7P-51Yy1Wk9QYjKqk2QRe1YFHKaO6C0rWwLd7WjGj602p-xT7P-51Yy1Wk9QYjKqk2QRe1YFHKaO6C0rWwLd7WjGj602p-xT7P-51',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuALilPKig5ZquRh8gOLEg_9o1fHQleAd4_1-zkeRgzRHHQgFDf7cwan32ekskYEXvSzQjjOLi8LgwRMGGJrkC2ISPJT9zd3u0U57TK6bobZBE0bd-Zbq8ZNnH4EzXQnUDO2HNHxC8NuWSycGUaQvF7ql-mDpFKjt0DmomSD7NtE9625leVJ83jTBi9jBewH1YyORf0gdm9VRN4lAG6u_2D2myw-OkiOAnu4P_m5N2XyUBCcMWJudN744pjhYp6yiswPaQ_QisftPgs'
    ]
  },
  'sahara-tadrat': {
    categoryTag: 'EXPÉDITION SUD',
    duration: '5 Days',
    difficulty: 'Difficult',
    location: 'Saharan desert',
    groupSize: '12 Max',
    departure: 'Djanet Airport',
    physicalLevel: 'Daily desert walks of 5h. Desert heat adaptation required.',
    inclusions: [
      'Certified Touareg guides',
      'Saharan meals & bread baked in sand',
      'Camping setups under open skies',
      'Saharan assistance coverage'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Tissili Gate Arrival', desc: 'Transfer from Djanet, setting up the dunes campsite.' },
      { day: 'Day 2-3', title: 'Deep Sahara Sand Dunes', desc: 'Ascending the towering orange dunes of Moul Naga.' },
      { day: 'Day 4-5', title: 'Ancient Rock Art & Departure', desc: 'Viewing Saharan engravings, tea rituals, and return shuttle.' }
    ],
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuALilPKig5ZquRh8gOLEg_9o1fHQleAd4_1-zkeRgzRHHQgFDf7cwan32ekskYEXvSzQjjOLi8LgwRMGGJrkC2ISPJT9zd3u0U57TK6bobZBE0bd-Zbq8ZNnH4EzXQnUDO2HNHxC8NuWSycGUaQvF7ql-mDpFKjt0DmomSD7NtE9625leVJ83jTBi9jBewH1YyORf0gdm9VRN4lAG6u_2D2myw-OkiOAnu4P_m5N2XyUBCcMWJudN744pjhYp6yiswPaQ_QisftPgs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCEEmn9z6QbsHIndR-iAc-v7wdAlUZBzGEIGFO_TJ1rf9DNQaATfBWPHXsZ1XXMpn96x22J1SmZEdvWUNE4KYdYKUTKRqBUasYEA4M_51Pv75jxae98-GVA2KRM_OQkSRtd0Qmi_NvsdJMrDSh_TS0vGiL-3ienFmCZMk_7kgt-8-OPvwoynkZUPtBfuw4TRgP4nN7fTbOcQDzHyHF2698Yoj9FeSTE7VvSFEyRkM8Kbhw1cv4UKpN3m9naDdwdAXSVyB5yY28vDwM'
    ]
  }
};

export default function ExpeditionDetailsPage({ selectedTrip, onBookTrip, onBack }) {
  // Extract or fallback trip details
  const details = tripDetailsMap[selectedTrip.id] || tripDetailsMap['tassili-tadrat'];
  
  return (
    <div className="pt-20 pb-24 md:pb-0 bg-brand-bg min-h-screen relative font-work text-brand-dark">
      
      {/* Back Button Link */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-space font-black uppercase tracking-wider text-brand-orange hover:text-brand-orangeDark transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Expeditions</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[300px] md:h-[550px] overflow-hidden flex items-end pb-8 md:pb-16 px-6 md:px-16 mt-4">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            src={selectedTrip.image} 
            alt={selectedTrip.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="font-space font-black text-[10px] md:text-xs text-brand-sand bg-brand-orange px-4 py-1.5 border border-brand-forestDark shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full mb-3 md:mb-4 inline-block uppercase tracking-widest">
            {details.categoryTag}
          </span>
          
          <h1 className="font-syne text-2xl md:text-7xl font-black text-white max-w-4xl tracking-tight leading-none uppercase">
            {selectedTrip.title}
          </h1>
        </div>
      </section>

      {/* Technical Summary Bar */}
      <section className="max-w-7xl mx-auto px-6 -translate-y-8 z-20 relative">
        <div className="bg-white border-2 border-brand-forestDark hard-shadow p-4 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 rounded">
          
          {/* Duration */}
          <div className="flex flex-col gap-1 border-r border-brand-forest/10 pr-2 md:pr-4">
            <span className="font-space font-black text-[9px] md:text-[10px] text-brand-dark/45 uppercase tracking-wider">
              Duration
            </span>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-brand-orange" />
              <span className="font-syne font-bold text-sm md:text-lg text-brand-forestDark">
                {details.duration}
              </span>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex flex-col gap-1 md:border-r border-brand-forest/10 pr-2 md:pr-4">
            <span className="font-space font-black text-[9px] md:text-[10px] text-brand-dark/45 uppercase tracking-wider">
              Difficulty
            </span>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-brand-orange" />
              <span className="font-syne font-bold text-sm md:text-lg text-brand-forestDark">
                {details.difficulty}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1 border-r border-brand-forest/10 pr-2 md:pr-4">
            <span className="font-space font-black text-[9px] md:text-[10px] text-brand-dark/45 uppercase tracking-wider">
              Location
            </span>
            <div className="flex items-center gap-1.5 md:gap-2">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-brand-orange" />
              <span className="font-syne font-bold text-sm md:text-lg text-brand-forestDark">
                {details.location}
              </span>
            </div>
          </div>

          {/* Group size */}
          <div className="flex flex-col gap-1 pl-2 md:pl-0">
            <span className="font-space font-black text-[9px] md:text-[10px] text-brand-dark/45 uppercase tracking-wider">
              Group Size
            </span>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-brand-orange" />
              <span className="font-syne font-bold text-sm md:text-lg text-brand-forestDark">
                {details.groupSize}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Two Column Layout: Itinerary & Logistics */}
      <section className="max-w-7xl mx-auto px-6 py-6 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        {/* Itinerary (Left - 8 Cols) */}
        <div className="lg:col-span-8">
          <h2 className="font-syne text-2xl md:text-4xl font-black text-brand-forestDark mb-8 border-b-2 border-brand-forestDark pb-4 uppercase">
            Scannable Itinerary
          </h2>
          
          <div className="space-y-12 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-brand-forest/15">
            {details.itinerary.map((step, idx) => (
              <div key={idx} className="relative pl-12 group">
                {/* Indicator Node */}
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-brand-bg transition-all ${
                  idx === 0 
                    ? 'bg-brand-orange ring-2 ring-brand-orange' 
                    : 'bg-brand-forest/25 group-hover:bg-brand-orange'
                }`}></div>
                
                <h3 className="font-syne text-xl font-bold text-brand-forestDark mb-2">
                  {step.day} : {step.title}
                </h3>
                <p className="text-brand-dark/70 font-medium leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Logistics (Right - 4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Logistics Sand Well Box */}
          <div className="bg-brand-sand p-8 border-2 border-brand-forestDark hard-shadow rounded">
            <h3 className="font-space font-black text-xs text-brand-orange uppercase mb-6 tracking-widest">
              Logistics details
            </h3>
            
            <div className="space-y-6">
              <div>
                <span className="block font-space font-bold text-xs text-brand-forestDark/50 uppercase mb-1">
                  Departure Point
                </span>
                <p className="text-brand-forestDark font-bold text-sm">
                  {details.departure}
                </p>
              </div>
              
              <div>
                <span className="block font-space font-bold text-xs text-brand-forestDark/50 uppercase mb-1">
                  Physical Level
                </span>
                <p className="text-brand-dark/70 font-medium text-sm leading-relaxed">
                  {details.physicalLevel}
                </p>
              </div>

              <div>
                <span className="block font-space font-bold text-xs text-brand-forestDark/50 uppercase mb-2">
                  What is included
                </span>
                <ul className="space-y-2">
                  {details.inclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-brand-dark/75 font-medium leading-tight">
                      <CheckCircle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing & Reservation Trigger Card */}
          <div className="bg-brand-forestDark text-white p-8 border-2 border-brand-forestDark hard-shadow rounded">
            <div className="mb-6">
              <span className="font-space font-bold text-[10px] text-brand-sand/60 uppercase tracking-widest block mb-1">
                Rate per person
              </span>
              <p className="font-syne text-4xl font-black text-brand-sand">
                {selectedTrip.price || selectedTrip.priceRaw || '65.000 DA'}
              </p>
            </div>
            
            <button 
              onClick={() => onBookTrip(selectedTrip)}
              className="w-full bg-brand-orange text-white font-space font-black text-sm uppercase py-4 px-6 rounded border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex justify-center items-center gap-3"
            >
              <span>Register for Expedition</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <p className="mt-4 text-[10px] text-brand-sand/65 text-center italic font-medium">
              Available Dates: October — March
            </p>
          </div>

        </div>

      </section>

      {/* Captured Moments Gallery Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 border-t border-brand-forest/10">
        <h2 className="font-syne text-2xl md:text-5xl font-black text-brand-forestDark mb-8 md:mb-12 text-center uppercase tracking-tight">
          Captured Moments
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {details.gallery.map((imgUrl, i) => (
            <div 
              key={i} 
              className={`overflow-hidden border-2 border-brand-forestDark rounded transition-all duration-500 hover:grayscale-0 hover:scale-101 shadow-sm ${
                i === 0 ? 'aspect-[3/4] grayscale' :
                i === 1 ? 'aspect-square md:aspect-auto md:row-span-2 grayscale' :
                i === 2 ? 'aspect-video md:col-span-2 grayscale' :
                'aspect-square grayscale'
              }`}
            >
              <img 
                className="w-full h-full object-cover" 
                src={imgUrl} 
                alt="Desert Captured Moment"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t-2 border-brand-forestDark p-4 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-space font-black text-[9px] text-brand-dark/45 uppercase tracking-wider">Rate per person</span>
            <span className="font-syne font-black text-xl text-brand-orange leading-none">
              {selectedTrip.price || selectedTrip.priceRaw || '65.000 DA'}
            </span>
          </div>
          <button 
            onClick={() => onBookTrip(selectedTrip)}
            className="flex-grow bg-brand-orange text-white font-space font-black text-xs uppercase py-3.5 px-4 rounded border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] active:translate-y-0.5 active:shadow-none transition-all flex justify-center items-center gap-2"
          >
            <span>Book Expedition</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
